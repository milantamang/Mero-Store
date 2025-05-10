const User = require("../Models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const emailService = require("../utils/emailService");
const otpUtil = require("../utils/otpUtil");
const OTP = require("../Models/OtpModel");

const JWT_SECRET = process.env.JWT_SECRETE;

// -------------------registration process-----------
const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const oldUser = await User.findOne({ email });

module.exports = {
  userRegister,
  userLogin,
  logout,
  deleteUser,
  getAllUser,
  forgetpassword,
  resetPassword,
  Profile,
  emailVerificationRequest,
  verifyEmail,
  requestLoginOTP,
  verifyLoginOTP,
  requestVerificationOTP,
  verifyEmailWithOTP
};
    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      username,
      email,
      password: hashPassword,
    });
    
    if (result) {
      // Generate verification token
      const verificationToken = jwt.sign(
        { id: result._id.toString() },
        JWT_SECRET,
        { expiresIn: "24h" }
      );
      
      // Send verification email
      await emailService.sendRegistrationEmail(result, verificationToken);
      
      return res.status(200).json({
        ...result._doc,
        message: "Registration successful. Please check your email to verify your account."
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------login processs-------------
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const user_token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "3d",
    });

    return res.status(200).json({
      _id: user.id,
      name: user.username,
      email: user.email,
      image: user.image,
      cartItems: user.cartItems.map((item) => ({ pid: item.product })),
      user_token: user_token,
      user_role: user.role,
      email_verified: user.emailVerified
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// -------------------login with OTP process-------------
const requestLoginOTP = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Generate and store OTP
    const otp = await otpUtil.createOTP(user._id, email, "login");
    
    // Send OTP via email
    await emailService.sendOtpEmail(user, otp);
    
    res.status(200).json({ 
      message: "OTP sent to your email",
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// -------------------verify login OTP-------------
const verifyLoginOTP = asyncHandler(async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    // Verify OTP
    const isValid = await otpUtil.verifyOTP(userId, otp, "login");
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    
    // Get user details
    const user = await User.findById(userId);
    
    // Generate token
    const user_token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "3d" }
    );
    
    // Return user details and token
    return res.status(200).json({
      _id: user.id,
      name: user.username,
      email: user.email,
      image: user.image,
      cartItems: user.cartItems.map((item) => ({ pid: item.product })),
      user_token: user_token,
      user_role: user.role,
      email_verified: user.emailVerified
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const Profile = async (req, res) => {
  try {
    console.log("Update Profile route hit");

    // Extract token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Find the user by ID
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the user's profile with the data from the request body
    const { name, email } = req.body;
    if (name) user.username = name; // Update username
    if (email) user.email = email; // Update email

    // Save the updated user to the database
    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// -------------------forgetpassword processs-------------
const forgetpassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found with this email" });
    }
    
    // Generate reset token
    const resetToken = jwt.sign(
      { id: existingUser._id.toString() },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send password reset email
    await emailService.sendPasswordResetEmail(existingUser, resetToken);
    
    res.status(200).json({ message: "Password reset link sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// -------------------resetPassword processs-------------
const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { id, resetToken } = req.params;
    const { password } = req.body;

    jwt.verify(resetToken, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password reset successfully" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//--------------------logout user-------------
const logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout successfully",
  });
};

// get all users
const getAllUser = async (req, res) => {
  try {
    const user = await User.find();
    if (!user) return res.status(400).json({ message: "User not found" });

    return res.status(200).json({ message: "Users successfully", user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Email verification request
const emailVerificationRequest = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Email for verification:", email);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
    
    // Generate verification token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    
    // Send verification email
    await emailService.sendRegistrationEmail(user, token);
    
    res.status(200).json({ message: "Email verification link sent successfully" });
  } catch (error) {
    console.error("Error in email verification request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { id, verificationToken } = req.params;
    
    jwt.verify(verificationToken, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      if (user.emailVerified) {
        return res.status(200).json({ message: "Email already verified" });
      }
      
      user.emailVerified = true;
      await user.save();
      
      // Send welcome email after successful verification
      await emailService.sendWelcomeEmail(user);
      
      res.status(200).json({ message: "Email verified successfully" });
    });
  } catch (error) {
    console.error("Error in email verification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Request OTP for email verification
const requestVerificationOTP = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.emailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
    
    // Generate and store OTP
    const otp = await otpUtil.createOTP(user._id, email, "verification");
    
    // Send OTP via email
    await emailService.sendOtpEmail(user, otp);
    
    res.status(200).json({ 
      message: "OTP sent to your email",
      userId: user._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Verify email with OTP
const verifyEmailWithOTP = asyncHandler(async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    // Verify OTP
    const isValid = await otpUtil.verifyOTP(userId, otp, "verification");
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    
    // Update user verification status
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    user.emailVerified = true;
    await user.save();
    
    // Send welcome email
    await emailService.sendWelcomeEmail(user);
    
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = {
  userRegister,
  userLogin,
  logout,
  deleteUser,
  getAllUser,
  forgetpassword,
  resetPassword,
  Profile,
  emailVerificationRequest,
  verifyEmail,
  requestLoginOTP,
  verifyLoginOTP,
  requestVerificationOTP,
  verifyEmailWithOTP
};
// This is just the section that needs to be fixed
// Add this to your existing user-controller.js

// Email verification route handler
const verifyEmail = async (req, res) => {
  try {
    const { userId, token } = req.params;
    
    // Verify the token
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
      
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      // Update user's email verification status
      user.emailVerified = true;
      await user.save();
      
      res.status(200).json({ message: "Email verified successfully" });
    });
  } catch (error) {
    console.error("Error in email verification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Add this to your module.exports
module.exports = {
  // ... existing exports
  verifyEmail,
  // Remember to include all your existing exports here
};