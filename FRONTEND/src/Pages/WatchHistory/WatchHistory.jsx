import React from 'react'
import SideNavbar from '../../Components/SideNavbar/SideNavbar.jsx';
import UserProfilePage from '../../Components/UserProfilePage/UserProfilePage.jsx';
import { useOutletContext } from 'react-router-dom';
import WatchHistoryPage from '../../Components/WatchHistoryPage/WatchHistoryPage.jsx';
import { useAuthContext } from '../../Context/AuthenticationContext.js';
const WatchHistory = () => {
    const {showSideNavbar}=useOutletContext()
    return (
    <div className='flex w-full pt-[60px] box-border'>
        {
            showSideNavbar
                ? <SideNavbar/>
                : <div className='w-[0px] h-[92vh] bg-black transition-all duration-300'></div>
        }

        <WatchHistoryPage showSideNavbar={showSideNavbar}/>
    </div>
  )
}

export default WatchHistory;
