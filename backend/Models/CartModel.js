const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
       user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      product_name: {
        type: String,
        required: true,
      },
      product_price: {
        type: Number,
        required: true,
      },
      product_quantity: {
        type: Number,
        required: true,
      },
      product_category: {
        type: String,
        required: true,
      },
      product_image: { type: String },
  
}
);

const CartSchema = mongoose.model("Cart", cartSchema);
module.exports = CartSchema;
