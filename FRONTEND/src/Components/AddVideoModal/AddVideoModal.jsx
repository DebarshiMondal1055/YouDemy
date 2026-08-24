import React from 'react'
import useAuthStore from '../../store/authStore';
import { useUserVideosQuery } from '../../Hooks/useVideos';
import { useAddVideoToCourseMutation } from '../../Hooks/usePlaylists';

const AddVideoModal = ({selectedCourse:c_id,cancelAddVideoModal}) => {
    const {user}=useAuthStore();
    const {data:videos}=useUserVideosQuery(user?._id)

    const addVideoMutation=useAddVideoToCourseMutation(user?._id)

    const addVideoHandler=(videoId)=>{
        const confirm=window.confirm("Are you sure you want to add this video?");
        if(confirm)
        addVideoMutation.mutate({courseId:c_id,videoId},{
            onSuccess:()=>{
                alert("Video added to Course Successfully")
                cancelAddVideoModal()
            },
            onError:(error)=>{
                alert("Video already present");
                console.error(error);
                cancelAddVideoModal()
            }
        });
    }


    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/70 flex justify-center items-center text-white z-20">
            <div className="bg-gray-900 rounded-lg p-6 w-[600px] max-h-[70vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Select a video to add</h2>
                <div className="flex flex-col gap-3">
                    {videos?.map((video, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-700 p-3 rounded">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img 
                                        src={video.thumbnail || 'https://via.placeholder.com/120x68'} 
                                        alt={video.title}
                                        className="w-[120px] h-[68px] object-cover rounded"
                                    />
                                </div>
                                <h4 className="font-semibold">{video.title}</h4>
                            </div>
                            <button 
                                onClick={() => addVideoHandler(video._id)}
                                className="bg-emerald-500 px-4 py-1 rounded hover:bg-emerald-600"
                            >
                                Add
                            </button>
                        </div>
                    ))}
                </div>
                <button 
                    onClick={() => cancelAddVideoModal()} 
                    className="mt-4 px-4 py-2 bg-red-500 rounded"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default AddVideoModal;