import React from 'react'
import SideNavbar from '../../Components/SideNavbar/SideNavbar'
import VideoPage from '../../Components/VideoPage/VideoPage'
import { useOutletContext } from 'react-router-dom'
const Video = () => {
  const {showSideNavbar}=useOutletContext()
  return (
    <div className='flex w-full pt-[60px] box-border'>
      {
        showSideNavbar
          ? <SideNavbar />
          : <div className='w-[0px] h-[92vh] bg-black transition-all duration-300'></div>
      }

      <VideoPage showSideNavbar={showSideNavbar} />
    </div>
  )
}

export default Video
