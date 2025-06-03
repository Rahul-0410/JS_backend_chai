const {model,Schema, default: mongoose} = require('mongoose');

const subTodoSchema= new Schema({

    content:{
        type:String,
        required:true
    },
    complete:{
        type:String,
        required:true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    }

},{timestamps:true})

export const SubTodo=model('SubTodo',subTodoSchema);