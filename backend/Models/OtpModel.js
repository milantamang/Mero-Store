const mongoose = require("mongoose");

/**
 * OTP Schema
 * Stores OTP codes for various authentication/verification purposes
 */
const otpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    enum: ["verification", "password-reset", "login", "account-recovery"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // OTP expires after 10 minutes (600 seconds)
  },
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;