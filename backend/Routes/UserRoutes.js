const express = require("express");
const router = express.Router();
const usercontroller = require("../Controllers/user-controller");
const { verifyToken } = require("../middleware/verifyToken");

// Registration and authentication routes
router.route("/register").post(usercontroller.userRegister);
router.route("/login").post(usercontroller.userLogin);
router.route("/logout").get(usercontroller.logout);
router.route("/profile").put(verifyToken, usercontroller.Profile);

// OTP-based login routes
router.route("/request-login-otp").post(usercontroller.requestLoginOTP);
router.route("/verify-login-otp").post(usercontroller.verifyLoginOTP);

// Email verification routes
router.route("/sendverificationemail").post(usercontroller.emailVerificationRequest);
router.route("/verifyemail/:id/:verificationToken").post(usercontroller.verifyEmail);

// OTP-based email verification
router.route("/request-verification-otp").post(usercontroller.requestVerificationOTP);
router.route("/verify-email-otp").post(usercontroller.verifyEmailWithOTP);

// Password reset routes
router.route("/forgotpassword").post(usercontroller.forgetpassword);
router.route("/resetpassword/:id/:resetToken").post(usercontroller.resetPassword);

// Admin user management routes
router.route("/getAllUsers").get(usercontroller.getAllUser);
router.route("/deleteuser/:id").delete(usercontroller.deleteUser);

//it includes all my controller functions
module.exports = router;