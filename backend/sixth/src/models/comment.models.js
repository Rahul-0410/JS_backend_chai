import mongoose, {Schema,model} from 'mongoose';
import mongooseAggregate from 'mongoose-aggregate-paginate-v2';

const commentSchema=new Schema({
    content:{
        type:String,
        required:true
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:'Video'
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }

},{timestamps:true})

commentSchema.plugin(mongooseAggregate)

export const Comment=model('Comment',commentSchema);