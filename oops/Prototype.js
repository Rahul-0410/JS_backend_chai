// let myName="rahul     ";

// console.log(myName.length);
// console.log(myName.truelength);

let myHeros=["thor","spiderman"];

let herpPower={
    thor:"hammr",
    spiderman:"slling",

    getSpiderPower:function(){
        console.log(`spider power is ${this.spiderman}`);
        
    }
}
Object.prototype.rahul=function(){
    console.log('rahul is prrsent in all objects');
    
}

Array.prototype.heyRahul=function(){
    console.log('hello from rahul');
    
}
herpPower.rahul();
myHeros.rahul();
// let a="hi";

//this gives error as everything is object so if we give any property in object 
//it is avail to all func,array an object 
//but with array it is only applicable to arrays
// herpPower.heyRahul();
myHeros.heyRahul();
// a.rahul();

// inheritance
const User={
    name:"chai",
    email:"rgs@xyz"
}
const Teacher={
    makeVideo:true
}

const TeachingSupport={
    isAvail:false
}
const TASupport={
    makeAssignment:'JS Assignment',
    fullTime:true,
    __proto__:TeachingSupport
}
Teacher.__proto__=User

//modern syntax
Object.setPrototypeOf(TeachingSupport,Teacher);

let name="chaiaur code      ";

String.prototype.truelength=function(){
    console.log(`${this}`);
    console.log(` True length is: ${this.trim().length}`);  
}

name.truelength()