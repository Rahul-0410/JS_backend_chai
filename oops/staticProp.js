
class User{
    constructor(username){
        this.username=username
    }
      logMe(){
        console.log(`User name is ${this.username}`);
        
    }

    static createId(){
        return '123';
    }
}
const rahul=new User("rahul");
// console.log(rahul.createId());

class Teacher extends User{
    constructor(username,email){
        super(username);
        this.email=email;
    }
}
const iphone=new Teacher('rgs','iphone@gamil');
iphone.logMe();
console.log(iphone.createId());


