import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { useSearchParams,Link } from 'react-router-dom';

const formatDuration = (seconds) => {
  if (!seconds) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return hours > 0
    ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    : `${minutes}:${secs.toString().padStart(2, '0')}`;
};
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

  if (diffInSeconds < secondsInMinute) return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
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
const SearchResultsPage = ({showSideNavbar}) => {
    const [searchParams]=useSearchParams();
    const query=searchParams.get("query");
    const{data,isLoading,isError,error}=useQuery({
        queryKey:['searchResults',query],
        queryFn:async()=>{
            try {
                const response=await axios.get(`/api/v1/videos/get-all-videos?query=${query}`)
                return (response.status===200)?response.data.data:[];
            } catch (error) {
                console.error(error);
                return [];
            }
        },
        staleTime:Infinity
    })
    if(isLoading){
      <div className="w-full h-screen flex justify-center items-center bg-black text-white text-2xl">
        Searching...
      </div>
    }
    {!isLoading && data?.length === 0 && (
        <div className="text-white text-lg">No results found for "{query}"</div>
    )}
    return (
    <div className={`flex flex-col gap-4 ${showSideNavbar ? 'ml-[280px]' : 'ml-0'} bg-black py-4 px-4 text-white min-h-[92vh] w-full overflow-x-hidden `} >
      <div className="flex flex-col gap-4 pt-4 px-6">
        {data?.map((video, index) => (
          <Link
            key={index}
            to={`/watch/${video._id}`}
            className="flex flex-row box-border cursor-pointer group"
          >
            {/* Thumbnail */}
            <div className="relative w-[246px] h-[138px] flex-shrink-0 rounded-xl overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src={video.thumbnail}
                alt={video.title}
              />
              <div className="absolute right-2 bottom-2 bg-black/80 text-white text-xs font-medium py-1 px-2 rounded">
                {formatDuration(video.duration)}
              </div>
            </div>
            {/* Video Info */}
            <div className="flex flex-col pl-4 py-2 flex-grow">
              <div className="text-white text-[18px] font-semibold line-clamp-2">
                {video.title}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-8 h-8 flex-shrink-0">
                  <img
                    className="w-full h-full rounded-full object-cover"
                    src={video.owner.avatar}
                    alt={video.owner.username}
                  />
                </div>
                <div className="text-gray-400 text-[14px] font-medium hover:text-gray-200">
                  {video.owner.username}
                </div>
              </div>
              <div className="flex gap-2 text-gray-400 text-[14px] mt-1">
                <span>{video.views.toLocaleString()} views</span>
                <span>•</span>
                <span>{formatRelativeTime(video.createdAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SearchResultsPage
