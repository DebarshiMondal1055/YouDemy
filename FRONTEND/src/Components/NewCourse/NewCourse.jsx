import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react'

const NewCourse = ({cancelDone,addedVideos}) => {
    
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");

    const  createCourseMutation=useMutation({
        mutationFn:async()=>{
            const response= await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/playlists/create-playlist`,{name:title,description:description},{withCredentials:true})
            let uploadVideos=[];
            if(response.status===201){
                 uploadVideos=await axios.post(`/api/v1/playlists/${response.data.data._id}/videos`,{videoIds:addedVideos},{withCredentials:true})
                
            }
            return uploadVideos;
        },
        onSuccess:async(response)=>{
            setTitle("");
            setDescription("");
            cancelDone();
            alert("course added")
            return;
        },
        onError:(error)=>{
            alert("Failed to create Playlist")
            console.log(error);
            return;
        }
    }) 

    const handleCreate = () => {
    if (!title.trim() || !description.trim()) {
        alert("Title and description are required.");
        return;
    }
        createCourseMutation.mutate();
    };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center text-white z-20">
        <div className='flex flex-col bg-gray-800 px-4 py-3 h-[70%] w-[50%] p-[60px]  items-center rounded-xl'>
            <h2 className='mt-10 font-bold text-2xl'>Create Course</h2>
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
            </div>
            <div className='flex mt-15 justify-evenly w-[60%] '>
                <button onClick={handleCreate}   disabled={createCourseMutation.isLoading}
                    className='bg-emerald-400 p-2 cursor-pointer rounded-2xl'>Create</button>
                <button onClick={()=>cancelDone()} 
                className='bg-red-400 p-2 cursor-pointer rounded-2xl'>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default NewCourse
