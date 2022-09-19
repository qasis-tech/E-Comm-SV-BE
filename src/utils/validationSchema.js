import Joi from "joi"
const signin = Joi.object().keys({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
});
const usersignup = Joi.object().keys({
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
const userEditsignup = Joi.object().keys({
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
const googleAuth = Joi.object().keys({
  email: Joi.string().email().lowercase().required(),
  name: Joi.string().required(),
  photoUrl: Joi.string().required(),
});
const orderValid = Joi.object().keys({
  productId: Joi.array().required(),
  userId: Joi.string().required(),
});
const stockValid = Joi.object().keys({
  product: Joi.string().required(),
  category: Joi.string().required(),
  subCategory: Joi.string().required(),
  quantity: Joi.number().required(),
  unit: Joi.string().required(),
});
const orderEditValid = Joi.object().keys({
  status: Joi.string().required(),
});
const otpValid = Joi.object().keys({
  otp: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
});
const resetValid = Joi.object().keys({ 
  email: Joi.string().email().lowercase().required(),
});
const resetOtpValid = Joi.object().keys({ 
  email: Joi.string().email().lowercase().required(),
  otp: Joi.string().required(), 
});
export default { signin, usersignup,userEditsignup,googleAuth,
  orderValid,stockValid,orderEditValid,otpValid,resetValid,resetOtpValid }