const express = require("express");
const app = express();
const fetch=require('node-fetch')
const router=express.Router()

router.post('/pushmsg',(req,res)=>{
    const notification={
        'title':'hi',
        'text':'welcome'
    }
    const fcm_token=[]
    const notification_body={
        'notification':notification,
        'registration_ids':fcm_token
    }
    fetch('https://fcm.googleapis.com/fcm/send',{
        'method':'POST',
        'headers':{
            'Authorization':'key='+'BDYS3LaOxt3k0OVNkzdLBE6RE0KeMqfVsZmWQq3KMfOrJMEERoLN-i5zk-ax7cYHQehU1IK15EwF66Q89JaLeJ0',
            'Content-Type':'application/json'
        },
        'body':JSON.stringify(notification_body)
    }).then(()=>{
res.send(200).send('successfully send..')
    }).catch((err)=>{
        res.send(400).send('wrong.')
        console.log(err)
    })

})
module.exports=router