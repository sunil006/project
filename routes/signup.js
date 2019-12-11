const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const User=require("../models/user");
const Users = mongoose.model('user');
const Verificationtoken=require("../models/tokenverification");
const jwt=require("jsonwebtoken");
const usercontroller=require("../controllers/user");
const availrequestdetails = mongoose.model('availrequestdetails');
const services=require("../models/service");
const Service = mongoose.model('service');
var nodemailer = require('nodemailer');


router.get('/map',usercontroller.user_map);

router.post('/signup',usercontroller.user_signup);
router.post('/api_service',usercontroller.api_service);
router.post('/api_login',usercontroller.api_user_login)
router.post('/login',usercontroller.user_login);

router.get("/viewposts",usercontroller.user_view);

//router.post("/service/:email",usercontroller.user_service);

router.get('/confirmation/:token', usercontroller.confirmationPost);
router.get('/api_confirmation/:token', usercontroller.api_confirmationPost);
//router.post('/resend', usercontroller.resendTokenPost);
router.get('/signup',(request,response)=>{
    response.render('../views/signup');
})
router.get('/api_service',(request,response)=>{
    response.render('../views/api_service');
})
router.get('/api_login',(request,response)=>{
    response.render('api_login',{layout:false});
})
router.get('/login',(request,response)=>{
    response.render('../views/login');
})
router.get('/home',(request,response)=>{
    response.render('../views/index');
})
router.get('/farmer/:email',(request,response)=>{
    response.render('../views/farmer',{email:request.params.email});
})
router.get('/agro/:email',(request,response)=>{
    response.render('../views/agri_expert',{email:request.params.email});
})
router.get('/customer/:email',(request,response)=>{
    response.render('../views/customer',{email:request.params.email});
})


router.get('/list/:email',function(req,res){
    console.log(req.params.email)
    Users.find({email : req.params.email},(err,citydoc)=>{         
            var currlogin = citydoc[0]
            Users.find({type : 'agricultureexpert', city : currlogin['city']},(err,docs)=>{
                for(var i=0;i<=Object.keys(docs).length-1;i++){

                    var doc=docs[i]                       
                    var availreq = new availrequestdetails();
                    availreq.farmerid=currlogin['_id'];
                    availreq.agroexpertid=doc['_id'];
                    availreq.requested = false;
                    availreq.save((err,docks)=>{
                        if(err){
                            return res.send()
                            
                        }
                             
                    });

                    }
                    return res.render('farmerreq',{
                        list: docs,
                        layout:false
                    })
                
            }) 
                

    })

});
router.get('/list/sentreq/:id',function(req,res){
    console.log(req.params._id)
    console.log('req sent')
            
            

            var availreqts=availrequestdetails();
                availrequestdetails.findOneAndUpdate({agroexpertid:req.params.id},{requested:true},(err,docs)=>{
                    
                    
                    if(err){
                        console.log('err'+err)
                    }
                    else{
                            
                        Users.findById({_id:req.params.id},(err,doc)=>{
                            
                            var user_detail=doc
                            link =`http://localhost:5000/users/list/agriexp/${req.params.id}`
                            console.log(user_detail)
                            var transporter = nodemailer.createTransport({ service: "gmail", auth: { user: 'neeharika149@gmail.com', pass: 'neeha@149' } });
                            var mailOptions = { from: 'neeharika149@gmail.com', to: user_detail.email, subject: 'Request confirmation', 
                            html : `Hello,<br>Request sent by<br> ${link}.`,}

                            transporter.sendMail(mailOptions, function (err) {
                                if (err) {
                                    console.log("b");
                                    return res.status(500).send({ msg: err.message }); 
                                }
                                res.status(200).send('Request email has been sent to ' + user_detail.email + '.');
                            });
                        })
                    }

                })

    return res.render('test',{
        layout:false
    });
})

    


var array=[];
router.get('/agro/req/:id',function(req,res){
    console.log('asdfgh')
    availrequestdetails.find({agroexpertid:req.params.id,requested:true},(err,docs)=>{
        console.log('rtyui')
        for(var i=0;i<=Object.keys(docs).length-1;i++){
            console.log(docs[i])
            var req_detail=docs[i]
            var farmer_id=req_detail['farmerid']
            console.log(farmer_id)
            Users.findById({_id:farmer_id},(err,doc)=>{
                console.log('doc:',doc)
                array.push(doc)
                res.render('agroreq',{
                    list:doc,
                    layout:false
                })
                //console.log(array)
            })
            console.log('array',array)
            

        }
        // var req_detail=docs
        // console.log(req_detail)
        // Users.findById

    })

})


router.get('/agro/req/accept/:email',function(req,res){
    Users.find({email:req.params.email},(err,docs)=>{
        var details=docs[0]
        link =`http://localhost:5000/users/farmer/req/conv/${details['email']}`
        //console.log(user_detail)
        var transporter = nodemailer.createTransport({ service: "gmail", auth: { user: 'neeharika149@gmail.com', pass: 'neeha@149' } });
        var mailOptions = { from: 'neeharika149@gmail.com', to: req.params.email, subject: 'Request confirmation', 
        html : `Hello,<br>Request has confirmed<br> ${link}.`,}

        transporter.sendMail(mailOptions, function (err) {
            if (err) {
                console.log("b");
                return res.status(500).send({ msg: err.message }); 
            }
            res.status(200).send('Confirmation request email has been sent to ' + req.params.email + '.');
        });
    })
    return res.render('test',{
        layout:false
    })
})

router.get('/farmer/req/conv/:email',function(req,res){
    res.json('accepted')
})

router.get('/customer/services/buy/:email',function(req,res){
    res.render('buystuff',{
        layout:false
    })
})

// router.get('/customer/services/buy/product/:email',function(req,res){
//     services.find({farmeremail:req.params.email},(err,docs)=>{

//     })


// })

router.get('/customer/services/:email',function(req,res){
    Service.find(function(err,docs){
        console.log(docs)
        if(!err){
            return res.render('services',{
                // //console.log(docs),
                ser:docs,
                layout:false
            })
            
        }
    })
})


module.exports=router;
