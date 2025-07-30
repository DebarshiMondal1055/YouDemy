import { v2 as cloudinary } from 'cloudinary'
import { response } from 'express';
import fs from "fs"

cloudinary.config({ 
  cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const uploadInCloudinary=async (localFilePath)=>{
    try{
        if(!localFilePath) return null
        const response= await cloudinary.uploader.upload(localFilePath,{
        resource_type:'auto'
        })
        fs.unlinkSync(localFilePath)
        return response
    }
    catch(error){
        fs.unlinkSync(localFilePath);
        return null       
    }
}

const deleteInCloudinary=async(asset,resourceType)=>{
    try{
        const urlParts=asset.split('/');
        const fileNameWithExtension=urlParts[urlParts.length-1].split('.');
        const publicId=fileNameWithExtension[0];
        
        if(!asset) return null;
        const response=await cloudinary.uploader.destroy(publicId,{
            resource_type:resourceType
        })
        return response;
    }
    catch(error){
        return null;
    }

}

export {uploadInCloudinary,deleteInCloudinary}