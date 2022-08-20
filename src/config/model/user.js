const { date } = require("joi");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
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
    type: String,
  },
  pinCode: {
    type: Number,
  },
  location: {
    default:null,
    type: String,
  },
  primaryAddress: {
    default:null,
    type: String,
  },
  otherAddress: {
    default:null,
    type: String,
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
  status: {
    type: String,
  },
},
{
  timestamps: true,
}
);
module.exports = mongoose.model("users", userSchema);
