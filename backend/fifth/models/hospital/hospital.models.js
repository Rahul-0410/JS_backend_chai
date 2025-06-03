const {model,Schema} = require('mongoose');

const hospitaldSchema= new Schema({
    name:{
         type:String,
        required:true
    },
    addressLine1:{
         type:String,
        required:true
    },
    addressLine2:{
        type:String,
    },
    city:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    specializedIn:{
        type:String,
        required:true
    }
},{timestamps:true})

export const Hospital=model('Hospital',hospitaldSchema);