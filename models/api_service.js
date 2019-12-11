const mongoose=require('mongoose')
const apischema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
   
       email:{
        type:String,
        required:true,
        unique:true,
        match:/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/

    },
    api_token:{
        type:String,
        default:null,
    },
    password:{
      type:String,
      required:true

  },
    verificationtoken: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now},
    isVerified:{type:Boolean,default:false}
  });
    module.exports=mongoose.model('api_service',apischema);
