import mongoose from "mongoose";
const categorySchema = mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  subCategory: {
    type: Array,
    required: true,
  }
},
  {
    timestamps: true
  }

 );

export default mongoose.model("category", categorySchema);