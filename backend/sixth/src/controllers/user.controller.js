import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import {uploadOnCloudinary} from '../utils/cloudnary.js'
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';

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
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{6,}$/;
    if (!passwordRegex.test(password)) {
        throw new ApiError(
            400,
            "Password must be at least 6 characters long and include uppercase, lowercase, and a number or special character"
        );
    }

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
        $set:{
            refreshToken: undefined
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


export {registerUser, loginUser, logoutUser, refreshAccessToken}