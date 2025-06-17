import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const user=req.user?._id;
    //TODO: create playlist
    const playlist=await Playlist.create({
        name:name,
        description:description,
        owner:user
    })
    if(!playlist){
        throw new ApiError(400,"Something went wrong");
    }
    return res.status(200)
    .json(new ApiResponse(200,playlist,"Playlist created"));

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(!mongoose.isValidObjectId(userId)){
        throw new ApiError(400,"Not playlist found");
    }
    const playlist=await Playlist.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(userId)
            }
        },{
            $sort:{createdAt:-1}
        },
        {
            $lookup:{
                from:"uers",
                localField:"owner",
                foreignField:"_id",
                as:"playListDetails"
            }
        },{
            $project:{
                _id:1,
                name:1,
                description:1,
                username:"$playListDetails.username"
            }
        }
    ]);
    return res.status(200)
    .json(new ApiResponse(200,{
        total:playlist.length,
        playlist
    },
    "All user playlist fetched"
))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(404,"Playlist not found");
    }
    const playlist=await Playlist.findById(playlistId);
    // console.log(playlist);
    
    return res.status(200)
    .json(new ApiResponse(200,playlist,"Playlist fetched"));
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
      if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(404,"Playlist not found");
    }
    await Playlist.findByIdAndDelete(playlistId);
     return res.status(200)
     .json(new ApiResponse(200,{},"Playlist deleted"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
      if(!mongoose.isValidObjectId(playlistId)){
        throw new ApiError(404,"Playlist not found");
    }
    if(!name && !description){
        throw new ApiError(400,"Name or description are needed to be update the playlist");
    }
    const data={};
    if(name) data.name=name;
    if(description) data.description=description;
    const playlist=await Playlist.findByIdAndUpdate(playlistId,data,
    {new:true});

    return res.status(200)
    .json(new ApiResponse(200,playlist,"Playlist updated"));
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}