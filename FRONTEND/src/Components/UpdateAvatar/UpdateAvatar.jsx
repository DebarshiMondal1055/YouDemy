import React, { useState } from 'react'
import useAuthStore from '../../store/authStore';
import { useUpdateAvatarMutation } from '../../Hooks/useAccount';

const UpdateAvatar = ({cancelUpdateAvatar}) => {
    const {user}=useAuthStore();
    const [avatar,setAvatar]=useState("");
    const updateAvatarMutation=useUpdateAvatarMutation();
    const updateAvatarHandler=()=>{
        updateAvatarMutation.mutate(avatar,{
            onSuccess: cancelUpdateAvatar,
            onError: (error) => {
                alert("Failed to update avatar")
                console.error(error);
            }
        })
    }

    if(updateAvatarMutation.isPending){
            return (
                <div className="w-full h-screen flex justify-center items-center bg-black text-white text-2xl">
                    Updating User Avatar...
                </div>
            );
    }
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center text-white z-20">
        <div className='flex flex-col bg-gray-800 px-4 py-3 h-[70%] w-[40%] p-[60px]  items-center rounded-xl'>
            <h2 className='mt-10 font-bold text-2xl'>Update Avatar</h2>
            <div className='flex flex-col gap-4 w-full items-center mt-5 '>
                <img className='w-[240px] h-[220px]'
                src={user?.avatar} alt="" />
            </div>
          <label htmlFor="avatarFile" className=' mt-5 cursor-pointer border-b border-b-gray-300'>
            {avatar?.name || "Choose Avatar"}
          </label>
          <input
            type="file"
            id="avatarFile"
            accept='image/*'
            className='hidden'
            onChange={(e) => setAvatar(e.target.files[0])}
          />
            <div className='flex mt-15 justify-evenly w-[60%] '>
                <button  onClick={updateAvatarHandler}
                className='bg-emerald-400 p-2 cursor-pointer rounded-2xl'>Update</button>
                <button onClick={()=>cancelUpdateAvatar()}
                className='bg-red-400 p-2 cursor-pointer rounded-2xl'>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default UpdateAvatar;
