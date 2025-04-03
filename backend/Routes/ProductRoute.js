const express = require("express");
const router = express.Router();
const productcontroller = require("../Controllers/ProductController");
const { verifyAdmin } = require("../middleware/verifyToken");

router.route("/products").get(productcontroller.getProducts);
router.route("/products/:id").get(productcontroller.getProductById);
router.route("/product/search").get(productcontroller.getProductsBySearch);
router.route("/deleteproduct/:id").delete(productcontroller.deleteProduct);

// admin le garx
router.route("/products/new").post(verifyAdmin, productcontroller.addProduct);
router
  .route("/editproduct/:id")
  .put(verifyAdmin, productcontroller.editProduct);
router
  .route("/deleteproducts/:id")
  .delete(verifyAdmin, productcontroller.deleteProduct);

module.exports = router;
