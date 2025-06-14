import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { deleteCloudinary, uploadOnCloudinary } from "../utils/cloudnary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(title===" " || description===" "){
        throw new ApiError(404, "Title and description are required");
    }
    const videoLocalPath=req.files?.videoFile[0]?.path;
    const thumbnailLocalpath=req.files?.thumbnail[0]?.path;
    if(!videoLocalPath){
        throw new ApiError(400,"Video file is required");
    }
    if(!thumbnailLocalpath){
        throw new ApiError(400,"Thumbnail file is required");
    }

    const video=await uploadOnCloudinary(videoLocalPath);
    // console.log("Video: ", video);
    
    const thumbNail=await uploadOnCloudinary(thumbnailLocalpath);
    const duration=video.duration;
    const owner=req.user?._id;
    if(!video){
        new ApiError(404,"Video file is required");
    }
    if(!thumbNail){
        throw new ApiError(400,"Thumbnail file is required");
    }
    const user=await Video.create({
        title,
        description,
        videoFile:video.url,
        thumbNail:thumbNail.url,
        duration:duration,
        owner: owner
    })

    if(!user){
        throw new ApiError(500,"Something went wrong while uploading the files");
    }
    // console.log("User: ", user);
    

    return res.status(201)
    .json(new ApiResponse(200,user,"Video uploaded successfully"));
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const video=await Video.findById(videoId)
    .populate("owner","username")
    .exec();

    if(!video){
        new ApiError(500,"Something went wrong");
    }

    return res.status(200).json(
        new ApiResponse(200,video,"Video fetched successfully")
    );

})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(404, "Video not found");
    }
    const user=req.user?._id.toString();
    if(user!==video.owner._id.toString()){
        new ApiError(403,"Unauthorized Access");
    }
    const {title,description}=req.body;
    if(!title || !description){
        throw new ApiError(404, "Field data are required to go forward");
    }
    const oldthumbnail=video.thumbNail;
    const thumbnailLocalpath=req.file?.path;
    
    const data={};
    if(title) data.title=title;
    if(description) data.description=description;
    if(thumbnailLocalpath){
       const thumbNail=await uploadOnCloudinary(thumbnailLocalpath);
       data.thumbNail=thumbNail.url;
    }
    const updatedVideo=await Video.findByIdAndUpdate(videoId,data,{
        new:true
    });

    if(!updateVideo){
        throw new ApiError(500, "Something went wrong while updation")
    }

    if(updatedVideo && thumbnailLocalpath){
        await deleteCloudinary(oldthumbnail);
    }

    return res.status(200)
    .json(new ApiResponse(200,updatedVideo,"Video details updated"))


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}