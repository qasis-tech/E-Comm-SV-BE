import mongoose from "mongoose";
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
    type: String,
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
  accountOtp: {
    type: String,
  },
},
{
  timestamps: true,
}
);
export default mongoose.model("users", userSchema);
