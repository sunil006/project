const mongoose=require("mongoose");
const Alarm=require('../models/alarmmodelfile');
const express=require('express');
const router=express();
const sess=require('./user.js');


exports.alarms_post=  (req, res,next) => {
    console.log('po')
    const alarminstance=new Alarm({
        _userid:req.params.email,
        _id:new mongoose.Types.ObjectId(),
        date:req.body.date,
        time:req.body.time,
        reason:req.body.reason
    });
     
    alarminstance.save()
    .then(result=>{
        console.log(result);
        console.log(sess);
        res.redirect(`http://localhost:5000/alarms/${req.params.email}`);

    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
                });
    
}


exports.alarms_user=(req, res,next) => {
    console.log('gggg');
    Alarm.find({'_userid':req.params.email})
         .exec()
         .then(docs=>{
            console.log(docs);
        context={"context":docs,
                    "email":req.params.email}
           
            res.render('../views/alarms.ejs', { context: context })
                     })
         .catch(err=>{
                console.log(err);
                 res.status(500).json({error:err})
                     })
}



exports.alarms_delete=(req, res,next) => {
    console.log('d')
    const id=req.params.alarmid;
    const existalarmid=req.params
    Alarm.findById(existalarmid.alarmid)
            .exec()
            .then(doc=>{
            //console.log("from database",doc);
            if(doc){
                //res.status(200).json(doc);
                console.log('asdfgh')
                console.log(doc)
                var email=doc['_userid']
                Alarm.remove({_id:id})
                .exec()
            
                .then(result=>{
                    console.log('after deleting');           
                      
                                })
            
                .catch(err=>{
                    console.log(err);
                    res.statusCode(500).json({ error:err })
                            })
                res.redirect(`http://localhost:5000/alarms/${email}`);  
            }
            else{
                res.status(404).json({
                message:"no valid entry"
                })
            }
        })
        //console.log(result);
            //res.status(200).json(result)
           



   
}



exports.alarms_id= (req, res,next) => {
    console.log('ga')
    const id=req.params.alarmid;
    Alarm.findById(id)
    .exec()
    .then(doc=>{
        console.log("from database",doc);
        if(doc){
            res.status(200).json(doc);

        }
        else{
            res.status(404).json({
                message:"no valid entry"
            })
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
   
};


exports.alarms_update=(req, res,next) => {
    console.log('pa')
    
    const id=req.params.alarmid;
    console.log(req.body);
    const existalarmid=req.params
    Alarm.update({_id:id},{$set:req.body})
    .exec()
    .then(result=>{
        Alarm.findById(existalarmid.alarmid)
        .exec()
        .then(doc=>{
        //console.log("from database",doc);
        if(doc){
            //res.status(200).json(doc);
            console.log('asdfgh')
            console.log(doc)
            res.redirect(`http://localhost:5000/alarms/${doc['_userid']}`);  
        }
        else{
            res.status(404).json({
            message:"no valid entry"
            })
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
        //console.log(result);
        //res.status(200).json(result)
       
    })
    .catch(err=>{
        console.log(errr);
        res.status(500).json(
            {
                error:err
            }
        )
    })
}


exports.alarms_update_ejs=(req, res,next) => {
    const existalarmid=req.params
    console.log(existalarmid)
    Alarm.findById(existalarmid.alarmid)
    .exec()
    .then(doc=>{
        console.log("from database",doc);
        if(doc){
            //res.status(200).json(doc);
            
            res.render('../views/alarmupdate.ejs', {context:doc})
        }
        else{
            res.status(404).json({
            message:"no valid entry"
            })
        }
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
}


exports.alarms_newalarm=(req, res) => {
    console.log('newww')
    context={'email':req.params.email}
    res.render('../views/alarm.ejs',context);
  
}

