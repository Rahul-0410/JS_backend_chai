const {model,Schema} = require('mongoose');

const categorySchema= new Schema({
    name:{
        type:String,
        required:true
    }

},{timestamps:true})

export const Category = model('Category',categorySchema);