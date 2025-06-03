const {model,Schema, default: mongoose} = require('mongoose');

const orderItemSchema= new Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    quantity:{
        type: Number,
        required:true
    }
})

const orderSchema= new Schema({

    orderPrice:{
        type:Number,
        required:true
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    orderItems:{
        type: [orderItemSchema],
        required:true
    },
    address:{
        type:String,
        required:true
    },
    status: {
        type:String,
        enum: ["Pending", "Cancelled","Delivered"],
        default: "Pending"
    }

},{timestamps:true})

export const Order=model('Oder',orderSchema);