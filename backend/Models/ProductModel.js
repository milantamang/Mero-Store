const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  colors: {
    type: String,
    required: [true, "Please enter at least one product color"],
    trim: true,
  },
  size: {
    type: [String],
    enum: ["S", "M", "L", "XL", "XXL"],
    required: true,
  },

  category: {
    type: String,
    required: [true, "Please enter category"],
  },

  inStock: { type: Boolean, default: true },

  image: String,

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
