import React from 'react'
import SideNavbar from '../../Components/SideNavbar/SideNavbar.jsx';
import UserProfilePage from '../../Components/UserProfilePage/UserProfilePage.jsx';
import { useOutletContext } from 'react-router-dom';

const UserProfile = () => {
    const {showSideNavbar}=useOutletContext()
  return (
    <div className='flex w-full pt-[60px] box-border'>
        {
            showSideNavbar
                ? <SideNavbar/>
                : <div className='w-[0px] h-[92vh] bg-black transition-all duration-300'></div>
        }

        <UserProfilePage showSideNavbar={showSideNavbar}/>
    </div>
  )
}

export default UserProfile;
