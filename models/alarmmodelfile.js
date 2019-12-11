const mongoose=require('mongoose');
const alarmschema=mongoose.Schema(
    {
        _userid:String,
        _id:mongoose.Schema.Types.ObjectId,
        date:String,
        time:String,
        reason:String
    }
);
module.exports=mongoose.model('alarmmodel',alarmschema)