const descriptor=Object.getOwnPropertyDescriptor(Math,"PI");
console.log(descriptor);


//chnaging the value of pi
// console.log(Math.PI);

const chai={
    name:"ginger chai",
    price:250,
    isAvilable:true
}

Object.defineProperty(chai, 'name',{
    writable: false,
    enumerable: false,
})
console.log(Object.getOwnPropertyDescriptor(chai,"name"));

//we will not get name here as we have set it as enumerable: false
for(let [key,val] of Object.entries(chai)){
    if(typeof val !=='function'){
        console.log(`${key} : ${val}`);
        
    }
}
