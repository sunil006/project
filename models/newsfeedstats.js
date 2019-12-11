const mongoose=require('mongoose')
const newsfeedserviceschema=mongoose.Schema({
    crop:{
        type:String,
        required:true,


    },
    price:{
        type:Number,
        required:true,


    },
    date:{
        type:String
    }
   
});
module.exports=mongoose.model('newsfeedservice',newsfeedserviceschema);