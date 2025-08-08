import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import { useAuthContext } from '../../Context/AuthenticationContext';

const UpdateCourse = ({cancelUpdateCourse,selectedCourse:c_id}) => {
    const {user}=useAuthContext();
    const [title,setTitle]=useState('');
    const [description,setDescription]=useState('');
    const queryClient=useQueryClient();
    const updateCourseMutation=useMutation({
        mutationFn:async({title,description,c_id})=>{
            return await axios.patch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/playlists/${c_id}`,{name:title,description:description},{withCredentials:true})
        },
        onSuccess:async(updatedData,{c_id})=>{
            console.log(updatedData)
            await queryClient.setQueryData(['myCourses',user?._id],(oldCourses=[])=>
                oldCourses.map((course=>course._id===c_id?{...course,...updatedData.data.data}:course)))
            cancelUpdateCourse();
            return;
        },
        onError:()=>{
            console.error(error);
            return;
        }
    })
    
    const updateCourseHandler=()=>{
            if (!title.trim() || !description.trim()) {
            alert('Title and description are required.');
            return;
            }
        updateCourseMutation.mutate({title,description,c_id})
    }
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center text-white z-20">
        <div className='flex flex-col bg-gray-800 px-4 py-3 h-[70%] w-[50%] p-[60px]  items-center rounded-xl'>
            <h2 className='mt-10 font-bold text-2xl'>Update Course</h2>
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
                <button onClick={updateCourseHandler}
                className='bg-emerald-400 p-2 cursor-pointer rounded-2xl'>Update</button>
                <button onClick={()=>cancelUpdateCourse()}
                className='bg-red-400 p-2 cursor-pointer rounded-2xl'>Cancel</button>
            </div>
        </div>
    </div>
  )
}

export default UpdateCourse
