import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudnary} from '../utils/cloudnary.js'
import { ApiResponse } from "../utils/ApiResponse.js";

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
    console.log("email",email);
    // if(fullname===""){
    //     throw new ApiError(400,'fullname is required');
    // }
    if(
        [fullname,email,password,username].some((field)=> 
        field?.trim()==="")
    ){
        throw new ApiError(400,"all fields are required");
    }
   const existedUser= User.findOne({
        $or:[
            {email},
            {username}
        ]
    })
    if(existedUser){
        throw new ApiError(409,"User with email or username already exists");
    }

    const avaratLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    if(!avaratLocalPath){
        throw new ApiError(404,'Avatar file is required');
    }
    const avatar= await uploadOnCloudnary(avaratLocalPath);
    const coverImage=await uploadOnCloudnary(coverImageLocalPath);
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

export {registerUser}