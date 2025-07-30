import React from 'react'
import SideNavbar from '../../Components/SideNavbar/SideNavbar.jsx';
import UserProfilePage from '../../Components/UserProfilePage/UserProfilePage.jsx';
import { useOutletContext } from 'react-router-dom';
import UserTweetPage from '../../Components/UserTweetPage/UserTweetPage.jsx';

const UserTweet = () => {

    const {showSideNavbar}=useOutletContext()
  return (
    <div className='flex w-full pt-[60px] box-border'>
        {
            showSideNavbar
                ? <SideNavbar/>
                : <div className='w-[0px] h-[92vh] bg-black transition-all duration-300'></div>
        }

        <UserTweetPage showSideNavbar={showSideNavbar}/>
    </div>
  )
}

export default UserTweet;
