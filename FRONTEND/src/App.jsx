import { useState,useEffect } from 'react'
import './App.css'
import Navbar from './Components/Navbar/Navbar.jsx'
import { Outlet, useNavigate } from "react-router";

import { AuthenticationContextProvider } from './Context/AuthenticationContext.js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';




function App() {
  const navigate=useNavigate();
  const queryClient=useQueryClient()
  const [showSideNavbar,setShowSideNavbar]=useState(true);
  const toggleSideNavbar=()=>{
    setShowSideNavbar((prev)=>!prev);
  }
 const {data,isLoading}=useQuery({
      queryKey:['currentUser'],
      queryFn:async()=>{
        try {
          const response=await axios.get(`${import.meta.env.BACKEND_BASE_URL}/api/v1/users/get-user`,{withCredentials:true})
          return (response.status>=200 && response.status<300)?response.data.data:null;
        } catch (error) {
          console.error(error);
          return null;
        }
        
      },
      staleTime:Infinity,
      cacheTime:Infinity,
      refetchOnWindowFocus:false
 })

  
  return (
    <AuthenticationContextProvider value={{user:data,isLoading:isLoading}}>
      <Navbar toggleSideNavbar={toggleSideNavbar}/> 
      
      <Outlet context={{showSideNavbar}}/>
    </AuthenticationContextProvider>
  )
}

export default App
