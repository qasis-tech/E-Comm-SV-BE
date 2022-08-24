const { string } = require("joi");
const mongoose = require("mongoose");
const orderSchema = mongoose.Schema({
  product: {
    type: Array,
    required: true,
  },
    user: {
    type: Object,
    required: true,
  },
 status: {
    type: String,
    required: true,
  },
  orderId: {
    type: String,
    required: true,
  },
},
  {
    timestamps: true,
  }

 );
 module.exports = mongoose.model("order", orderSchema);