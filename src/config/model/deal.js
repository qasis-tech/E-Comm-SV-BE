import mongoose from "mongoose";
const dealSchema = mongoose.Schema({
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
   dealImage: {
    type: String,
    required: true,
  },
},
  {
    timestamps: true
  }
 );
 export default mongoose.model("deal", dealSchema);