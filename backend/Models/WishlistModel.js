const mongoose = require("mongoose");
const wishlist = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    product_name: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_category: {
      type: String,
      required: true,
    },
    product_image: { type: String },
  },
  { timestamps: true }
);

const WishlistSchema = mongoose.model("Wishlist", wishlist);
module.exports = WishlistSchema;
