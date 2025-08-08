import React, { useState } from 'react'
import { useAuthContext } from '../../Context/AuthenticationContext';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

const UpdateCoverImage = ({cancelUpdateCoverImage}) => {
    const queryClient=useQueryClient();
    const {user}=useAuthContext();
    const [coverImage,setCoverImage]=useState('');
    const [isLoading,setIsLoading]=useState(false);

    const updateCoverImageHandler=async()=>{
        try {
            const formData=new FormData();
            formData.append("coverimage",coverImage);
            const response=await axios.patch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/users/update-cover-image`,formData,{withCredentials:true});
            if(response.status===201){
                await queryClient.setQueryData(['currentUser'],response.data.data)
                setIsLoading(false);
                cancelUpdateCoverImage();
            }
            return;
        } catch (error) {
            console.error(error);
            setIsLoading(false);
            return null;
        }
    }

    if(isLoading){
        return (
                <div className="w-full h-screen flex justify-center items-center bg-black text-white text-2xl">
                    Updating User Cover Image...
                </div>
            );
    }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center text-white z-20">
        <div className='flex flex-col bg-gray-800 px-4 py-3 h-[80%] w-[40%] p-[60px]  items-center rounded-xl'>
            <h2 className='mt-10 font-bold text-2xl'>Update Cover Image</h2>
            <div className='flex flex-col gap-4 w-full items-center mt-5 '>
                <img className='w-[450px] h-[280px] object-cover'
                 alt="" src={user?.coverImage}/>
            </div>
          <label htmlFor="avatarFile" className=' mt-5 cursor-pointer border-b border-b-gray-300'>
            {coverImage?.name ||  "Choose Cover Image"}
          </label>
          <input
            type="file"
            id="avatarFile"
            accept='image/*'
            className='hidden'
            onChange={(e)=>setCoverImage(e.target.files[0])}
          />
            <div className='flex mt-15 justify-evenly w-[60%] '>
                <button onClick={updateCoverImageHandler}
                className='bg-emerald-400 p-2 cursor-pointer rounded-2xl'>Update</button>
                <button onClick={()=>cancelUpdateCoverImage()}
                className='bg-red-400 p-2 cursor-pointer rounded-2xl'>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default UpdateCoverImage
