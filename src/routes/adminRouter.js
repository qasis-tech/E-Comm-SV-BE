var express = require('express');
const router = express.Router();
const loginController=require('../api/loginController')

router.get('/', function (req, res, next) {
res.send('welcome to adminPanel')
});
router.post("/login", loginController.login);
    
module.exports=router