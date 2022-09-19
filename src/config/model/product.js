import mongoose from "mongoose";
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,  
  },
  unit: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  features: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  offerUnit: {
    type: String,
    required: true,
  },
  offerQuantity: {
    type: Number,
    required: true,
  },
  offerPrice: {
    type: Number,
    required: true,
  },
  productImage: {
    type: Array,
    required: true,
  },
  productVideo: {
    type: Array,
    required: true,
  },
},
  {
    timestamps: true
  }
 );
export default mongoose.model("product", productSchema);