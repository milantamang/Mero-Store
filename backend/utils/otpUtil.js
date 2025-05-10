const OTP = require('../Models/OtpModel');
const bcrypt = require('bcrypt');

/**
 * Generate a random OTP code
 * @param {number} length - Length of the OTP (default: 6)
 * @returns {string} - Generated OTP
 */
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  
  return otp;
};

/**
 * Create and store an OTP for a user
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} purpose - Purpose of OTP (verification, password-reset, etc.)
 * @returns {Promise} - Resolves with OTP string
 */
const createOTP = async (userId, email, purpose) => {
  try {
    // First, delete any existing OTPs for this user and purpose
    await OTP.deleteMany({ user: userId, purpose });
    
    // Generate a new OTP
    const otpValue = generateOTP();
    
    // Create a new OTP record
    const otp = new OTP({
      user: userId,
      email,
      otp: otpValue,
      purpose,
    });
    
    await otp.save();
    return otpValue;
  } catch (error) {
    console.error('Error creating OTP:', error);
    throw new Error('Failed to create OTP');
  }
};

/**
 * Verify an OTP
 * @param {string} userId - User ID
 * @param {string} otpValue - OTP to verify
 * @param {string} purpose - Purpose of OTP
 * @returns {Promise<boolean>} - Resolves with true if OTP is valid
 */
const verifyOTP = async (userId, otpValue, purpose) => {
  try {
    const otpRecord = await OTP.findOne({
      user: userId,
      otp: otpValue,
      purpose,
    });
    
    if (!otpRecord) {
      return false;
    }
    
    // Delete the OTP after verification
    await OTP.deleteOne({ _id: otpRecord._id });
    
    return true;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Failed to verify OTP');
  }
};

module.exports = {
  generateOTP,
  createOTP,
  verifyOTP,
};