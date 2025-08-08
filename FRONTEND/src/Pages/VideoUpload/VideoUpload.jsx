import { avatarClasses } from '@mui/material/Avatar';
import axios from 'axios';
import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom';
import { categories } from '../../utils/categories';
const VideoUpload = () => {
    const navigate=useNavigate()
    const [videoTitle,setVideoTitle]=useState("");
    const [description,setDescription]=useState("");
    const [category,setCategory]=useState("");
    const [video,setVideo]=useState(null);
    const [thumbnail,setThumbnail]=useState(null);
    const [loading,setloading]=useState(false);
    const [error,setError]=useState(false);
const submitHandler = async () => {
    if (!videoTitle || !description || !category || !video || !thumbnail) {
        alert("Required fields not filled");
        return;
    }

    const formdata = new FormData();
    formdata.append("title", videoTitle);
    formdata.append("description", description);
    formdata.append("category", category);
    formdata.append("videoFile", video);
    formdata.append("thumbnail", thumbnail);

    try {
        setloading(true);
        const response = await axios.post(
            `${import.meta.env.BACKEND_BASE_URL}/api/v1/videos/uploadVideo`,
            formdata,
            {
                withCredentials: true,
            }
        );
        setloading(false)
        console.log("Upload success:", response.data);
    } catch (error) {
        console.error("Upload failed:", error.response?.data);

    }
};

    if(loading){
            return (
                <div className="w-full h-screen flex justify-center items-center bg-black text-white text-2xl">
                    Uploading   video...
                </div>
            );
    }

  return (
    <div className='flex w-full mt-[60px] justify-center items-center box-border h-[92vh] text-white bg-black '>
        <div style={{ boxShadow: '0.5px 0.5px 8px white' }} 
        className='w-[50%] p-[25px] bg-[#212121]  rounded-2xl z-10 shadow-amber-100 '>
            <div className='py-4 px-6 text-2xl font-bold flex justify-center w-full'>
                Upload
            </div>
            <div className='flex flex-col gap-6 mt-[25px] items-center'>
                <input type="text" placeholder='Video title' value={videoTitle}
                    onChange={(e)=>setVideoTitle(e.target.value)}
                    className='w-[70%] h-[42px] px-4 py-2 placeholder:text-gray-200 placeholder:font-medium bg-gray-400 rounded-2xl focus:outline-none box-border '
                />
            <textarea className='bg-gray-400 focus:outline-none px-4 py-2 placeholder:text-gray-200 placeholder:font-medium box-border w-[70%] h-35 rounded-2xl text-gray-200'
            name="" id=""  placeholder='Description' 
                value={description} onChange={(e)=>setDescription(e.target.value)}
            ></textarea>

                <select   value={category}
                     onChange={(e) => setCategory(e.target.value)} 
                name="" id="" className='w-[70%] h-[42px] px-4 py-2 placeholder:text-gray-200 placeholder:font-medium bg-gray-400 rounded-2xl focus:outline-none box-border '>
                    <option value="">--Select Category--</option>
                    {categories.map((category,index)=>(<option key={index} value={category}>{category}</option>))}
                </select>
                <div className='flex w-full justify-center gap-4 text-[#b9cbcb]  '>
                        <label htmlFor="videoFile" className='cursor-pointer border-b-1 border-b-gray-300'>
                            {video?.name ||"Choose Video"}</label>
                        <input type="file" name="videoFile" id="videoFile" accept='video/mp4,video/webm,video/*'
                            className='hidden '  onChange={(e)=>setVideo(e.target.files[0])}
                        />

                        <label htmlFor="thumbnailFile"
                            className='cursor-pointer border-b-1 border-b-gray-300'
                        >{thumbnail?.name ||"Choose Thumbnail"}</label>
                        <input type="file" name="thumbnailFile" id="thumbnailFile" accept='image/*'
                            className=' hidden '  onChange={(e)=>setThumbnail(e.target.files[0])}
                        />
                </div>
            </div>
                    <div className='w-full justify-center mt-8 flex gap-20 text-white'>
                        <button onClick={submitHandler}
                         className='bg-emerald-400 px-4 py-2 rounded-3xl font-medium hover:bg-emerald-700 cursor-pointer '>
                            Upload
                        </button>
                        <button
                        onClick={()=>{navigate(-1)}} 
                        className='bg-red-400  cursor-pointer px-4 py-2 rounded-3xl font-medium hover:bg-red-700 '>
                            Cancel
                        </button>
                    </div> 
        </div>

    </div>
  )
}

export default VideoUpload;
