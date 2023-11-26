const mongoose = require ("mongoose");
const orderSchema = new mongoose.Schema({
    products:[{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'product',
    }],
    payment:{},
    buyer:{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'userData',
    },
    status:{
        type : String,
        default : 'Not Processing',
        enum:['Not Processing', 'Processing', 'Shipped', 'Deliverd', 'Cancel']
    }
    
},{timestamps:  true})

const orderModel = mongoose.model('order',orderSchema);
module.exports = orderModel;