import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useAuthContext } from '../../Context/AuthenticationContext'
import axios from 'axios';
import { useParams ,Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
const UserTweetPage = ({showSideNavbar}) => {
    const {user}=useAuthContext();
    const {username}=useParams();
    const [userData,setUserData]=useState({});
    useEffect(() => {
        const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/users/c/${username}`, {
            withCredentials: true
            });
            setUserData(response.data.data);
        } catch (error) {
            console.error(error?.response?.data?.message || error.message);
        }
        };
        fetchUserData();
    }, [username]);
    const {_id,fullname,avatar,coverImage,subscribersCount}=userData;

    const toggleSubscribe=async ()=>{
        try {
            const response = await axios.post(`/api/v1/subscriptions/c/${_id}`, {}, { withCredentials: true });
            const {isSubscribed,subscriptionCount}=response.data.data;
            setUserData((prev)=>({...prev,subscribersCount:subscriptionCount,isSubscribed:isSubscribed}))
        } catch (error) {
            console.error(error);
        }

    }
    

    const {data:tweets,isLoading,isError,error}=useQuery({
        queryKey:['tweets',_id],
        queryFn:async()=>{
        try {
            const response=await axios.get(`/api/v1/tweets/users/${_id}`);
            return response.status===200?response.data.data:[]
        } catch (error) {
            console.error(error);
            return [];
        }
        },
        staleTime:Infinity,
        enabled:!!_id
    })
  
    return (
    <div className={`flex flex-col gap-4 ${showSideNavbar ? 'ml-[280px]' : 'ml-0'} bg-black py-4 px-4 text-white min-h-[92vh] w-full overflow-x-hidden `}>
        <div className='w-full flex justify-center h-[300px] mt-2 '>
            <div className='w-[70%] h-full'>
                <img className='w-full h-full object-cover rounded-2xl ' 
                    src={coverImage} alt="" />
        </div>
        </div>
        <div className='w-full flex justify-center'>
        <div className='w-[70%] flex px-4 py-6 gap-5 items-center  border-b-gray-300 border-b-2 '>
            <div className='w-[15%]'>
                <img className='w-full h-full rounded-full'
                src={avatar} alt="" />
            </div>
            <div className='flex flex-col gap-2 '>
                <div className='text-2xl font-bold'>
                    {fullname}
                </div>
                <div>
                    @{username}
                </div>
                <div className='flex gap-2 text-gray-400 font-light'>
                    <div>{subscribersCount} subscribers</div>
                </div>
                <button onClick={toggleSubscribe} 
                className='cursor-pointer bg-red-500 py-2 px-4 flex justify-center items-center rounded-full'>
                    {(userData.isSubscribed)?"Unsubscribe":"Subscribe"}</button>
            </div>
        </div>
        </div>
        <div className='w-full flex justify-center text-white '>
            <div className='w-[70%] flex  justify-between'>
                <Link to={`/users/${username}`} className=' hover:border-b-2 hover:border-b-gray-400 px-4 py-2 w-[300px] text-lg flex justify-center items-center cursor-pointer'>
                    Videos
                </Link >
                <Link to={`/users/${username}/courses`} className='hover:border-b-2 hover:border-b-gray-400 px-4 py-2 w-[300px] text-lg flex justify-center items-center cursor-pointer'>
                    Courses
                </Link >
                <div className='bg-gray-600 hover:border-b-2 hover:border-b-gray-400  px-4 py-2 w-[300px] text-lg flex justify-center items-center'>
                    Tweets
                </div>
            </div>
        </div>       
            <div className=' mt-2 w-full flex justify-center '>
            <div className=' flex flex-wrap gap-[20px]   w-[70%] '>
                    {tweets?.map((tweet) => (
                        <div
                        key={tweet._id}
                        className="border w-full border-gray-800 rounded-lg p-4 hover:bg-gray-900 transition-colors"
                        >
                        <div className="flex items-start gap-3">
                            <img
                            src={tweet.owner.avatar}
                            alt={`${tweet.owner.username}'s avatar`}
                            className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className="font-bold">{tweet.owner.fullname}</span>
                                <span className="text-gray-500">@{tweet.owner.username}</span>
                                <span className="text-gray-500">·</span>
                                <span className="text-gray-500">
                                {new Date(tweet.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="mt-1 text-gray-200">{tweet.content}</p>
                            </div>
                        </div>
                        </div>
                    ))}       

        </div>
        </div>
          

    </div>
  )
}

export default UserTweetPage
