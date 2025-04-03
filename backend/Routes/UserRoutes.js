const express = require("express");
const router = express.Router();
const usercontroller = require("../Controllers/user-controller");
// const { verifyToken } = require("../middleware/verifyToken");

router.route("/register").post(usercontroller.userRegister);
router.route("/adminlogin").post(usercontroller.adminLogin);
router.route("/login").post(usercontroller.userLogin);
router.route("/logout").get(usercontroller.logout);
router.route("/profile").get(usercontroller.Profile);

router.route("/getAllUsers").get(usercontroller.getAllUser);
router.route("/deleteuser/:id").delete( usercontroller.deleteUser);
router.route("/forgotpassword").post(usercontroller.forgetpassword);
router
  .route("/resetpassword/:id/:resetToken")
  .post(usercontroller.resetPassword);

module.exports = router;
