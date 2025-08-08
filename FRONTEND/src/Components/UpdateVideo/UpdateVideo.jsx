import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'

const UpdateVideo = ({cancelUpdateVideo,selectedVideo}) => {
    const queryClient=useQueryClient();
    const [title,setTitle]=useState(selectedVideo?.title);
    const [description,setDescription]=useState("");

    const videoUpdateHandler=async()=>{
        try {
            if(!title.trim() || !description.trim()){
                alert("Title and description are requiered")
                return;
            }
            const data={title,description}
            const response=await axios.patch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/videos/v/${selectedVideo._id}`,data,{withCredentials:true});
            if(response.status===200){
                await queryClient.setQueryData(['userVideos'],(prev=[])=>prev.map((video)=>video._id===selectedVideo._id?response.data.data:video))
                alert("Video updated successfully!");
                cancelUpdateVideo(); 
            }
            return;
        } catch (error) {
            alert("Failed to update Video")
            console.error(error)
            return;
        }
    }
    return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center text-white z-20">
        <div className='flex flex-col bg-gray-800 px-4 py-3 h-[70%] w-[50%] p-[60px]  items-center rounded-xl'>
            <h2 className='mt-10 font-bold text-2xl'>Update Video</h2>
            <div className='flex flex-col gap-4 w-full items-center mt-5 '>
                <input className='w-[80%] h-10 rounded-xl bg-gray-600 px-4 py-2' 
                type="text" placeholder='Title' 
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                />
                <textarea className='w-[80%]  rounded-xl bg-gray-600 px-4 py-2 h-[150px]' 
                type="text" placeholder='description'
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                />
                {/* <label htmlFor="thumbnailFile"
                    className='mt-3 cursor-pointer border-b-1 border-b-gray-300'
                >{"Choose new Thumbnail"}</label>
                <input type="file" name="thumbnailFile" id="thumbnailFile" accept='image/*'
                    className=' hidden '  onChange={(e)=>setThumbnail(e.target.files[0])}
                /> */}
            </div>
            <div className='flex mt-15 justify-evenly w-[60%] '>
                <button onClick={videoUpdateHandler}
                className='bg-emerald-400 p-2 cursor-pointer rounded-2xl'>Update</button>
                <button onClick={()=>cancelUpdateVideo()}
                className='bg-red-400 p-2 cursor-pointer rounded-2xl'>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default UpdateVideo
