const express=require("express");
//const exprs_hb=require('express-handlebars');
const app=express();
const morgan=require("morgan");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const availrequestdeatails = require('./models/availreq');
const userroutes=require('./routes/signup');
const alarmroutes=require('./routes/alarmroutes');
const serviceroutes=require('./routes/serviceroutes');


// mongoose.connect('mongodb+srv://DeviNeeharika:'+
// process.env.MONGO_ATLAS_PW +
// '@cluster0-6usfw.mongodb.net/test?retryWrites=true&w=majority',{
//     useNewUrlParser: true,
//     useUnifiedTopology: true  
// })
const dotenv = require("dotenv");
dotenv.config()
const uri = `${process.env.DB_key}`;
mongoose.connect(uri).then(
  _ => {
    console.info('Database connection stablished');
  },
  error => {
    console.error('Database connection failed:', error);
    throw new Error('Could not connect to the database');
  }
);

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(express.static(__dirname+'/views'));
app.use(express.static(__dirname+'/public'));
//app.engine('handlebars', exprs_hb({defaultlayout:'layout'}));
//app.set('view engine','handlebars');
//app.set('view engine','ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('view engine','html');
app.use("/users",userroutes)
app.use("/alarms",alarmroutes)

app.use("/services",serviceroutes)
var spawn = require("child_process").spawn;
var map = spawn('python',["./tyr.py"]);

// app.use((req,res,next) =>{
//     const error=new Error(
//         'NOT FOUND'
//     );
//     error.status=404;
//     next(error);
// })
// app.use((req,res,next)=>{
//     res.status(errorstatus || 500);
//     res.json({
//         error:{
//             message:error.message
//         }
//     })
// })

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Backend is running on port ${port}`);
})