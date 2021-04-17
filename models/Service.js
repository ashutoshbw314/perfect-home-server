const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  uid: {
    type: String,
    required: true,
  }
});

const Service = mongoose.model("service", serviceSchema);

module.exports = Service; 


