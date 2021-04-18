const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  payment_id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  service_id: {
    type: String,
    required: true,
  },
  serviceAmount: {
    type: Number,
    required: true,
  },
  serviceTitle: {
    type: String,
    required: true,
  },
  serviceDescription: {
    type: String,
    required: true,
  },
  serviceImageURL: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order; 
