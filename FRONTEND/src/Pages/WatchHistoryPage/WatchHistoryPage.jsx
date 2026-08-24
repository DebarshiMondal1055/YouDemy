import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React from 'react'
import { Link } from 'react-router-dom'

const WatchHistoryPage = ({showSideNavbar}) => {



    const {data,isLoading,isError,error}=useQuery({
        queryKey:["history"],
        queryFn:async()=>{
            try {
                const response=await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/users/history`);
                return (response.status>=200 && response.status<300)?response.data.data:[];
            } catch (error) {
                console.error(error)
            }

        },
        
        refetchOnWindowFocus: false, 
    })

    if(isLoading){
            return (
                <div className="w-full h-screen flex justify-center items-center bg-black text-white text-2xl">
                    Loading Watch History
                </div>
            );
    }

    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }


    const formatViews = (views) => {
        if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
        if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
        return `${views} views`;
    }
    return (
    <div className={`flex flex-col gap-4 ${showSideNavbar ? 'ml-[280px]' : 'ml-0'} bg-black py-4 px-4 text-white min-h-[92vh] w-full overflow-x-hidden `}>
          <h1 className="text-2xl font-bold">Watch History</h1>
      <div className="flex flex-col gap-6">
        {data?.map((video) => (
          <div key={video._id} className="flex gap-4 hover:bg-gray-900 p-2 rounded-lg">
            <Link to={`/watch/${video._id}`} className="relative ">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-48 h-27 object-cover rounded-lg"
              />
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                {formatDuration(video.duration)}
              </span>
            </Link>
            <div className="flex flex-col gap-1">
              <Link to={`/watch/${video._id}`} className="text-lg font-semibold line-clamp-2">{video.title}</Link>
              <Link to={`/watch/${video._id}`} className="text-sm text-gray-300 line-clamp-2">{video.description}</Link>
              <div className="flex items-center gap-2">
                <img
                  src={video.owner.avatar}
                  alt={video.owner.username}
                  className="w-6 h-6 rounded-full"
                />
                <Link to={`/users/${video.owner.username}`} className="text-sm text-gray-400">{video.owner.username}</Link>
              </div>
              <p className="text-sm text-gray-400">{formatViews(video.views)}</p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WatchHistoryPage
