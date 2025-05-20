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
  emailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    default:""
  },
  phoneNumber: {
    type: Number,
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
