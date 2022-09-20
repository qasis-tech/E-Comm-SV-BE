import mongoose from "mongoose";
const dealSchema = mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
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