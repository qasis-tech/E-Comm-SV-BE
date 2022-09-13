const mongoose = require("mongoose");
const dealSchema = mongoose.Schema({
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
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
 module.exports = mongoose.model("deal", dealSchema);