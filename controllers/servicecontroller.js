const Service=require("../models/service");
const Pesticide=require("../models/pesticide");
const Newsservice=require("../models/newsfeedstats");
const jwt=require("jsonwebtoken");
exports.postservice=(req,res,next)=>{
    const service=new Service({
        crop:req.body.crop,
        price:req.body.price,
        quantity:req.body.quantity,
        pesticide:req.body.pesticide,
        farmeremail:req.params.email
    })
    
        const newsservice=new Newsservice({
            date:new Date,
            crop:req.body.crop,
            price:req.body.price,
        })
    
    service.save()
    .then(result =>{
        console.log("servicecreated");
         //res.status(200).json(result)  
        newsservice.save()
        .then(result=>console.log("newsfeedservice created"))
        .catch(err=>{res.status(500).json({ error:err});})
        return res.redirect(`/users/farmer/${req.params.email}`)                   
                            
       })
       .catch(err=>{
           console.log(err);
           res.status(500).json({
               error:err
           });
       });
 
}

exports.postpesticideservice=(req,res,next)=>{
    const pesticide=new Pesticide({
        pesticide:req.body.pesticide,
        
        quantity:req.body.quantity,
       
        farmeremail:req.params.email
    })
    pesticide.save()
    .then(result =>{
        console.log("servicecreated");
         //res.status(200).json(result)                 
        return res.redirect(`/users/farmer/${req.params.email}`)                   
                            
       })
       .catch(err=>{
           console.log(err);
           res.status(500).json({
               error:err
           });
       });
 
}


exports.crop_available=(req,res,next)=>{
    console.log(req.params.api)
    console.log('ser');
    try {

        const exp = jwt.decode(req.params.api).exp;
        console.log("hiii")
        console.log(Date.now())
        console.log(exp)
        if ((Date.now() >= exp * 1000)) {
          console.log("expired")
          return res.send("token expired");
        }
      } catch (err) {
        return res.send("token expired");
      }
    Service.find({},{farmeremail:1,crop:1,_id:0,price:1,quantity:1})
         .then(docs=>{
            console.log(docs);
            res.status(200).json(docs)  
                     })
         .catch(err=>{
                console.log(err);
                 res.status(500).json({error:err})
                     })
}

exports.required_pesticides=(req,res,next)=>{
    console.log('ser');
    try {

        const exp = jwt.decode(req.params.api).exp;
        console.log("hiii")
        console.log(Date.now())
        console.log(exp)
        if ((Date.now() >= exp * 1000)) {
          console.log("expired")
          return res.send("token expired");
        }
      } catch (err) {
        return res.send("token expired");
      }
    Pesticide.find({},{_id:0})
         .then(docs=>{
            console.log(docs);
            res.status(200).json(docs)  
                     })
         .catch(err=>{
                console.log(err);
                 res.status(500).json({error:err})
                     })
}
exports.newsfeedservice=(req,res,next)=>{
    console.log('newsssss');
    try {

        const exp = jwt.decode(req.params.api).exp;
        console.log("hiii")
        console.log(Date.now())
        console.log(exp)
        if ((Date.now() >= exp * 1000)) {
          console.log("expired")
          return res.send("token expired");
        }
      } catch (err) {
        return res.send("token expired");
      }
    Newsservice.find({},{_id:0})
    .then(docs=>{
        console.log(docs);
        crop={} 
        crops={}
        for(var i=0;i<docs.length;i++)
        {
            if(docs[i]['crop'] in crop){
                crop[docs[i]['crop']].push([docs[i]['price'],docs[i]['date']])
            }
            else
            crop[docs[i]['crop']]=[[docs[i]['price'],docs[i]['date']],]
        }
        for(var c in crop){
            var sum=0
            for(var i=0;i<crop[c].length;i++)
            {
                
                sum=sum+crop[c][i][0]
            }
            crops[c]={}
            crops[c]['status']=crop[c][crop[c].length-1]
            crops[c]['average']=sum/crop[c].length
        }
        console.log(crops)
        res.status(200).json(crops)  
                 })
     .catch(err=>{
            console.log(err);
             res.status(500).json({error:err})
                 })

}