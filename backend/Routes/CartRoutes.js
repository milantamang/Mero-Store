const express = require("express");
const router = express.Router();
const cartcontroller = require("../Controllers/CartController");
const { verifyToken } = require("../middleware/verifyToken");


router.route("/createcart").post(verifyToken, cartcontroller.createCart);
router.route("/getcart").get(verifyToken, cartcontroller.getUserCart);
router.route("/id/:pid").put(verifyToken, cartcontroller.deleteCart);

module.exports = router;