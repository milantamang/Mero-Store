const express = require("express");
const router = express.Router();
const HomeController=require('../Controllers/HomeController')
const { verifyAdmin } = require("../middleware/verifyToken");



router.route("/home/getTotals").get(verifyAdmin,HomeController.getTotals);

module.exports = router;