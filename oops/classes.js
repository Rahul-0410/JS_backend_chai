// class User{
//     constructor(username,email,password){
//         this.username=username;
//         this.email=email;
//         this.password=password;
//     }

//     encryptPassword(){
//         return `${this.password} abc`;
//     }

//     changeUsername(){
//         return `${this.username.toUpperCase()}`;
//     }
// }

// const chai=new User("chai","chai@gamil","123");
// console.log(chai.encryptPassword());
// console.log(chai.changeUsername());

//behind the scnee

function user(username,email,password){
    this.username=username;
    this.email=email;
    this.password=password;
}

user.prototype.encryptPassword=function(){
    return `${this.password} abc`;
}

const chai=new user("chai","chai@gamil","123");
console.log(chai.encryptPassword());
// console.log(chai.changeUsername());

