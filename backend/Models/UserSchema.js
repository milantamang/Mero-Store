const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    },
  ],
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});



const userSchema = mongoose.model("User", usersSchema);
module.exports = userSchema;
