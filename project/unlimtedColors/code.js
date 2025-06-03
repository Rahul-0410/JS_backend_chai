const start=document.querySelector('#start');
const stop=document.querySelector('#stop');

const randomColor=()=>{
    const hex="0123456789ABCDEF";
    let color='#';
    for(let i=0;i<6;i++){
        color+=hex[Math.floor(Math.random()*16)];
    }
    return color;
}
// console.log(Math.floor(Math.random()*16));
let id;
start.addEventListener('click',()=>{
    if(!id){
    id=setInterval(()=>{
        let color=randomColor();
        document.body.style.backgroundColor=color;
    },1000)
    }
   
})

stop.addEventListener('click',()=>{
    clearInterval(id);
    id=null;
    // document.body.style.backgroundColor='#212121';
    console.log("stopped");
    
})
