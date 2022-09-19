import mongoose from "mongoose";
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
 export default mongoose.model("order", orderSchema);