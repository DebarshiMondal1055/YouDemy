import React from 'react'
import useAuthStore from '../../store/authStore'
import { Link } from 'react-router-dom'
import { useSubscribersQuery } from '../../Hooks/useSubscriptions'
const SubcriberPage = () => {
  const {user}=useAuthStore();

  const {data}=useSubscribersQuery(user?._id)

    return (
    <div className='flex flex-col gap-4 bg-black pt-[76px] pb-4 px-4 text-white min-h-[92vh] w-full overflow-x-hidden'>
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
