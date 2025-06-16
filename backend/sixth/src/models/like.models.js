import mongoose, {Schema,model} from 'mongoose';

const likeSchema=new Schema({

    video:{
        type:Schema.Types.ObjectId,
        ref:'Video'
    },
    comment:{
        type:Schema.Types.ObjectId,
        ref:'Comment'
    },
    tweet:{
         type:Schema.Types.ObjectId,
        ref:'Tweet'
    },
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }

},{timestamps:true})

likeSchema.pre("save", function (next) {
  const count =
    (this.video ? 1 : 0) +
    (this.comment ? 1 : 0) +
    (this.tweet ? 1 : 0);

  if (count !== 1) {
    return next(new Error("Exactly one of video, comment, or tweet must be set."));
  }
  next();
});


export const Like=model('Like',likeSchema);