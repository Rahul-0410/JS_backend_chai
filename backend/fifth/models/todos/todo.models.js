const {model,Schema} = require('mongoose');

const todoSchema= new Schema({
     content:{
        type: String,
        required:true
    },
    complete:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    subTodos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'SubTodo'
        }
    ] // array of subtodos
},{timestamps:true})

export const Todo=model('Todo',todoSchema);