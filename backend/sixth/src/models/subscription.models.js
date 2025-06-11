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
//why are we not taking array of objects i.e. users
/*
beacuse let's say we have a million users so then an array of that many users will be created, so coomplexity for searching and deletion both very high
so what will happen now is that for each time a user subscribes a channel a new document is created each time
// users-a,b,c channel-> cc,bcc
if c subscribes to both cc and bcc , there will be two documents with :
{ subs:c, channel:cc} , same for others
 so when counting the number of subs for a channel we will count the name of the channel in all these documents fo sub count
 same when seeing which channel user has subscribed we will look for username in documents and from there take the channel name
*/