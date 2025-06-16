import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const user=req.user?._id;
    console.log("user is: ",user);
    
    const {content}=req.body;

    const tweet=await Tweet.create({
        content:content,
        owner:user
    });
    if(!tweet){
        throw new ApiError(400,"Something went wrong");
    }

    return res.status(201)
    .json(new ApiResponse(200,tweet,"New tweet created"));
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const{userId}=req.params;
    let {page=1,limit=10}=req.query;
    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(404,"User not found");
    }
    page=parseInt(page);
    limit=parseInt(limit);
    const tweets=await Tweet.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort:{ createdAt: -1 } // latest first
        },{
            $limit:limit
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"ownerDetails"
            }
        },
        {
            $project:{
                _id:1,
                content:1,
                createdAt:1,
                username:"$ownerDetails.username"
            }
        }
    ]);
    const totalTweets=await Tweet.countDocuments({owner:userId});
    return res.status(200)
    .json(new ApiResponse(200,{
        total:totalTweets,
        page,
        count:tweets.length,
        tweets
    },
    "All tweets fetched"
    ));
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId}=req.params;
    const {content}=req.body;
    if(!mongoose.isValidObjectId(tweetId)){
        throw new ApiError(404,"No tweet found");
    }
    const tweet=await Tweet.findByIdAndUpdate(tweetId,{
        content:content
    },
    {new:true}
    ); 

    return res.status(200)
    .json(new ApiResponse(200,tweet,"Tweet updated successfully"));

})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params;
      if(!mongoose.isValidObjectId(tweetId)){
        throw new ApiError(404,"No tweet found");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200)
    .json(new ApiResponse(200,{},"Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}