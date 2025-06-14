import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {deleteCloudinary, uploadOnCloudinary} from '../utils/cloudnary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import { log } from "console";

const generateAccessAndRefreshToken= async(userId)=>{
    try {
        const user=await User.findById(userId);
        const  refreshToken=user.generateRefreshToken();
       const accessToken= user.generateAccessToken();

       user.refreshToken=refreshToken;
       await user.save({validateBeforeSave: false});

       return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,'Something went wrong while generating token');
    }
}

//steps to register:-
//get user setails
//validation for data
//check if user already exists: username,email
//check for images, check for avatar
//upload them to cloudinary, avatar
//create user object- create entry in db
//remove password and refresh token from response
// check for user creation
//return res 

// const registerUser= asyncHandler( async(req,res)=>{
//     res.status(200).json({
//         message:"rahul"
//     })
// })
const registerUser= asyncHandler( async(req,res)=>{
    const {fullname,email,username,password}=req.body;
    // console.log(req.body);
    
    // console.log("email",email);
    // if(fullname===""){
    //     throw new ApiError(400,'fullname is required');
    // }
    if(
        [fullname,email,password,username].some((field)=> 
        field?.trim()==="")
    ){
        throw new ApiError(400,"all fields are required");
    }

    //email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Please provide a valid email address");
    }

    //password validation
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{6,}$/;
    // if (!passwordRegex.test(password)) {
    //     throw new ApiError(
    //         400,
    //         "Password must be at least 6 characters long and include uppercase, lowercase, and a number or special character"
    //     );
    // }

   const existedUser=await User.findOne({
        $or:[
            {email},
            {username}
        ]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists");
    }
    // console.log(req.files);

    const avaratLocalPath=req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage)
        && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path;
    }
    if(!avaratLocalPath){
        throw new ApiError(404,'Avatar file is required');
    }
    const avatar= await uploadOnCloudinary(avaratLocalPath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);
    


    if(!avatar){
        throw new ApiError(404,'Avatar file is required');
    }


   const user=await User.create({
        fullname,
        email,
        password,
        username: username.toLowerCase(),
        avatar: avatar.url,
        coverImage: coverImage?.url ||""
    })
    //in selectbwhich we don't want
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registeration");
    }
    console.log("reated user: ",createdUser);
    
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
    )

    
})

const loginUser=asyncHandler(async (req,res)=>{
    //reqbody-> data
    //username or email
    //find the user
    //password check
    // access and refresh token
    //send cookie

    const {email,username,password}=req.body;
    if(!(!username || !email)){
        throw new ApiError(400,"username or email is required");
    }
    const user= await User.findOne({
        $or:[
            {email},
            {username}
        ]
    })
    if(!user) throw new ApiError(404,'user does not exist');
    const isPasswordValid=  await user.isPasswordCorrect(password);

    if(!isPasswordValid) throw new ApiError(401,'Password is incorrect');

    const {accessToken,refreshToken}= await generateAccessAndRefreshToken(user._id);

    const loggedUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
        200,
        {
            user:loggedUser, accessToken, refreshToken
        },
        "User logged In Successfully"
    )
    )
})

const logoutUser=asyncHandler(async (req,res)=>{
   await User.findByIdAndUpdate(
    req.user._id,
    {
        $unset:{
            refreshToken:1 // this removes the field from document
        }
    },
    {
        new:true
    }
   )
   const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"user logged out"));

})

const refreshAccessToken= asyncHandler(async (req,res)=>{
   const incomingToken= req.cookies.refreshToken || req.body.refreshToken;
   if(!incomingToken){
    throw new ApiError(401,"unauthorized request");
   }
   try {
    const decodedToken= jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET);
    const user= await User.findById(decodedToken?._id);
     if(!user){
     throw new ApiError(401,"Invalid refresh Token");
    }
    if(incomingToken!== user?.refreshToken){
     throw new ApiError(401,"Refresh Token is expired or used");
    }
    const options={
     httpOnly:true,
     secure:true
    }
   const {accessToken,newrefreshToken}= await generateAccessAndRefreshToken(user._id);
 
     return res
     .status(200)
     .cookie("accessToken",accessToken,options)
     .cookie("refreshToken",newrefreshToken,options)
     .json(
         new ApiResponse(
             200,
             {accessToken,refreshToken:newrefreshToken},
             "Access token refreshed"
         )
     )
   } catch (error) {
    throw new ApiError(401,error?.message || "Invalid refresh token");
   }
})

const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const{oldPassword,newPassword}=req.body;

    const user= await User.findById(req.user?._id);
  const isPasswordCorrect= await user.isPasswordCorrect(oldPassword);
  if(!isPasswordCorrect){
    throw new ApiError(400,"invalid password");
  }
  user.password=newPassword;
  await user.save({validateBeforeSave:false})

  return res.status(200)
  .json(new ApiResponse(200,{},"Password changed successfully"));
})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200)
    .json(new ApiResponse(200,req.user,"current user fetched successfully"));
})

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullname,email}=req.body;
    if(!fullname || !email){
        throw new ApiError(400,"All fields are required");
    }
    const user= await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullname,
                email
            } 
        },
        {new:true}
    ).select("-password");
 

    return res
    .status(200)
    .json(new ApiResponse(200,user,"Account details updated successfully"));
})

const updateUserAvatar=asyncHandler(async(req,res)=>{
    const avaratLocalPath=req.file?.path;
    if(!avaratLocalPath){
        throw new ApiError(400,"Avatar file is missing");
    }
  
    const avatar=await uploadOnCloudinary(avaratLocalPath);
    if(!avatar.url){
        throw new ApiError(400,"error while uploading the avatar");
    }

    //existing avatar lnk taken
    const user1 = await User.findById(req.user?._id);
    const oldAvatarPublicId = user1.avatar;
    // console.log("oldAvatar: ",oldAvatarPublicId);

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select("-password")
    if(oldAvatarPublicId){
        await deleteCloudinary(oldAvatarPublicId);
    }
    
    return res.status(200)
    .json(new ApiResponse(200,user,"Avatar updated successfully"))
})

const updateUserCoverImage=asyncHandler(async(req,res)=>{
    const coverImageLocalPath=req.file?.path;
    if(!coverImageLocalPath){
        throw new ApiError(400,"cover image file is missing");
    }
    const coverImage=await uploadOnCloudinary(coverImageLocalPath);
    if(!coverImage.url){
        throw new ApiError(400,"error while uploading the coverImage");
    }
    const user1=await User.findById(req.user?._id);
    const oldCoverImage=user1?.coverImage;
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                 coverImage:coverImage.url
            }
        },
        {new:true}
    ).select("-password")
    if(oldCoverImage){
        await deleteCloudinary(oldCoverImage);
    }

    return res.status(200)
    .json(new ApiResponse(200,user,"coverImage updated successfully"))
})

const getUserChannelProfile=asyncHandler(async(req,res)=>{
    const {username}=req.params
    if(!username?.trim()){
        throw new ApiError(400,'username is misssing');
    }
    //aggregatioion pipeline

    const channel=await User.aggregate([
        {
            $match:{
                username:username?.toLowerCase()
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:'channel',
                as:"subscribers"
            }
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:'subscriber',
                as:"subscribedTo"
            }
        },
        {
            $addFields:{
                subsscriberCounts:{
                    $size: "$subscribers",
                },
                channelsSubscribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed: {
                    $cond:{
                        if: {$in: [req.user?._id,"$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
//projection means we only want to send these data so as to reduce the size of data being sent

            $project:{
                fullname:1,
                username:1,
                subsscriberCounts:1,
                channelsSubscribedToCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage:1

            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404,'Channel does not exist');
    }

    return res
    .status(200)
    .json(new ApiResponse(200,channel[0],"User channel fetched successfully"));
})

const getWatchHistory=asyncHandler(async(req,res)=>{
       const user=await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:'videos',
                localField:'watchHistory',
                foreignField:'_id',
                as:'watchHistory',
                pipeline:[
                    {
                        $lookup:{
                            from:'users',
                            localField:'owner',
                            foreignField:'_id',
                            as:'owner',
                            pipeline:[
                                {
                                    $project:{
                                        fullname:1,
                                        username:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res.status(200)
    .json(new ApiResponse(200,user[0].watchHistory,"Watch history fetched success"))
})

export {
    registerUser, loginUser, logoutUser, refreshAccessToken,
    changeCurrentPassword, getCurrentUser, updateAccountDetails,
    updateUserAvatar, updateUserCoverImage, getUserChannelProfile,
    getWatchHistory
}