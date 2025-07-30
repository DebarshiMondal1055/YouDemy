import React, { useState } from 'react'
import MenuIcon from '@mui/icons-material/Menu';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SearchIcon from '@mui/icons-material/Search';
import MicNoneIcon from '@mui/icons-material/MicNone';
import PublishIcon from '@mui/icons-material/Publish';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../Context/AuthenticationContext';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
const Navbar = ({toggleSideNavbar}) => {
    const queryClient=useQueryClient()
    const {user}=useAuthContext();
    const navigate=useNavigate();
    const [userProfileImage,setUserProfileImage]=useState("data:image/png;base64,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")
    const toggle=()=>{
        toggleSideNavbar()
    }
    const [showModalOptions,setShowModalOptions]=useState(false);
    const [search,setSearch]=useState("");
    
    const searchHandler=()=>{
        navigate(`/results?query=${search}`);
    }

    const logoutHandler=async()=>{
        try {
            setShowModalOptions(false);
            const response=await axios.post('/api/v1/users/logout',{},{withCredentials:true})
            queryClient.removeQueries(['currentUser']);
            navigate('/login', { replace: true });

        } catch (error) {
            console.error(error || "Cannot Logout");
            return;
        }
    }

  return (
    <div className='h-16 w-full bg-black 
                    flex justify-between items-center px-3.5 fixed top-0 z-10'>
        <div className='gap-4 flex justify-center items-center w-fit '>
                { user?            <div className='h-[40px] w-[40px] flex justify-center items-center cursor-pointer'
                    onClick={toggle}
                >
                <MenuIcon sx={{color:'white', fontSize:"26.5px"}}/>
            </div>:""}
            <div className=' flex justify-center items-center cursor-pointer '>
                <YouTubeIcon sx={{color:'white',fontSize:"34px"}}/>
                <h1 className='text-white font-bold text-xl '>YouDemy</h1>
            </div>
        </div>
        {/* navbar-left-part end */}
       { user?       
        <div className='flex gap-2 w-[50%]'>
            <div className='flex w-[80%] '>
                <input type="text" placeholder="Search" value={search}
                    onChange={(e)=>setSearch(e.target.value)} 
                className='bg-[#6c6c6c] h-[38px] w-full rounded-l-3xl pl-4 border-[1px]
                 border-white focus:outline-none placeholder-white placeholder:text-lg '/>
                <div onClick={searchHandler} 
                  className={`flex justify-center items-center w-[15%] bg-[#383838] rounded-r-3xl cursor-pointer 
              ${search.trim() === '' ? 'pointer-events-none opacity-50' : ''}`}>
                    <SearchIcon sx={{color:"white",fontSize:"28px"}}/>
                </div>
            </div>
            <div className='flex justify-center items-center bg-[#313131] rounded-full w-10 cursor-pointer'>
                <MicNoneIcon sx={{color:"white"}}/>
            </div>
        </div>:""}
        {/* nabar-middle ends */}
        <div className='flex gap-6 justify-center items-center relative'>

            {user?            <Link to={"/453/upload"}>
                <PublishIcon sx={{color:"white",fontSize:"28px"}}/>
            </Link>: ""}
 
            <img src={userProfileImage} alt="" 
                onClick={()=>setShowModalOptions(!showModalOptions)}
                className='w-[30px] h-[30px] rounded-full cursor-pointer'
            />
            {showModalOptions===true?<>
                    <div className='absolute top-[40px] right-[30px] w-40 z-50  text-gray-200 '>
                    <div onClick={()=>setShowModalOptions(!showModalOptions)} 
                    className='bg-[rgb(85,85,85)] cursor-pointer p-[10px]  hover:bg-[rgb(35,35,35)]'>
                        <Link onClick={()=>setShowModalOptions(false)} to={"/login"} 
                            
                            >
                            Log In
                        </Link>
                    </div>
                    {user?  <div onClick={logoutHandler} 
                            className='bg-[rgb(85,85,85)] cursor-pointer p-[10px]  hover:bg-[rgb(35,35,35)]'>
                        <Link to={"/login"}>Log Out</Link>
                    </div>:""}
                    <div className='bg-[rgb(85,85,85)] cursor-pointer p-[10px]  hover:bg-[rgb(35,35,35)]'>
                        <Link onClick={()=>setShowModalOptions(false)} to={"/register"}>
                            Register
                        </Link>
                    </div>
                    {user?                    <div className='bg-[rgb(85,85,85)] cursor-pointer p-[10px]  hover:bg-[rgb(35,35,35)]'>
                        <Link onClick={()=>setShowModalOptions(false)} to={`/channel/${user._id}`} >
                            Manage
                        </Link>
                    </div>:""}
                    </div>
            </>:""}
        </div>
    </div>
  )
}

export default Navbar;
