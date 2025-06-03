const express=require('express');
const app=express();




//middleware
// app.use(function(req,res,next){
//     console.log('i am middle ware');
//     next();
// })

// app.get('/',(req,res)=>{
//     res.send('hello world');
// })
// app.get('/profile',(req,res)=>{
//     res.send('hello rgs');
// })

// //dynamic route
// app.get('/profile/:username',(req,res)=>{

//     res.send(`Hello from ${req.params.username}`)
// })

// configure the ejs
// when using ejs use res.render()
app.set("view engine", "ejs");
//to setup static files -> make a public  folder then inside public make images, stlysheets and js for frontend
app.use(express.static('./public'))



app.get("/",(req,res)=>{
    // res.render('index')
    res.render('index',{age:12});
})

app.listen(3000);