import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

const VideoLikePage = ({ showSideNavbar }) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['likedVideos'],
    queryFn: async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/likes/videos`);
            return (response.status===200)?response.data.data : [];
        } catch (error) {
            console.error(error)
        }
    }
  });

  // Function to format duration from seconds to MM:SS
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Function to format views
  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black text-white text-2xl">
        Loading Liked Videos...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black text-red-500 text-xl">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${showSideNavbar ? 'ml-[280px]' : 'ml-0'} bg-black py-4 px-4 text-white min-h-[92vh] w-full overflow-x-hidden`}>
      <h1 className="text-2xl font-bold">Liked Videos</h1>
      <div className="flex flex-col gap-6">
        {data.map((video,index) => (
          <div key={index} className="flex gap-4 hover:bg-gray-900 p-2 rounded-lg">
            <Link to={`/watch/${video.videoLike}`} className="relative">
              <img
                src={video.likedVideo.thumbnail}
                alt={video.likedVideo.title}
                className="w-48 h-27 object-cover rounded-lg"
              />
              <span className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                {formatDuration(video.likedVideo.duration)}
              </span>
            </Link>
            <div className="flex flex-col gap-1">
              <Link to={`/watch/${video.videoLike}`} className="text-lg font-semibold line-clamp-2">{video.likedVideo.title}</Link>
              <Link to={`/watch/${video.videoLike}`} className="text-sm text-gray-300 line-clamp-2">{video.likedVideo.description}</Link>
              <div className="flex items-center gap-2">
                <img
                  src={video.uploader.avatar}
                  alt={video.uploader.username}
                  className="w-6 h-6 rounded-full"
                />
                <p className="text-sm text-gray-400">{video.uploader.username}</p>
              </div>
              <p className="text-sm text-gray-400">{formatViews(video.likedVideo.views)}</p>
              
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoLikePage;

