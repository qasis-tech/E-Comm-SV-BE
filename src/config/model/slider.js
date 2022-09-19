import mongoose from "mongoose";
const sliderSchema = mongoose.Schema({
  sliderImage: {
    type: Array,
    required: true,
  } 
},
  {
    timestamps: true
  }
 );
export default mongoose.model("slider", sliderSchema);