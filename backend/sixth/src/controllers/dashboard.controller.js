import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const user=req.user?._id;
     if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    //count of videos
    const totalVideos=await Video.countDocuments({owner:user});
    
    //count totalViews
    const videoStats=await Video.aggregate([
        {$match:{owner:new mongoose.Types.ObjectId(user)}},
        {$group:{_id:null,totalViews:{$sum:"$views"}}}
    ])
    const totalViews = videoStats[0]?.totalViews || 0;

    //count totalLikes
    const uservideoId=await Video.find({owner:user}).select("_id");
    const videoId=uservideoId.map(item=>item._id);
     const totalLikes = await Like.countDocuments({
        video: { $in: videoId }
    });
    //count subs
    const subCount=await Subscription.countDocuments({channel:user});

    return res.status(200)
    .json(new ApiResponse(200,{
        totalVideos,
        totalViews,
        totalLikes,
        subCount
    },
    "All channel stats sent"
));

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const user=req.user?._id;
    const videos = await Video.find({ owner: user })
    .sort({ createdAt: -1 });

    return res.status(200)
    .json(new ApiResponse(200,videos,"All user video fetched"));
})

export {
    getChannelStats, 
    getChannelVideos
    }