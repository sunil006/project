const mongoose=require("mongoose");
const pesticideschema=mongoose.Schema({
    pesticide:{
        type:String,
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
module.exports=mongoose.model('pesticide',pesticideschema);