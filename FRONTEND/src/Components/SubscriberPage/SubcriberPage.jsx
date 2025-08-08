import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useAuthContext } from '../../Context/AuthenticationContext'
import axios from 'axios'
import { Link } from 'react-router-dom'
const SubcriberPage = ({showSideNavbar}) => {
  const {user}=useAuthContext();

  const {data,isLoading,isError,error}=useQuery({
        queryKey:['subscribers'],
        queryFn:async()=>{
            try {
                const response=await axios.get(`${import.meta.env.BACKEND_BASE_URL}/api/v1/subscriptions/c/${user._id}`);
                return (response.status===200)?response.data.data:null;
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        enabled: !!user?._id,
  })

    return (
    <div className={`flex flex-col gap-4 ${showSideNavbar ? 'ml-[280px]' : 'ml-0'} bg-black py-4 px-4 text-white min-h-[92vh] w-full overflow-x-hidden `}>
      <h1 className="text-2xl font-bold">Subscribers</h1>
      <div className="flex flex-col gap-4">
        {data?.subscribers.map((subscriber,index) => (
          <Link to={`/users/${subscriber.subscriberInfo.username}`} key={index} className="flex items-center gap-4 hover:bg-gray-900 p-2 rounded-lg">
            <img
              src={subscriber.subscriberInfo.avatar}
              alt={subscriber.subscriberInfo.username}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">{subscriber.subscriberInfo.username}</p>
              <p className="text-sm text-gray-400">@{subscriber.subscriberInfo.fullname}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SubcriberPage
