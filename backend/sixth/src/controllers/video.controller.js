import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudnary.js"


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
    
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

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