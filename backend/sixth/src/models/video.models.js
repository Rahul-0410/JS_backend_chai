import mongoose, {Schema,model} from 'mongoose';
import mongooseAggregate from 'mongoose-aggregate-paginate-v2';

const videoSchema = new Schema({

    videoFile:{
        type: String, //cloudinary url
        required: true
    },
    thumbNail: {
         type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    views: {
        type: Number,
        default:0
    },
    isPublished:{
        type: Boolean,
        default: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }

},{timestamps:true})

videoSchema.plugin(mongooseAggregate);

export const Video=model('Video',videoSchema);