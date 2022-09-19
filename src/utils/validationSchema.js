const Joi = require("joi");
exports.signin = Joi.object().keys({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
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
  dob: Joi.date().required(),
  pinCode: Joi.string().required(),
  password: Joi.string().min(8).required(),
});
exports.userEditsignup = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  mobileNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .required(),
  email: Joi.string().email().lowercase().required(),
  gender: Joi.string().required(),
  dob: Joi.date().required(),
  pinCode: Joi.string().required(),
});
exports.googleAuth = Joi.object().keys({
  email: Joi.string().email().lowercase().required(),
  name: Joi.string().required(),
  photoUrl: Joi.string().required(),
});
exports.orderValid = Joi.object().keys({
  productId: Joi.array().required(),
  userId: Joi.string().required(),
});
exports.stockValid = Joi.object().keys({
  product: Joi.string().required(),
  category: Joi.string().required(),
  subCategory: Joi.string().required(),
  quantity: Joi.number().required(),
  unit: Joi.string().required(),
});
exports.orderEditValid = Joi.object().keys({
  status: Joi.string().required(),
});
