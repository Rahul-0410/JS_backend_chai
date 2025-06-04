class User{
    constructor(email,password){
        this.email=email;
        this.password=password;
    }

    //if use get then also use
    get password(){
        return this._password.toUpperCase();
    }

    set password(value){
        this._password=value;
    }
}

const rgs=new User("hitesh@gmail.com","abc");
console.log(rgs.password);
