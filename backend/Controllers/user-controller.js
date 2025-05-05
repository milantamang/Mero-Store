const User = require("../Models/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const JWT_SECRET = process.env.JWT_SECRETE;

// -------------------registration process-----------
const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      username,
      email,
      password: hashPassword,
    });
    if (result) return res.status(200).json(result);
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
      return res.status(404).json({ error: "User not found in this email" });
    }
    const resetToken = jwt.sign(
      { id: existingUser._id.toString() },
      JWT_SECRET,
      {
        expiresIn: "4h",
      }
    );

    // Set up Node Mailer transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const resetUrl = `http://localhost:5173/resetpassword/${existingUser._id}/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      // text: ` http://localhost:5173/resetpassword/${existingUser._id}/${resetToken}`,
      html: `
        <h1>Password Reset Request</h1>
        <p>Hello ${existingUser.username},</p>
        <p>You have requested a password reset. Please click the following link to reset your password:</p>
        <a href="${resetUrl}" style="color: blue; text-decoration: underline;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Email could not be sent" });
      }
      console.log("Email sent: " + info.response);
      res
        .status(200)
        .json({ message: "Password reset link sent successfully" });
    });
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

    console.log("Received ID:", id);
    console.log("Received Token:", resetToken);

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
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });
    const resetUrl = `http://localhost:5173/verifyemail/${user._id}/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
          <h1 style="color: #4CAF50; text-align: center;">Verify Your Email</h1>
          <p style="font-size: 16px;">Hello <strong>${user.username}</strong>,</p>
          <p style="font-size: 16px;">Thank you for signing up! Please verify your email address to activate your account.</p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #fff; background-color: #4CAF50; text-decoration: none; border-radius: 5px;">Verify Email</a>
          </div>
          <p style="font-size: 14px; color: #555;">If you did not create this account, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        </div>
      `,
    };
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    }); // Replace with your email and password
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: "Email could not be sent" });
      }
      console.log("Email sent: " + info.response);
      res
        .status(200)
        .json({ message: "Email verification link sent successfully" });
    });
  } catch (error) {
    console.error("Error in email verification request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
      user.emailVerified = true;
      await user.save();
      res.status(200).json({ message: "Email verified successfully" });
    });
  } catch (error) {
    console.error("Error in email verification:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

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
};
