import mongoose from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    let {page = 1, limit = 10} = req.query
    if(!mongoose.isValidObjectId(videoId)){
        throw new ApiError(404,"Video does not exist");
    }
    page=parseInt(page);
    limit=parseInt(limit);
    const skip=(page-1)*limit;
    const comments=await Comment.aggregate([
        {
            $match:{
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $sort:{
                 createdAt: -1
            }
        },{
            $skip:skip
        },
        {
            $limit:limit
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"ownerDetails"
            }
        },{
            $project:{
                _id:1,
                content:1,
                createdAt: 1,
                username:"$ownerDetails.username"
            }
        }
    ]);

    const totalComment=await Comment.countDocuments({video:videoId});

    return res.status(200)
    .json(new ApiResponse(200,{
        total:totalComment,
        page,
        count:comments.length,
        comments
    },"All comments for the video fetched"));

})

const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;
    const user = req.user?._id;

    if (!content || !videoId) {
        throw new ApiError(400, "Content and Video ID are required");
    }

    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: user
    });

    if (!comment) {
        throw new ApiError(400, "Something went wrong");
    }

    return res.status(200)
        .json(new ApiResponse(200, comment, "Comment added successfully"));
});


const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId}=req.params;
    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(400, "wrong comment id");
    }
    const {content}=req.body;
    const comment=await Comment.findByIdAndUpdate(commentId,{
        $set:{
            content
        }
    },
    {new:true}
    )

    return res.status(200)
    .json(new ApiResponse(200,comment,"Comment updated successfully"));
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
     const {commentId}=req.params;
    if(!mongoose.isValidObjectId(commentId)){
        throw new ApiError(400, "wrong comment id");
    }
    await Comment.findByIdAndDelete(commentId);

    return res.status(200)
    .json(new ApiResponse(200,{},"Comment deleted successfully"));
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }