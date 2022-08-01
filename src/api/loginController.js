const Joi = require("joi");
const bcrypt = require("bcrypt");
const User=require('../config/model/user')
const {
    comparePassword
} = require("../utils/utilService");
module.exports = {
    login: async function (req, res) {  
        try {
            const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
          });
      
           const {
            email,
            password
          } = await schema.validateAsync(req.body);


          // const user = await User.findOne({
          //   email,
          // });
    
          // if (!user) {
          //   return res.status(404).send({
          //     data: [],
          //     message: "No user found..!",
          //     success: false,
          //   });
          // }    
          // let passwdMatch = await comparePassword(password, user.password);    
          // if (!passwdMatch) {
          //   return  res.status(404).send({
          //     data: [],
          //     message: "Password didn't matched..!",
          //     success: false,
          //   });            
          // }
    
          // const token = await JWTService.issuer({ user: user.id }, "10 day");
          //    return  res.status(200).send({
          //   data: [token],
          //   message: "Success..!",
          //   success: true,
          // });  
        } catch (err) {
          return  res.status(404).send({
            data: [],
            message: "Failed to login..!",
            success: false,
          });           
        }
      },
}
