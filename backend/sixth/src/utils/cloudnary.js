import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.LOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudnary= async(localFilePath)=>{
    try {
        if(!localFilePath) return null;
        //upload the file on cloudinary
       const response= await cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file uploaded
        console.log('file is uploaded successful', response.url);
        return response;
        
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the local saved temp file as
        //the ipload operation get failed
        return null; 
    }
}


export{uploadOnCloudnary}
