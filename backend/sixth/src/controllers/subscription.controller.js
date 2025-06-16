import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import {Subscription} from "../models/subscription.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
      if (!mongoose.isValidObjectId(channelId)) {
         throw new ApiError(404, "Invalid channel ID");
    }
    const currUser=req.user?._id;
    if(currUser.toString()===channelId){
        throw new ApiError(400,"You can't subscribe to your own channel");
    }
   
   const existing=await Subscription.findOne({
     subscriber:currUser,
     channel:channelId
   })

   if(existing){
    await Subscription.findByIdAndDelete(existing._id);

    return res.status(200)
    .json(new ApiResponse(200,{},"Channel unsubscribed"));
   }
    const subscription=await Subscription.create({
    subscriber:currUser,
     channel:channelId
    });

    return res.status(200)
    .json(new ApiResponse(200,subscription,"Channel subscribed"));
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if (!isValidObjectId(channelId)) {
         throw new ApiError(400, "Invalid channel ID");
    }
    //validation for only channel owner can check the subscriber list
    if(channelId!==req.user?._id.toString()){
        throw new ApiError(400,"Unauthorized access");
    }

    const subscribers=await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId(channelId)
            }
        },{
            $lookup:{
                //helps to look for the information in mongodb
                from:"users",
                localField:"subscriber",
                foreignField:'_id',
                as:"subscriberDetails"
                
            }
        },
        {
            //Flattens the subscriberDetails array
            $unwind:"$subscriberDetails"
        },{
            //selects the data which we will send in response
            $project:{
                _id:0,
                subscriberId:"$subscriberDetails._id",
                subscriberName:"$subscriberDetails.username",
                subscriberEmail:"$subscriberDetails.email",
            }
        }
    ]);

    return res.status(200)
    .json(new ApiResponse(200,{
        count:subscribers.length,
        subscribers
    },
    "All subscribers fetched"
));

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400, "Invalid user ID");
    }
    if(subscriberId!==req.user?._id.toString()){
        throw new ApiError(400,"Unauthorized access");
    }

    const channel=await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:'_id',
                as:"channelDetails"
            }
        },
        {
            $unwind:"$channelDetails"
        },{
            $project:{
                _id:0,
                channelName:"$channelDetails.username"
            }
        }
    ]);

    return res.status(200)
    .json(new ApiResponse(
        200,
        {
            count:channel.length,
            channel
        },
        "All Channel fetched"
    ))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}