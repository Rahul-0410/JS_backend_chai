import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
         throw new ApiError(404, "Invalid channel ID");
    }
    const user=req.user?._id;

    const existing=await Like.findOne({
        video:videoId,
        likedBy:user
    })

    if(existing){
        await Like.findByIdAndDelete(existing._id);

        return res.status(200)
        .json(new ApiResponse(200,{},"Video unliked"));
    }
    const liked=await Like.create({
        video:videoId,
        likedBy:user
    })

    return res.status(200)
    .json(new ApiResponse(200,liked,"Video liked"));

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(404, "Invalid comment ID");
    }
    const user=req.user?._id;
    const existing=await Like.findOne({
        comment:commentId,
        likedBy:user
    })
    if(existing){
        await Like.findByIdAndDelete(existing._id);
         return res.status(200)
        .json(new ApiResponse(200,{},"Comment unliked"));
    }
     const liked=await Like.create({
        comment:commentId,
        likedBy:user
    })

    return res.status(200)
    .json(new ApiResponse(200,liked,"Comment liked"));
    
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!mongoose.isValidObjectId(tweetId)){
        throw new ApiError(404, "Invalid tweet ID");
    }
    const user=req.user?._id;
    const existing=await Like.findOne({
        tweet:tweetId,
        likedBy:user
    })
    if(existing){
        await Like.findByIdAndDelete(existing._id);
         return res.status(200)
        .json(new ApiResponse(200,{},"Tweet unliked"));
    }
     const liked=await Like.create({
        tweet:tweetId,
        likedBy:user
    })

    return res.status(200)
    .json(new ApiResponse(200,liked,"Tweet liked"));
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const user=req.user?._id;

    const likedVideo=await Like.aggregate([
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(user),
                video:{$exists: true, $ne:null}
                //ne is for not equal to
            }
        },
        {
            $sort:{createdAt:-1}
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"videoDetails"

            }
        },
          {
            $unwind:"$videoDetails"
        },
        {
            $project:{
                _id:1,
                createdAt:1,
                video:"$videoDetails"
            }
        }
    ]);
    
    return res.status(200)
    .json(new ApiResponse(200,{
        total:likedVideo.length,
        likedVideo
    },
    "All liked videos fetched"
));
})

const getCommentLikes=asyncHandler(async(req,res)=>{
    const user=req.user?._id;

    const likedCommendt=await Like.aggregate([
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(user),
                comment:{$exists:true,$ne:null}
            }
        },{
            $sort:{createdAt:-1}
        },{
            $lookup:{
                from:"comments",
                localField:"comment",
                foreignField:"_id",
                as:"commentDetails"
            }
        },{
            $project:{
                _id:1,
                createdAt:1,
                comment:"$commentDetails"
            }
        }
    ])

    return res.status(200)
    .json(new ApiResponse(200,{
        total:likedCommendt.length,
        likedCommendt
    },"Likes fetched"))
})
const getTweetLikes=asyncHandler(async(req,res)=>{
    const user=req.user?._id;

    const likedTweet=await Like.aggregate([
        {
            $match:{
                likedBy:new mongoose.Types.ObjectId(user),
                tweet:{$exists:true,$ne:null}
            }
        },{
            $sort:{createdAt:-1}
        },{
            $lookup:{
                from:"tweets",
                localField:"tweet",
                foreignField:"_id",
                as:"tweetDetails"
            }
        },{
            $project:{
                _id:1,
                createdAt:1,
                comment:"$tweetDetails"
            }
        }
    ])

    return res.status(200)
    .json(new ApiResponse(200,{
        total:likedTweet.length,
        likedTweet
    },"Likes fetched"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getCommentLikes,
    getTweetLikes
}