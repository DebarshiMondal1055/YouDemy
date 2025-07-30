import mongoose, { mongo } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/aynscHandler.js";
import { deleteInCloudinary, uploadInCloudinary } from "../utils/cloudinary.js";




const uploadVideo=asyncHandler(async(req,res)=>{
    /* 
        1. Get video details from req.body
        2. Upload video and thumbnail through multer
        3. create Video object and save it in database
        4. Check for video creation.// video duration from cloudinary response
        5. return a respone 
    */
    const {title,description,category}=req.body;
    
    if(title?.trim()==="" || description?.trim()===""){
        throw new ApiError(400,"title and description field are required");
    }
    
    console.log(req.files);

    const videoLocalPath=req.files?.videoFile[0]?.path;
    
    const thumbnailLocalPath=req.files?.thumbnail[0]?.path;
    
    console.log("video Local",videoLocalPath);
    
    console.log("thmblocal",thumbnailLocalPath)

    if(!videoLocalPath || !thumbnailLocalPath){
        throw new ApiError(400,"Video and thumbnail field is required");
    }

    const uploadedVideo=await uploadInCloudinary(videoLocalPath);
    const thumbnail=await uploadInCloudinary(thumbnailLocalPath);
    if(!uploadedVideo || !thumbnail){
        throw new ApiError(500,"Video Upload Failed in cloudinary");
    }
    console.log(uploadedVideo)
    console.log(thumbnail)      //executed
    const video= await Video.create({
        title,
        description,
        duration:uploadedVideo?.duration,
        category,
        isPublished:true,
        owner: req.user?._id,
        videoFile: uploadedVideo.url|| "",
        thumbnail: thumbnail.url||"",

    })

    if(!video){
        throw new ApiError(500,"Video Upload Failed")
    }

    const createdVideo=await Video.findById(video._id);

    return res
    .status(200)
    .json(new ApiResponse(200,createdVideo,"Video created successfully"))

})

const getVideoById=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    
    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"No video id passed");
    }

    const updatedVideo=await Video.findByIdAndUpdate(
        videoId,
        {
            $inc:{
                views:1
            }
        }
    )

    const video=await Video.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(videoId)
            }           
        },
        {
            $lookup:{
                from:"likes",
                localField:"_id",
                foreignField:"videoLike",
                as:"allLikes",
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"owner",
                foreignField:"channel",
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            avatar:1
                        }
                    }
                ]
            }
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                },
                subcribersCount:{
                    $size:"$subscribers"
                },
                isSubcribed:{
                    $cond:{
                        if:{$in:[new mongoose.Types.ObjectId(req.user?._id),"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                },
                likesCount:{
                    $size:"$allLikes"
                },
                isLiked:{
                    $cond:{
                        if:{$in:[new mongoose.Types.ObjectId(req.user?._id),"$allLikes.owner"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                allLikes:0,
                subscribers:0
            }
        }
    ])

    console.log(video);
    
    if(!video){
        throw new ApiError(400,"No such video found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,video[0],"Video fetched successfully"));
})


const updateVideo=asyncHandler(async(req,res)=>{
    const {videoId} =req.params;
    const {title,description}=req.body
    
    if(!videoId || !mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid video id");
    }
    
    if(title?.trim()==="" || description?.trim()===""){
        throw new ApiError(400,"title and description field are required");
    }

    const updatedVideo=await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title,
                description
            }
        },
        {
            new:true
        }
    )

    if(!updatedVideo){
        throw new ApiError(500,"Video update failed");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedVideo,"Video Updated succesfully"))

})

const deleteVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params;
    
    if(!videoId){
        throw new ApiError(400,"Invalid video id");
    }

    const deletedVideo=await Video.findByIdAndDelete(videoId);      //video object that was deleted

    if(!deletedVideo){
        throw new ApiError(500,"Deletion failed");
    }

    console.log(deletedVideo);

    const removedVideo=await deleteInCloudinary(deletedVideo.videoFile,'video');
    const removedThumbnail=await deleteInCloudinary(deletedVideo.thumbnail,'video');
    console.log(removedVideo);
    console.log(removedThumbnail)
    
    if(!removedVideo || ! removedThumbnail){
        throw new ApiError(500,"Failed to delete from cloudinary");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,deletedVideo,"Video Deleted succesfully"));

})

const getAllVideos=asyncHandler(async(req,res)=>{
    const {limit=50,page=1,query,sortBy="createdAt",sortType="-1",userId}=req.query;
    if(!userId && !query){
        throw new ApiError(400,"Invalid Search")
    }
    let stateMatch={};
    if(userId){
        stateMatch.owner=new mongoose.Types.ObjectId(userId)

    }
    
    if (query) {
    const words = query.trim().split(" ").filter(word => word.length > 2);
    const regexArray = words.map(word => ({
        title: { $regex: word, $options: "i" }
    }));

    stateMatch.$or = regexArray;
    }
    const videos=await Video.aggregate([
        {
            $match:stateMatch
        },
        {
            $sort:{
                [sortBy]:(sortType==="desc"||sortType==="-1")?-1:1
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            avatar:1,
                        }
                    }
                ]
            },
            
            
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        },
        {
            $skip: (Number(page) - 1) * Number(limit),
        },
        {
            $limit: Number(limit),
        },
    ])
    // const options={
    //     page:Number(page),
    //     limit:Number(limit)
    // }


    if(!videos){
        throw new ApiError(500,"Video fetch failed");
    }
    return res
    .status(200)
    .json(new ApiResponse(200,videos,"videos fetched successfully"))
})


const getUserVideos=asyncHandler(async(req,res)=>{
    const {userId}=req.params;
    if(!userId || !mongoose.Types.ObjectId.isValid(userId)){
        throw new ApiError(400,"Invalid User Id")
    }
    const videos=await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $project:{
                title:1,
                duration:1,
                views:1,
                thumbnail:1,
                createdAt:1
            }
        }
    ])
    return res
    .status(200)
    .json(new ApiResponse(200,videos,"User Videos fetched successfully"))
})

const getHomePageVideos=asyncHandler(async(req,res)=>{
    const {category,limit=36,page=1}=req.query;
    
    const videos=await Video.aggregate([
        {
            $match: category
                ? { category: { $regex: `^${category}$`, $options: 'i' } }
                : {}, 
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                        $project:{
                            username:1,
                            avatar:1,
                        }
                    }
                ]
            },
            
            
        },
        {
            $addFields:{
                owner:{
                    $first:"$owner"
                }
            }
        },
        {
            $skip: (Number(page) - 1) * Number(limit),
        },
        {
            $limit: Number(limit),
        },
    ])

    if(!videos){
        throw new ApiError(500,"Failed to fetch Videos");
    }

    return res
    .status(200)
    .json(new ApiResponse(200,videos,"Videos Fetched successfully"));
})

export {
    uploadVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    getAllVideos,
    getUserVideos,
    getHomePageVideos
}