const mongoose = require("mongoose");
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
 module.exports = mongoose.model("slider", sliderSchema);