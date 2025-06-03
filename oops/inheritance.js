class User{
    constructor(username){
        this.username=username
    }

    logMe(){
        console.log(`User name is ${this.username}`);
        
    }
}
class Teacher extends User{
    constructor(username,email){
        super(username)
        this.email=email;
    }

    addCourse(){
        console.log(`A new course was added by ${this.username}`)
    }
}

const teacher=new Teacher("rahul","email");
teacher.logMe();
teacher.addCourse();