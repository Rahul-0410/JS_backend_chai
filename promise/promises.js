const promise1= new Promise(function(resolve,reject){
    //do an async task, db calls
    setTimeout(()=>{
        console.log('task is complete');
        //wthout resolve() promise consumed is not printed
        resolve()
    },1000);
})
//promise consume
promise1.then(function(){
    console.log('promise consumed');
    
})

new Promise((res,rej)=>{
    setTimeout(()=>{
        console.log('task2 completed');
        res();
        
    },1000)
}).then(()=>{
    console.log('async 2 resolved');
    
})

const promise3=new Promise((res,rej)=>{
    setTimeout(()=>{
        res({username:"Chai",email:"chai@example.com"})
    },1000)
})
promise3.then((user)=>{
    console.log(user);
    
})

const promise4= new Promise(function (res,rej) {
    setTimeout(()=>{
        let error=true;
        if(!error){
            res({username:"rahul",password:"1234"});
        }else {
            rej('Error: something went wrong');
        }
    },1000)
})

//this syntax gives error
// const username=promise4.then((user)=>{
//     console.log(user);
//     return user.username;
// })
// console.log(username);
promise4.then((user)=>{
    console.log(user);
    return user.username;
}).then((name)=>{
    console.log(name);  
}).catch((err)=>{
    console.log(err);  
}).finally(()=> console.log("The promise is either resolved or rejected"))

const promise5=new Promise((res,rej)=>{
    setTimeout(()=>{
         let error=true;
        if(!error){
            res({username:"rgs",password:"1234"});
        }else {
            rej('Error: JS went wrong');
        }
    },1000)
})

//aync await does not handle error directly
async function consumePromise5(){
 try{
     const response= await promise5;
  console.log(response);
 }catch(err){
    console.log(err);
    
 }
}
consumePromise5();

// async function getAllUsers(){
//     try {
//         const response = await fetch('https://jsonplaceholder.typicode.com/users')

//         const data = await response.json()
//         console.log(data);
//     } catch (error) {
//         console.log("E: ", error);
//     }
// }

//getAllUsers()

fetch('https://api.github.com/users/hiteshchoudhary')
.then((response) => {
    return response.json()
})
.then((data) => {
    console.log(data);
})
.catch((error) => console.log(error))

// promise.all
// yes this is also available, kuch reading aap b kro.

