import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { deleteCloudinary, deleteCloudinaryVideo, uploadOnCloudinary } from "../utils/cloudnary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    page=parseInt(page);
    limit=parseInt(limit);
    const skip=(page-1)*limit;

    const searchFilter={};
    //reges helps in partial string matcing
    // options : i makes it case insensitive search
    if(query){
        searchFilter.$or=[
            {title:{$regex: query, $options:"i"}},
            {description:{$regex: query, $options:"i"}},
        ]
    }

    if(userId && mongoose.Types.ObjectId.isValid(userId)){
        searchFilter.owner=userId;
    }

    searchFilter.isPublished=true;
    const sortOptions={};
    sortOptions[sortBy]= sortType==="asc"? 1:-1;
    //1 for asc and -1 for desc

    //total count for pagination
    const totalVideos=await Video.countDocuments(searchFilter);
    if(!totalVideos){
        new ApiError(500,"Something went wrong");
    }

    //fetch the paginated videos
    const videos=await Video.find(searchFilter)
    .populate("owner","username")
    .sort(sortOptions)
    .skip(skip)
    .limit(limit)
    .exec();

    if(!videos){
        new ApiError(404, "Video not found");
    }

    return res.status(200)
    .json(new ApiResponse(
        200,
        {
            total:totalVideos,
            page,
            limit,
            videos
        },
        "Videos fetched successfully"
    ));

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
    // so populate helps us when we have a ref of other doc like in this case we have access of user in form of owner
    // so using populate helps us to get the access to user's doc and we can select what data comes from doc like here only username
    const video=await Video.findById(videoId)
    .populate("owner","username")
    .exec();

    if(!video){
        new ApiError(500,"Something went wrong");
    }
    const user=req.user?._id.toString();
    if(!video.isPublished && user!==video.owner._id.toString()){
        throw new ApiError(403, "Unauthorized access to unpublished video");
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
    const video=await Video.findById(videoId);
    if(!video){
        throw new ApiError(404,"Video not found");
    }
    const user = req.user?._id?.toString();
    if (user !== video.owner.toString()) {
        throw new ApiError(403, "Unauthorized Access");
    }
    const vid=video.videoFile;
    const thumbNail=video.thumbNail;
    const del=await Video.findByIdAndDelete(videoId)
    if(!del){
        throw new ApiError(500,"Something went wrong");
    }
    await deleteCloudinaryVideo(vid);
    await deleteCloudinary(thumbNail);

    return res.status(200)
    .json(new ApiResponse(200,{},"Video deleted successfully"));

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const user = req.user?._id?.toString();
    if (user !== video.owner.toString()) {
        throw new ApiError(403, "Unauthorized Access");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(
        new ApiResponse(200, video, `Video is now ${video.isPublished ? 'Published' : 'Unpublished'}`)
    );
});


export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}