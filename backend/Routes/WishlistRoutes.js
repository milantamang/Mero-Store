const express = require("express");
const router = express.Router();
const wishlistcontroller = require("../Controllers/Wishlistcontroller");
const { verifyToken } = require("../middleware/verifyToken");

router
  .route("/createwishlist")
  .post(verifyToken, wishlistcontroller.createWishlist);
router
  .route("/wishlist/:id")
  .delete(verifyToken, wishlistcontroller.deleteWishlist);
router
  .route("/getwishlist")
  .get(verifyToken, wishlistcontroller.getUserWishlist);

module.exports = router;
