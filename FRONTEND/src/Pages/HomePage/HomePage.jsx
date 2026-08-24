import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'
import {Link,NavLink} from 'react-router-dom'
import { categories } from '../../utils/categories';
const HomePage = ({showSideNavbar}) => {
  const queryClient=useQueryClient();

  const [category,setCategory]=useState("");

  const {data,isLoading,isError,error}=useQuery({
    queryKey:['homeVideos',category],
    queryFn:async()=>{
      try {
        const response=await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/videos?category=${category}`)
        return (response.status===200)?response.data.data:[];
      } catch (error) {
        console.error(error)
        return [];
      }
    },
  })

  const handleHomePageVideos=(skill)=>{
      setCategory(skill);
      queryClient.invalidateQueries(['homeVideos']);
  }

  if(isLoading){
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black text-white text-2xl">
        Loading Home Page...
      </div>
    );
  }

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

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

  return (
    <div className={`flex flex-col ${showSideNavbar ? 'ml-[280px]' : 'ml-0'} bg-black top-[64px] min-h-[92vh] w-full overflow-x-hidden`}>
        <div id='homePage-options' className='flex items-center gap-2 overflow-x-auto whitespace-nowrap
                z-[5] fixed box-border px-3 py-3 w-full bg-black '>
            <div onClick={()=>handleHomePageVideos("")} 
            
            className='text-white flex  h-[30px] bg-[#4c4c4c] text-lg hover:bg-[#4e535b]
                          justify-center items-center px-2 py-1.5 rounded-xl cursor-pointer border-2 border-white'>
                All
            </div>
            {categories.map((skill,index)=>{
                return(
                <div onClick={()=>handleHomePageVideos(skill)} 
                key={index} className='text-white flex  h-[30px] bg-[#4c4c4c] text-md hover:bg-[#4e535b] 
                          justify-center items-center px-2 py-1.5 rounded-xl cursor-pointer border-2 border-white'>
                   {skill}
                </div>
                )
            })}

        </div>
        <div className='grid box-border  
                    gap-[10px] grid-cols-[repeat(auto-fit,_minmax(375px,_1fr))] pt-[70px]'>
            
            {data?.length>0?(  data?.map((video,index)=>{
                return   <Link key={index} to={`/watch/${video._id}`} className='flex flex-col box-border h-[316px] cursor-pointer px-4 py-2'> 
                    <div className='w-[100%] relative box-border h-[215px] ' >
                      <img className='w-[100%] h-[100%] rounded-lg'
                      src={video.thumbnail} alt="" />
                      <div className='backdrop-blur-md right-[4px] w-auto bottom-[2px] absolute py-[1px] px-[2px] bg-white/10 text-white rounded-sm '>
                        {formatDuration(video.duration)}
                      </div>
                    </div>
                    <div className='flex py-2'>
                      <div className='w-[48px] h-[48px] flex justify-center items-center'>
                          <img className='w-[80%] rounded-full' 
                          src={video.owner.avatar} alt="" />
                      </div>
                      <div className='flex flex-col pl-2'>
                          <div className='text-amber-50 font-bold text-md'>
                              {video.title}
                          </div>
                          <div className='text-gray-400 text-[15px] font-medium'>
                            {video.owner.username}
                          </div>
                          <div className='flex gap-3 text-gray-400'>
                                <div>
                                  {video.views} views
                                </div>
                                <div>
                                  ~ {formatRelativeTime(video.createdAt)}
                                </div>
                          </div>
                      </div>
                    </div>
              </Link>
            })):
            
            (  <div className='text-white text-xl w-full px-6 py-10 col-span-full text-center'>
    No videos available
  </div>) }
            


 
        </div>
    </div>
  )
}

export default HomePage
