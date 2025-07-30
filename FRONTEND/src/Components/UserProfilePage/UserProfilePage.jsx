import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { formatRelativeTime } from '../../utils/formatRelativeTime';
const UserProfilePage = ({showSideNavbar}) => {
    const {username}=useParams();
    const [userData,setUserData]=useState({});
    const [videos,setVideos]=useState([]);
    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/users/c/${username}`, {
            withCredentials: true
            });
            setUserData(response.data.data);
        } catch (error) {
            console.error(error?.response?.data?.message || error.message);
        }
        };
        fetchUserData();
    }, [username]);
    const {_id,fullname,avatar,coverImage,subscribersCount}=userData;

    const toggleSubscribe=async ()=>{
        try {
            const response = await axios.post(`/api/v1/subscriptions/c/${_id}`, {}, { withCredentials: true });
            const {isSubscribed,subscriptionCount}=response.data.data;
            setUserData((prev)=>({...prev,subscribersCount:subscriptionCount,isSubscribed:isSubscribed}))
        } catch (error) {
            console.error(error);
        }

    }
    


    useEffect(()=>{
        const fetchVideoDetails=async()=>{
            try {
                if(!_id) return;
                const response=await axios.get(`/api/v1/videos/${_id}`,
                    {withCredentials:true})
                
                setVideos(response.data.data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchVideoDetails()
    },[_id])

    
    return (
    <div className={`flex flex-col gap-4 ${showSideNavbar ? 'ml-[280px]' : 'ml-0'} bg-black py-4 px-4 text-white min-h-[92vh] w-full overflow-x-hidden `}>
        <div className='w-full flex justify-center h-[300px] mt-2 '>
            <div className='w-[70%] h-full'>
                <img className='w-full h-full object-cover rounded-2xl ' 
                    src={coverImage} alt="" />
            </div>
        </div>
        <div className='w-full flex justify-center'>
        <div className='w-[70%] flex px-4 py-6 gap-5 items-center  border-b-gray-300 border-b-2 '>
            <div className='w-[15%]'>
                <img className='w-full h-full rounded-full'
                src={avatar} alt="" />
            </div>
            <div className='flex flex-col gap-2 '>
                <div className='text-2xl font-bold'>
                    {fullname}
                </div>
                <div>
                    @{username}
                </div>
                <div className='flex gap-2 text-gray-400 font-light'>
                    <div>{subscribersCount} subscribers</div>
                </div>
                <button onClick={toggleSubscribe} 
                className='cursor-pointer bg-red-500 py-2 px-4 flex justify-center items-center rounded-full'>
                    {(userData.isSubscribed)?"Unsubscribe":"Subscribe"}</button>
            </div>
        </div>
        </div>
        <div className='w-full flex justify-center text-white '>
            <div className='w-[70%] flex  justify-between'>
                <div className='bg-gray-600 hover:border-b-2 hover:border-b-gray-400 px-4 py-2 w-[300px] text-lg flex justify-center items-center '>
                    Videos
                </div >
                <Link to={`/users/${username}/courses`} className='hover:border-b-2 hover:border-b-gray-400 px-4 py-2 w-[300px] text-lg flex justify-center items-center cursor-pointer'>
                    Courses
                </Link >
                <Link to={`/users/${username}/tweets`} className='hover:border-b-2 hover:border-b-gray-400 cursor-pointer px-4 py-2 w-[300px] text-lg flex justify-center items-center'>
                    Tweets
                </Link>
            </div>
        </div>
        <div className=' mt-2 w-full flex justify-center '>
            <div className=' flex flex-wrap gap-[20px]   w-[70%] '>
                {videos.map((video,index)=>{
                    return <Link key={index} to={`/watch/${video._id}`} className=' flex flex-col gap-2 w-[240px]  cursor-pointer text-white'>
                        <div className='w-full h-[150px]'>
                            <img className='w-full h-full rounded-lg '
                            src={video.thumbnail} alt="" />
                        </div>
                        <div className='flex flex-col gap-1 w-full'>
                            <p className='font-medium text-md'>{video.title}</p>
                            <div className='text-gray-400 font-light'>
                                {video.views} views ~ {formatRelativeTime(video.createdAt)}
                            </div>
                        </div>
                    </Link>}
                )}
                

        </div>
        </div>
    </div>
  )
}

export default UserProfilePage
