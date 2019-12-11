const mongoose=require('mongoose')
const availrequestschema=mongoose.Schema({
    farmerid:{
        type:mongoose.Schema.Types.ObjectId,

        ref:'User'

    },
    agroexpertid:{
        type:mongoose.Schema.Types.ObjectId,

        ref:'User'

    },
    requested:{
        type:Boolean,
        default:false
    }
})
module.exports=mongoose.model('availrequestdetails',availrequestschema);