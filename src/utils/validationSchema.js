const Joi = require("joi");
const { check, validationResult } = require('express-validator');
exports.signin = Joi.object().keys({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
});
exports.usersignup = Joi.object().keys({
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    gender: Joi.string().required(),
    age: Joi.number().required(),
    address: Joi.string().required(),
    qualification: Joi.string().required(),
    designation: Joi.string().required(),
    mobilenumber: Joi.string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
});



