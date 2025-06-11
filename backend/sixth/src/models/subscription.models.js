import {model,Schema} from 'mongoose';

const subscriptionSchema=new Schema({

    subscriber:{
        type:Schema.Types.ObjectId, // the one who is subscribing
        ref:'User'
    },
    channel:{
         type:Schema.Types.ObjectId, // the one who's channel(also a user) is being subscribed
        ref:'User'
    }

},{timestamps:true})

export const Subscription=new model('Subscription',subscriptionSchema);