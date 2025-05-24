const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        image: {
          type: String,
        },
        size: {
          type: String,
          required: true,
        },
        selectedColor: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

cartSchema.path("cartItems").schema.add({ _id: false });

const CartSchema = mongoose.model("Cart", cartSchema);
module.exports = CartSchema;
