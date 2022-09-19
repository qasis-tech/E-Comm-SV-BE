const mongoose = require("mongoose");
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

 module.exports = mongoose.model("category", categorySchema);