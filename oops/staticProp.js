
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
console.log(rahul.createId());

