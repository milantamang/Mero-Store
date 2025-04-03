const express = require("express");
const router = express.Router();
const {verifyToken, verifyAdmin} = require("../middleware/verifyToken");
const orderController = require("../Controllers/orderController");


router.route("/neworder").post(verifyToken, orderController.newOrder);
router.route("/order/:id").get(verifyToken,verifyAdmin, orderController.getSingleOrder);
router.route("/myorders").get(verifyToken, orderController.getLogedInUserOrder);
router.route("/orders/admin").get(verifyToken,verifyAdmin,orderController.getAllOrdersAdmin);
router.route("/orders/admin/:id").delete(verifyToken,verifyAdmin, orderController.deleteOrdersAdmin);
router.route("/orders/admin/:id").put(verifyToken,verifyAdmin, orderController.updateOrdersAdmin);




module.exports = router;
