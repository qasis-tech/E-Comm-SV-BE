const express = require("express");
const app = express();
const firebase=require('firebase')
const getToken=async ()=>{
const firebaseToken=await firebase.messaging.getToken()
console.log('token',firebaseToken)
}