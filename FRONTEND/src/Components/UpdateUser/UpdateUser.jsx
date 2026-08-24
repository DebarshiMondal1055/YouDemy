import React, { useState } from 'react'
import useAuthStore from '../../store/authStore';
import { useUpdateAccountMutation } from '../../Hooks/useAccount';

const UpdateUser = ({cancelUpdateUser}) => {
    const {user}=useAuthStore();
    const [newFullname,setNewFullName]=useState(user.fullname);
    const [newUsername,setNewUsername]=useState(user.username);
    const [newEmail,setNewEmail]=useState(user.email);
    const updateAccountMutation=useUpdateAccountMutation();

    const userUpdateHandler=()=>{
        updateAccountMutation.mutate(
            {fullname:newFullname,username:newUsername,email:newEmail},
            {
                onSuccess: cancelUpdateUser,
                onError: (error) => console.error(error),
            }
        );
    }
    if (updateAccountMutation.isPending) {
            return (
                <div className="w-full h-screen flex justify-center items-center bg-black text-white text-2xl">
                    Updating User...
                </div>
            );
        }
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center text-white z-20">
        <div className='flex flex-col bg-gray-800 px-4 py-3 h-[60%] w-[40%] p-[60px]  items-center rounded-xl'>
            <h2 className='mt-10 font-bold text-2xl'>Update Profile</h2>
            <div className='flex flex-col gap-4 w-full items-center mt-5 '>
                <input className='w-[60%] h-10 rounded-xl bg-gray-600 px-4 py-2' 
                type="text" placeholder='Full Name' 
                onChange={(e)=>setNewFullName(e.target.value)}
                value={newFullname}/>
                <input className='w-[60%] h-10 rounded-xl bg-gray-600 px-4 py-2' 
                type="text" placeholder='Username'
                value={newUsername}
                onChange={(e)=>setNewUsername(e.target.value)}
                />
                <input className='w-[60%] h-10 rounded-xl bg-gray-600 px-4 py-2'
                type="text" placeholder='email'
                value={newEmail}
                onChange={(e)=>setNewEmail(e.target.value)}
                />
            </div>
            <div className='flex mt-15 justify-evenly w-[60%] '>
                <button onClick={userUpdateHandler} 
                className='bg-emerald-400 p-2 cursor-pointer rounded-2xl'>Update</button>
                <button onClick={()=>cancelUpdateUser()} 
                className='bg-red-400 p-2 cursor-pointer rounded-2xl'>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default UpdateUser
    