//run file by npm run start
require('dotenv').config()
const express=require('express');
const app=express();
// const port=3000;
app.get('/',(req,res)=>{
    res.send('Hello world');
})

app.get('/login',(req,res)=>{
    res.send('<h1>Rahul</h1>')
})

// app.listen(port,()=>{
//     console.log(`Example app listrning at port ${port}`);
// })
app.listen(process.env.PORT,()=>{
    console.log(`Example app listrning at port ${port}`);
})