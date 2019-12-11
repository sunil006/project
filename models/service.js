const mongoose=require('mongoose')
const Farmer=require("../models/farmer");
const serviceschema=mongoose.Schema({
    crop:{
        type:String,
        required:true,


    },
    price:{
        type:Number,
        required:true,


    },
    quantity:{
        type:Number,
        required:true,


    },
    
    farmeremail:{
        // type:mongoose.Schema.Types.ObjectId,

        // ref:'User'
        type:String,
    

    },
   
});
module.exports=mongoose.model('service',serviceschema);