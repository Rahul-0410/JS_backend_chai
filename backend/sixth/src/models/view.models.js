import mongoose,{Schema,model} from "mongoose";

const viewSchema=new Schema({
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    viewdBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const View=model('View',viewSchema);