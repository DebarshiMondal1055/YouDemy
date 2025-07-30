import React from 'react'
import SideNavbar from '../../Components/SideNavbar/SideNavbar.jsx';
import { useOutletContext } from 'react-router-dom';
import UserCoursePage from '../../Components/UserCoursesPage/UserCoursesPage.jsx';

const UserCourses = () => {

    
    const {showSideNavbar}=useOutletContext()
    return (
    <div className='flex w-full pt-[60px] box-border'>
        {
            showSideNavbar
                ? <SideNavbar/>
                : <div className='w-[0px] h-[92vh] bg-black transition-all duration-300'></div>
        }

        <UserCoursePage showSideNavbar={showSideNavbar}/>
    </div>
    )
}

export default UserCourses;
