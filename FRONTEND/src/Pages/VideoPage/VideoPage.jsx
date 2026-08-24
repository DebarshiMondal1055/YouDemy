import React, { useState,useEffect } from 'react'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import { useParams , Link } from 'react-router-dom';
import { useCustomGetRequest } from '../../Hooks/customGetReactQuery';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '../../Context/AuthenticationContext';
import { formatRelativeTime } from '../../utils/formatRelativeTime';


const VideoPage = ({showSideNavbar}) => {

    const {user}=useAuthContext();
    const queryClient=useQueryClient()  //initialise the client provided by QueryClientProvider
    const [commentDescription,setcommentDescription]=useState("")
    const {videoId}=useParams();

    useEffect(()=>{
        ;(async()=>{
            try {
                const response=await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/users/v/${videoId}`)
            } catch (error) {
                console.error(error)
            }
        })()
    },[])
    const {data,error,isLoading:loading}=useQuery({
        queryKey:['video',videoId],
        queryFn:async()=>{
            const response=await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/videos/v/${videoId}`);
            return (response.status>=200 && response.status<300)?response.data.data:null;
        }
    })


    const {data:commentsData,isLoading:commentsLoading,isError,error:commentError}=useQuery({
        queryKey:['comments',videoId],
        queryFn:async()=>{
            const response= await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/comments/v/${videoId}`)
            return response.data.data
        }
    })
    

    
    
    const addCommentHandler=async()=>{
        try {
            const response=await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/comments/${videoId}`,
                {content:commentDescription});
            queryClient.invalidateQueries(['comments',videoId]);
            setcommentDescription("");
        } catch (error) {
            console.error(error);
        }

    }

    const toggleSubscribe=async ()=>{
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/subscriptions/c/${data?.owner._id}`, {}, { withCredentials: true });
            const {isSubscribed,subscriptionCount}=response.data.data;
            queryClient.setQueryData(['video',videoId],(prev)=>({...prev,isSubcribed:isSubscribed,subcribersCount:subscriptionCount}))
        } catch (error) {
            console.error(error);
        }

    }

    const toggleLike=async()=>{
        try{
            const response =await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/likes/toggle/v/${videoId}`,{},{withCredentials:true});
            const {isLiked,likesCount}=response.data.data;
            queryClient.setQueryData(['video',videoId],(prev)=>({...prev,isLiked:isLiked,likesCount:likesCount}))
        }catch(error){
            console.error(error)
        }
    }

    const {data:suggestions,isLoading,isError:suggestionIsError,error:suggestionError}=useQuery({
        queryKey:['suggestedVideos',videoId,data?.title],
        enabled:  !!data?.title && !!data?.category,
        queryFn: async () => {
        try {
            const [resByTitle, resByCategory] = await Promise.all([
            axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/videos/get-all-videos?query=${data?.title}`),
            axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/videos?category=${data?.category}`)
            ]);

            const videosByTitle = resByTitle.status === 200 ? resByTitle.data.data : [];
            const videosByCategory = resByCategory.status === 200 ? resByCategory.data.data : [];

            const seenIds = new Set();
            const allSuggestions=[];

            [...videosByTitle, ...videosByCategory].forEach((video) => {
                if(video._id!==videoId && !seenIds.has(video._id)){
                    seenIds.add(video._id);
                    allSuggestions.push(video)
                }
            });

            return allSuggestions;
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            return [];
        }
        },
    })

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert("Video URL copied to clipboard!");
        } catch (err) {
            console.error("Failed to copy: ", err);
            alert("Failed to copy URL.");
        }
    };

    if(loading) {
            return (
                <div className="w-full h-screen flex justify-center items-center bg-black text-white text-2xl">
                Loading video...
                </div>
            );
        }
    if(commentsLoading){
            return (
                <div className="w-full h-screen flex justify-center items-center bg-black text-white text-2xl">
                Comments Loading ...
                </div>
            );     
    }
    
    return (
    <>
    <div className={`flex w-full bg-black box-border py-12 pl-4 justify-center ${showSideNavbar ? 'ml-[280px]' : ''}`}>

        <div className='flex flex-col max-w-[875px] w-[100%]'>
        <div className='w-full'>
            <video controls autoPlay width={400}
                className='w-full rounded-lg'
            > 
                
                <source 
                    type='video/mp4'
                    src={data?.videoFile}/>
                <source type='video/webm'
                    src={data?.videoFile}/>
                Your Browser does not support the video tag
            </video>
        </div>
        <div className='flex flex-col text-white px-2 font-bold text-2xl '>
            <div>
                {data?.title}
            </div>

        </div>
        <div className='flex justify-between mt-4 text-white'>
                <div className='flex gap-4'>
                    <div className='w-[45px] h-[45px] cursor-pointer'>
                        <img className='rounded-full w-full h-full' 
                        src={data?.owner.avatar} alt="" />
                    </div>
                    <div className='flex flex-col  '>
                        <Link to={`/users/${data?.owner.username}`} className='font-medium text-lg cursor-pointer'>{data?.owner.username}</Link>
                        <div className='text-gray-400'>
                            {data?.subcribersCount} Subscribers
                        </div>
                    </div>
                    <div className='flex items-center'>
                        <button onClick={toggleSubscribe}
                            className='rounded-full  bg-red-600 px-4 py-2  text-lg cursor-pointer hover:bg-red-400'
                        >{data.isSubcribed?"Unsubscribe":"Subscribe"}</button>
                    </div>
                </div>
                <div className='flex gap-2   '>
                    <div onClick={toggleLike}
                        className='flex hover:bg-gray-500 cursor-pointer gap-2 justify-center items-center px-[10px] py-[10px] box-border rounded-2xl bg-[#212121]'>
                        <div className=''>
                            <ThumbUpOffAltIcon style={data?.isLiked?{color:"green"}:{color:"white"}}/>
                        </div>
                        <div className={(data?.isLiked)?"text-green-600":"text-white"}>
                            {data?.likesCount} Likes
                        </div>
                    </div>
                    <div className='justify-center hover:bg-gray-500 items-center px-[10px] py-[10px] box-border rounded-2xl bg-[#212121]'>
                        <div className='cursor-pointer' onClick={handleShare}>
                                <ShareIcon/>
                        </div>
                    </div>
                </div>

                
        </div>

        <div className='flex flex-col mt-4 w-full rounded-2xl bg-[#313131] px-4 py-2 text-white'>
            <div className='flex gap-4'>
                 <div>
                    {data?.views} Views
                 </div>
                 <div>
                    {formatRelativeTime(data?.createdAt)}
                 </div>
            </div>
            <div className='mt-2'>
                <p>{data?.description}</p>
            </div>
        </div>
        <div className='flex flex-col text-white mt-4 w-full'>
            <h1 className='text-2xl font-medium'>{commentsData?.comments.length} Comments</h1>
            <div className='flex gap-2 mt-[10px]'>
                <img className='h-[42px] w-[42px] rounded-full' 
                src={user?.avatar} alt="" />
            <div className='w-[80%] flex border-b-2  border-b-gray-300'>
                    <input  className='bg-black h-[42px] focus:outline-none w-full
                    border-none text-white text-[18px]'
                    value={commentDescription} 
                    onChange={(e)=>setcommentDescription(e.target.value)}
                    type="text" name="" id="" placeholder='Add a comment'/>
                    
            </div>
            <button onClick={addCommentHandler}  disabled={commentDescription===""}
            className='h-[42px] cursor-pointer w-[20%] text-white bg-[#212121] text-lg hover:bg-[#6b737a] rounded-3xl px-4 py-2'>Add</button>
            </div>
            
            {commentsData?.comments?.map((comment,index)=>{

                return  <div key={index} className='mt-10 flex justify-between text-white w-full'>
                            <div className='flex  gap-4'>
                                <div className='flex gap-2 justify-center items-center cursor-pointer'>
                                    <img className='h-[42px] w-[42px] rounded-full' 
                                    src={comment.owner.avatar} alt="" />
                                </div> 
                                <div className='flex flex-col gap-2'>
                                    <div className='flex gap-2'>
                                        <div className='font-bold cursor-pointer'>
                                            {comment.owner.username}
                                        </div>
                                        <div className='text-gray-400 font-light '>
                                            {formatRelativeTime(comment.createdAt)}
                                        </div>
                                    </div>
                                    <div>
                                    {comment.content}
                                    </div>
                                </div>
                            </div>
                </div> 
            })}
            
               

        </div>
      </div>

            <div className='w-[100%] max-w-[420px] py-[10px] px-[15px] flex flex-col gap-5 text-white'>
                {suggestions?.map((suggestion,index)=>(
                    <Link to={`/watch/${suggestion._id}`}  key={index} className='flex cursor-pointer gap-2 justify-center items-center'>
                    <div className='w-[168px] h-[94px]'>
                        <img className='w-full h-full rounded-xl'
                        src={suggestion.thumbnail} alt="" />
                    </div>
                    <div className='flex flex-col text-white gap-[3px]'>
                        <div className='mb-[5px] font-bold '>
                            {suggestion.title}
                        </div>
                        <div className='text-gray-400'>
                            {suggestion.owner.username}
                        </div>
                        <div className='text-gray-400 font-light'>{suggestion.views} Views ~ {formatRelativeTime(suggestion.createdAt)} </div>
                    </div>
                </Link>  
                ))}

  
            </div>  
        </div>
    </>

      
  )
}

export default VideoPage
