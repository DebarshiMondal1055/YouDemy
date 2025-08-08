import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useAuthContext } from '../../Context/AuthenticationContext';
import axios from 'axios';
import UpdateCourse from '../UpdateCourse/UpdateCourse';
import AddVideoModal from '../AddVideoModal/AddVideoModal';

// Dummy data for courses and videos
const MyCoursesPage = ({ showSideNavbar }) => {
  const [openMenu, setOpenMenu] = useState(null);
    const {user}=useAuthContext();
    const queryClient=useQueryClient();
    const [updateCourse,setUpdateCourse]=useState(false);
    const [selectedCourse,setSelectedCourse]=useState(null) //for updating course
    const [showAddVideoModal,setShowAddVideoModal]=useState(false);
    
    const cancelAddVideoModal=()=>{
      setShowAddVideoModal(false);
    }
    
    
    const cancelUpdateCourse=()=>{
        setUpdateCourse(false);
    }
    const toggleMenu = (courseId) => {
        setOpenMenu(openMenu === courseId ? null : courseId);
    };


    const {data:courses,isPending,isError,error}=useQuery({
        queryKey:['myCourses',user?._id],
        queryFn:async()=>{
            try {
                const response=await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/playlists/p/users/${user?._id}`);
                return response.status===200?response.data.data:[];
            } catch (error) {
                console.error(error)
                return [];
            }
        },
        staleTime:Infinity,
        enabled:!!user?._id
    })

    const handleDeleteCourse = (courseId) => {
        const confirm=window.confirm("Are you sure you want to remove this course?");
        if(confirm)
        deleteCourseMutation.mutate(courseId)
        setOpenMenu(null);
    };

    const deleteCourseMutation=useMutation({
        mutationFn:async(courseId)=>{
            return await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/playlists/p/${courseId}`,{},{withCredentials:true});
        },
        onSuccess:(_,courseId)=>{
            queryClient.setQueryData(['myCourses',user?._id],(oldCourses=[])=>oldCourses.filter(course=>course._id!==courseId))
            return;
        },
        onError:(error)=>{
            alert("Failed to delete Course");
            console.error(error);
            return;
        }
    })





    const handleUpdateCourse = (courseId) => {
        setSelectedCourse(courseId);
        setUpdateCourse(true);
        setOpenMenu(null);
  };

  const handleAddVideo = (courseId) => {
    setShowAddVideoModal(true)
    setSelectedCourse(courseId)
    setOpenMenu(null);
  };

    const handleDeleteVideo = (courseId, videoId) => {
        const confirm=window.confirm("Are you sure you want to remove this video from the course?");
        if(confirm)
        deleteVideoFromCourseMutation.mutate({courseId,videoId});
    };
    const deleteVideoFromCourseMutation = useMutation({
    mutationFn: async ({ courseId, videoId }) => {
        return await axios.post(
        `/api/v1/playlists/p/${courseId}/v/${videoId}`,
        {},
        { withCredentials: true }
        );
    },
    onSuccess: (_, { courseId, videoId }) => {
        queryClient.setQueryData(['myCourses', user?._id], (oldCourses = []) => {
        return oldCourses.map((course) => {
            if (course._id === courseId) {
            return {
                ...course,
                videoList: course.videoList.filter((video) => video._id !== videoId),
            };
            }
            return course;
        });
        });
    },
    onError: (error) => {
        console.error("Error deleting video:", error);
    },
    });

  return (
    <div className={`flex flex-col gap-8 ${showSideNavbar ? 'ml-[280px]' : 'ml-0'} bg-black py-4 px-4 text-white min-h-[92vh] w-full overflow-x-hidden`}>
      {courses?.map((course,index) => (
        <div key={index} className="flex flex-col gap-4">
            <div>
                  <div className="flex items-center gap-4 justify-between">
                    <h2 className="text-2xl font-bold">{course.name}</h2>

                    <div className="relative">
                    <button
                        onClick={() => toggleMenu(course._id)}
                        className="p-2 rounded-full hover:bg-gray-700 focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v.01M12 12v.01M12 18v.01" />
                        </svg>
                    </button>
                    {openMenu === course._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg z-10">
                        <button
                            onClick={()=>handleUpdateCourse(course._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                            Update Course
                        </button>
                        <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                            Delete Course
                        </button>
                        <button
                            onClick={()=>handleAddVideo(course._id)}
                            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                        >
                            Add Video
                        </button>
                        </div>
                    )}
                    </div>
                </div>
                <p className='mt-2 text-md '>description : {course.description}</p>
            </div>
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {course?.videoList?.map((video,index) => (
              <div key={index} className="flex-none w-64 bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-36 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-gray-400 mt-1">{video.duration}</p>
                </div>
                <button
                  onClick={() => handleDeleteVideo(course._id, video._id)}
                  className="absolute top-2 right-2 p-1 bg-gray-600/60 backdrop-blur-md rounded-full hover:bg-red-700 focus:outline-none"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
      {updateCourse && <UpdateCourse cancelUpdateCourse={cancelUpdateCourse} selectedCourse={selectedCourse} />}
      {
        showAddVideoModal && <AddVideoModal cancelAddVideoModal={cancelAddVideoModal} selectedCourse={selectedCourse}/>
      }
    </div>
  );
};

export default MyCoursesPage;
