//run file by npm run start
require('dotenv').config()
const express=require('express');
const app=express();
const cors=require('cors');
// const port=3000;
// app.get('/',(req,res)=>{
//     res.send('Hello world');
// })

app.get('/api/jokes',(re,res)=>{
    const jokes = [
  {
    id: 1,
    title: "Why don't scientists trust atoms?",
    content: "Because they make up everything!"
  },
  {
    id: 2,
    title: "Parallel lines",
    content: "Parallel lines have so much in common… It’s a shame they’ll never meet."
  },
  {
    id: 3,
    title: "Elevator joke",
    content: "I would tell you an elevator joke, but it’s an uplifting experience."
  },
  {
    id: 4,
    title: "Why did the scarecrow win an award?",
    content: "Because he was outstanding in his field!"
  },
  {
    id: 5,
    title: "Time flies",
    content: "Time flies like an arrow. Fruit flies like a banana."
  }
];
    res.send(jokes);
})

const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`Example app listrning at port ${port}`);
})  