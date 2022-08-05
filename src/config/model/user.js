const { date } = require("joi");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  mobileNumber: {
    type: String,
  },
  email: {
    type: String,
  },
  gender: {
    type: String,
  },
  dob: {
    type: Date,
  },
  pinCode: {
    type: Number,
  },
  profilePic: {
    default:null,
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  token: {
    type: String,
  },
});
module.exports = mongoose.model("users", userSchema);
