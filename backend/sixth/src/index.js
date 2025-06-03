// require('dotenv').config({path:'./env'});
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import express from 'express';
// import mongoose from "mongoose";
// import { DB_NAME } from './constants';
import connectDB from './db/index.js';
const app=express();

// console.log("Current directory:", process.cwd());

// console.log("MONGO_URI =", process.env.MONGO_URI);

//IIFE
// (async ()=>{
//     try{
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//         console.log('DB connected');
//         app.on("error",(error)=>{
//             console.log("Error: ",error);
//             throw error;
//         })

//         const port=process.env.PORT;
//         app.listen(port,()=>{
//             console.log('server running at 5000');
            
//         })
        
//     }catch(err){
//         console.error("Error: ",err);
//         throw err;
        
//     }
// })()

connectDB();


