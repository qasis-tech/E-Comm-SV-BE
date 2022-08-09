const Joi = require("joi");
exports.signin = Joi.object().keys({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
});
exports.usersignup = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    mobileNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
    email: Joi.string().email().lowercase().required(),
    gender: Joi.string().required(),
    dob: Joi.string().required(),
    pinCode: Joi.string().required(),   
    password: Joi.string().required(),
});
exports.googleAuth = Joi.object().keys({
    email: Joi.string().email().lowercase().required(),
    name: Joi.string().required(),
    photoUrl: Joi.string().required(),
});

