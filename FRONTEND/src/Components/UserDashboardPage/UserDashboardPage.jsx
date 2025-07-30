import React from 'react'
import { useState,useEffect } from 'react';
import UpdateUser from '../UpdateUser/UpdateUser';
import { useAuthContext } from '../../Context/AuthenticationContext';
import UpdateAvatar from '../UpdateAvatar/UpdateAvatar';
import UpdateCoverImage from '../UpdateCoverImage/UpdateCoverImage';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import UpdateVideo from '../UpdateVideo/UpdateVideo';
import NewCourse from '../NewCourse/NewCourse';

const formatDuration = (durationInSeconds) => {
  const seconds = parseInt(durationInSeconds, 10);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  } else {
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }
};


const UserDashboardPage = ({showSideNavbar}) => {
    const queryClient=useQueryClient();
    const {user}=useAuthContext()
    const [updateUser,setUpdateUser]=useState(false);
    const [updateAvatar,setUpdateAvatar]=useState(false);
    const [tweetContent, setTweetContent] = useState('');
    const [updateCoverImage,setUpdateCoverImage]=useState(false);
    const [selectedVideo,setSelectedVideo]=useState(null); //updation


    const [createCourse,setCreateCourse]=useState(false);

    const [addedVideos,setAddedVideos]=useState([]);    //creating course

    const [updateVideo,setUpdateVideo]=useState(false);
    const [done,setDone]=useState(false);

    const cancelDone=()=>{
        setDone(false);
    }

    const cancelUpdateVideo=()=>{
        setUpdateVideo(false);
    }

    const cancelUpdateUser=()=>{
        setUpdateUser(false);
    }
    const popUpUpdateUser = () => {
        setUpdateUser(true);
    };

    const cancelUpdateAvatar=()=>{
      setUpdateAvatar(false);
    }

    const cancelUpdateCoverImage=()=>{
      setUpdateCoverImage(false);
    }

    const handleAddTweet=async()=>{
        try {
          const data={content:tweetContent}
          const response=await axios.post('/api/v1/tweets/create-tweet',data,{withCredentials:true});
          if(response.status===200){
            alert("Tweet Added Successfully");
            return null;
          }
        } catch (error) {
            alert("Failed to add tweet");
          console.error(error);
          return null;
        }
    }

    const {data,isLoading,isError,error}=useQuery({
        queryKey:['userVideos'],
        queryFn:async()=>{
            try {
                const response=await axios.get(`/api/v1/videos/${user?._id}`);
                return response.status===200?response.data.data:[];
            } catch (error) {
                console.error(error);
                return [];
            }
        },
        enabled:!!user?._id
    })

    const deleteVideoMutation = useMutation({
        mutationFn: async (videoId) => {
            const response1=await axios.post(`/api/v1/videos/v/${videoId}`,{}, { withCredentials: true });
            const response2=await axios.post(`/api/v1/likes/delete/v/${videoId}`,{},{withCredentials:true});
            if(response2.status!==200) console.log("Something wrong in Likes")
            const response3=await axios.post(`/api/v1/playlists/v/${videoId}`,{},{withCredentials:true});
            if(response3.status!==200)
            return response1;
        },
        onSuccess: (_, videoId) => {
            queryClient.invalidateQueries(['courses',user?._id])
            queryClient.setQueryData(['userVideos'], (oldVideos = []) =>
            oldVideos.filter((v) => v._id !== videoId)
            );
        },
        onError: (error) => {
            console.error("Failed to delete video:", error);
            alert("Failed to delete video.");
        },
    });

    const checkBoxHandler=(videoId,status)=>{
        setAddedVideos((prevVideos)=>status==false?
        prevVideos.filter((id)=>id!==videoId):[...prevVideos,videoId]    
        )
    }

    return (
    <div className={`flex flex-col gap-4 ${showSideNavbar ? 'ml-[280px]' : 'ml-0'} bg-black py-4 px-4 text-white min-h-[92vh] w-full overflow-x-hidden `}>
        <div>
            <div className="relative">
                <img onClick={()=>setUpdateCoverImage(true)} 
                src={user?.coverImage} alt="Cover" className="cursor-pointer w-full h-100 object-cover" />
                <div className="absolute bottom-0 left-0 p-4 flex items-end gap-4">
                <img onClick={()=>setUpdateAvatar(true)} 
                src={user?.avatar} alt="Avatar" className="cursor-pointer w-24 h-24 rounded-full border-4 border-black" />
                <div>
                    <h1 className="text-2xl font-bold">{user?.username}</h1>
                    <button
                    onClick={popUpUpdateUser}
                    className="mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-full text-sm font-medium"
                    >
                    Update Profile
                    </button>
                </div>
                </div>
            </div>

            {/* Tweet Section */}
            <div className="mt-16 border-t border-gray-800 pt-4">
                <h2 className="text-xl font-semibold mb-4">Post a Tweet</h2>
                <div className="flex gap-2">
                <textarea
                    value={tweetContent}
                    onChange={(e) => setTweetContent(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-[90%] p-3 bg-gray-900 rounded-lg text-white resize-none h-35"
                    maxLength={280}
                />
                <button
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-2xl font-medium w-[10%]"
                    disabled={!tweetContent.trim()}
                    onClick={handleAddTweet}
                >
                    POST
                </button>
                </div>
            </div>

            {/* Videos Section */}
            <div className="mt-8">
                <div className='flex justify-between px-4'>
                    <h2 className="text-xl font-semibold mb-4">Your Videos</h2>
                    {!createCourse?<button onClick={()=>setCreateCourse(true)} 
                    className='bg-emerald-600 hover:bg-emerald-400 cursor-pointer px-4 py-2 text-lg rounded-3xl'>+ Course</button>:""}
                    {
                        createCourse?<div className='flex gap-4'>
                            <button onClick={()=>setDone(true)} 
                              disabled={addedVideos.length === 0}
                            className='bg-emerald-600 hover:bg-emerald-400 cursor-pointer px-3 py-1 text-lg rounded-3xl'>Done</button>
                            <button onClick={()=>{setCreateCourse(false)
                                setAddedVideos([]);
                            }} 
                            className='bg-red-600 hover:bg-red-400 cursor-pointer px-3 py-1 text-lg rounded-3xl'>Cancel</button>
                        </div>:""
                    }
                </div>
                <div className="flex flex-col gap-4">
                {data?.map((video,index) => (
                    <div key={index} className="flex items-center gap-4 p-2 hover:bg-gray-900 rounded-lg">
                    <img src={video.thumbnail} alt={video.title} className="w-40 h-24 object-cover rounded" />
                    <div className="flex-1">
                        <h3 className="font-medium">{video.title}</h3>
                        <p className="text-sm text-gray-400">{video.views} views • {video.uploaded}</p>
                        <p className="text-sm text-gray-400">Duration: {formatDuration(video.duration)}</p>
                    </div>
                    <div className="flex gap-2">
                        {createCourse?<input type="checkbox" name="" id=""
                            className='w-6 h-6'
                            onChange={(e)=>checkBoxHandler(video._id,e.target.checked)}
                        />:""}
                        <button
                        onClick={()=>{setUpdateVideo(true)
                            setSelectedVideo(video)
                        }}
                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                        >
                        Update
                        </button>
                        <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete this video?")) {
                                deleteVideoMutation.mutate(video._id);
                            }
                        }}
                        className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
                        >
                        Delete
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            </div>
        </div>
        {
            updateUser  && <UpdateUser cancelUpdateUser={cancelUpdateUser}/>||
            updateAvatar && <UpdateAvatar cancelUpdateAvatar={cancelUpdateAvatar}/> ||
            updateCoverImage && <UpdateCoverImage cancelUpdateCoverImage={cancelUpdateCoverImage}/> ||
            updateVideo && <UpdateVideo cancelUpdateVideo={cancelUpdateVideo} selectedVideo={selectedVideo}/> ||
            done && <NewCourse cancelDone={cancelDone} addedVideos={addedVideos} />
        }
    </div>
  )
}

export default UserDashboardPage;
