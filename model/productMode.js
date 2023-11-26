const mongoose = require ("mongoose");
const prodcutSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    slug : {
        type : String,
        // required : true,
    },
    description : {
        type : String,
        required : true,
    },
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'category',
        required : true,
    },
    quantity : {
        type : Number,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },

    photo : {
        data : Buffer,
        contentType : String,
        // required : true,
    },

    // image : {
    //     // data : Buffer,
    //     // contentType : String,
    //     type : String,
    // },
    
    shipping : {
        type : Boolean,
    }
    
},{timestamps: true})

const productModel = mongoose.model('product',prodcutSchema);
module.exports = productModel;