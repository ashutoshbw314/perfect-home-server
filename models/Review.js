const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 0 
  },
});

const Review = mongoose.model("review", reviewSchema);

module.exports = Review; 
