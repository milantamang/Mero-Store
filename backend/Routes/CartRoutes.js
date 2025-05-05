const express = require("express");
const router = express.Router();
const cartcontroller = require("../Controllers/CartController");
const { verifyToken } = require("../middleware/verifyToken");


router.route("/addtoCart").post(verifyToken, cartcontroller.addToCart);
router.route("/getcart").get(verifyToken, cartcontroller.getUserCart);
router.route("/deletecartitem/:pid").put(verifyToken, cartcontroller.deleteCartItem);
router.route("/deletecart").delete(verifyToken, cartcontroller.deleteCart);
router.route("/decreaseQuantity/:pid").put(verifyToken, cartcontroller.decreaseQuantity);
module.exports = router;