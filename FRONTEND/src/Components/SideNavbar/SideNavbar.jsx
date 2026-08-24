import React from 'react'
import HomeFilledIcon from '@mui/icons-material/HomeFilled';
import PersonIcon from '@mui/icons-material/Person';
import BrowseGalleryIcon from '@mui/icons-material/BrowseGallery';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { useSubscribedToQuery } from '../../Hooks/useSubscriptions';
const SideNavbar = ({isOpen,onClose}) => {

  const {user}=useAuthStore();
  const {data,isLoading,isError}=useSubscribedToQuery(user?._id)

  return (
    <>
      {isOpen && (
        <div className='fixed inset-0 z-40 bg-black/60' onClick={onClose}/>
      )}
      <div className={`flex flex-col gap-2 px-[14px] fixed overflow-y-auto box-border
                  w-[280px] bg-black py-4 top-0 h-full z-50 transition-transform duration-300 ease-in-out transform
                  ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className='flex justify-between items-center px-2 pb-3 mb-1 border-b-3 border-gray-600'>
          <div className='text-white font-bold text-lg'>Menu</div>
          <CloseIcon onClick={onClose} sx={{color:'white', cursor:'pointer'}}/>
        </div>
        <div className='flex flex-col gap-2.5 border-b-3 border-gray-600 pb-3'>
          <Link onClick={onClose} to={"/"} className='flex gap-4 px-4 py-2 items-center cursor-pointer
                          hover:bg-[#404040] border-white border-2 rounded-[10px]'>
              <HomeFilledIcon sx={{color:"white"}}/>
              <div className='text-white'>Home</div>
          </Link>
          <Link onClick={onClose} to={`/users/${user?.username}`} className='flex gap-4 px-4 py-2 items-center cursor-pointer
                          hover:bg-[#404040] rounded-[10px] border-white border-2'>
              <PersonIcon sx={{color:"white"}}/>
              <div className='text-white'>My Profile</div>
          </Link>
          <Link onClick={onClose} to={'/history'} className='flex gap-4 px-4 py-2 items-center cursor-pointer
                          hover:bg-[#404040] rounded-[10px] border-white border-2'>
              <BrowseGalleryIcon sx={{color:"white"}}/>
              <div className='text-white'>Watch History</div>
          </Link>
          <Link onClick={onClose} to={"/likedVideos"} className='flex gap-4 px-4 py-2 items-center cursor-pointer
                          hover:bg-[#404040] rounded-[10px] border-white border-2'>
              <ThumbUpIcon sx={{color:"white"}}/>
              <div className='text-white'>Liked Videos</div>
          </Link>

          <Link onClick={onClose} to={"/subscribers"} className='flex gap-4 px-4 py-2 items-center cursor-pointer
                          hover:bg-[#404040] rounded-[10px] border-white border-2'>
              <SupervisorAccountIcon sx={{color:"white"}}/>
              <div className='text-white'>Subscribers</div>
          </Link>
          <Link onClick={onClose} to={"/courses"} className='flex gap-4 px-4 py-2 items-center cursor-pointer
                          hover:bg-[#404040] rounded-[10px] border-white border-2'>
              <PermMediaIcon sx={{color:"white"}}/>
              <div className='text-white'>My Courses</div>
          </Link>


        </div>

          {/* top-sidebar-part ends */}

        <div className='flex flex-col gap-2.5 border-b-3'>
          <div className='flex gap-4 px-4 py-2 items-center'>
              <div className='text-white font-bold'>Subsriptions</div>
          </div>
          {!isLoading && !isError && Array.isArray(data?.subscribedChannels) && data?.subscribedChannels.length > 0 ? (
            data.subscribedChannels?.map((subscription, index) => (
              <Link onClick={onClose} to={`/users/${subscription.subscribedChannelInfo.username}`}
                key={index}
                className='flex gap-4 px-4 py-2 items-center cursor-pointer
                          bg-[#60637c] hover:bg-[#2b3434] rounded-[10px] border-white border-2'>
                <img
                  src={subscription.subscribedChannelInfo.avatar}
                  alt=""
                  className='w-[25px] h-[25px] rounded-full'
                />
                <div className='text-white'>{subscription.subscribedChannelInfo.username}</div>
              </Link>
            ))
          ) : (
            <div className='text-gray-400 px-4'>No Subscriptions</div>
          )}

        </div>

      </div>
    </>
  )
}

export default SideNavbar
