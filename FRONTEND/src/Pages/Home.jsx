import React from 'react'
import SideNavbar from '../Components/SideNavbar/SideNavbar.jsx'
import HomePage from '../Components/HomePage/HomePage.jsx'
import { useOutletContext } from 'react-router-dom'


const Home = () => {
  const {showSideNavbar}=useOutletContext()
  return (
    <div className='flex w-full  pt-[60px]   box-border'>
        {showSideNavbar===true?<SideNavbar/>:''}
        <HomePage showSideNavbar={showSideNavbar}/>
    </div>
  )
}

export default Home
