import React from 'react'
import { useState,useEffect } from 'react';
import { useParams,Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '../../Context/AuthenticationContext';
const formatRelativeTime = (createdAt) => {
  const now = new Date();
  const date = new Date(createdAt);
  const diffInSeconds = Math.floor((now - date) / 1000);
  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;
  const secondsInWeek = 604800;
  const secondsInMonth = 2592000; // Approx 30 days
  const secondsInYear = 31536000; // Approx 365 days

  if (diffInSeconds < secondsInMinute) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < secondsInHour) {
    const minutes = Math.floor(diffInSeconds / secondsInMinute);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < secondsInDay) {
    const hours = Math.floor(diffInSeconds / secondsInHour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < secondsInWeek) {
    const days = Math.floor(diffInSeconds / secondsInDay);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < secondsInMonth) {
    const weeks = Math.floor(diffInSeconds / secondsInWeek);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }
  if (diffInSeconds < secondsInYear) {
    const months = Math.floor(diffInSeconds / secondsInMonth);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  }
  const years = Math.floor(diffInSeconds / secondsInYear);
  return `${years} year${years > 1 ? 's' : ''} ago`;
};
const UserCoursePage = ({showSideNavbar}) => {
    const {username}=useParams();
    const {user}=useAuthContext()
    const [userData,setUserData]=useState({});
    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.BACKEND_BASE_URL}/api/v1/users/c/${username}`, {
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
            const response = await axios.post(`${import.meta.env.BACKEND_BASE_URL}/api/v1/subscriptions/c/${_id}`, {}, { withCredentials: true });
            const {isSubscribed,subscriptionCount}=response.data.data;
            setUserData((prev)=>({...prev,subscribersCount:subscriptionCount,isSubscribed:isSubscribed}))
        } catch (error) {
            console.error(error);
        }

    }
    
    const {data:courses,isLoading,isError,error}=useQuery({
        queryKey:['courses',_id],
        queryFn:async()=>{
            try {
                const response=await axios.get(`/api/v1/playlists/p/users/${_id}`)
                return response.status===200?response.data.data:null;
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        staleTime:Infinity,
        enabled:!!_id
    })
    
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
                <Link to={`/users/${username}`} className=' hover:border-b-2 hover:border-b-gray-400 px-4 py-2 w-[300px] text-lg flex justify-center items-center cursor-pointer'>
                    Videos
                </Link >
                <div className='bg-gray-600 hover:border-b-2 hover:border-b-gray-400 px-4 py-2 w-[300px] text-lg flex justify-center items-center '>
                    Courses
                </div >
                <Link to={`/users/${username}/tweets`} className='hover:border-b-2 hover:border-b-gray-400 cursor-pointer px-4 py-2 w-[300px] text-lg flex justify-center items-center'>
                    Tweets
                </Link>
            </div>
        </div>
        <div id="courseDetails" className='mt-6 w-full flex flex-col gap-10 items-center'>
        {isLoading && <div className='text-white'>Loading...</div>}
        {isError && <div className='text-red-400'>Failed to load courses</div>}
        {!isLoading && courses?.length === 0 && <div className='text-gray-300'>No courses found.</div>}
        
        {courses?.map((course,index) => (
            <div key={index} className='w-[70%] flex flex-col gap-4 '>
            {/* Course Title */}
            <h2 className='text-2xl font-semibold text-white pl-4'>{course.name}</h2>

            {/* Horizontal scrollable video list */}
            <div className='flex overflow-x-auto gap-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent pb-2 pl-4 pt-4'>
                {course?.videoList?.map((video,index) => {

                return (
                    <Link 
                    to={`/watch/${video._id}`}
                    key={index}
                    className='min-w-[240px] bg-[#1e1e1e] rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300'
                    >
                    <div className='w-full h-[140px]'>
                        <img
                        src={video.thumbnail || '/default-thumbnail.jpg'}
                        alt={video.title}
                        className='w-full h-full object-cover'
                        />
                    </div>
                    <div className='p-3 flex flex-col gap-1 text-white'>
                        <p className='text-sm font-semibold line-clamp-2'>{video.title}</p>
                        <p className='text-xs text-gray-400'>
                        {video.views} views
                        </p>
                    </div>
                    </Link>
                );
                })}
            </div>
            </div>
        ))}
        </div>

    </div>
  )
}

export default UserCoursePage;
