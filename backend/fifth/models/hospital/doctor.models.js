const {model,Schema, default: mongoose} = require('mongoose');

const doctorSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    salary:{
        type:Number,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    experienceInYears:{
        type:Number,
        default:0
    },
    worksInHospital:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Hospital'
        }
    ]
},{timestamps:true})

export const Doctor=model('Doctor',doctorSchema);