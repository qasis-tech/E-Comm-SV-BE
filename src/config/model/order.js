const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  productId: {
    type: Array,
    required: true,
  },
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
    required: true,
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
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  pinCode: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  }
},
  {
    timestamps: true
  }

 );

 module.exports = mongoose.model("order", orderSchema);