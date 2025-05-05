const express = require("express");
const router = express.Router();
const offercont=require('../Controllers/HomeController')
const { verifyAdmin } = require("../middleware/verifyToken");



router.route("/getoffers").get(offercont.getOffer);
router.route("/getalloffers").get(offercont.getAllOffers);
router.route("/addoffer").post(verifyAdmin,offercont.addOffer);
router.route("/deleteoffer/:id").delete(verifyAdmin, offercont.deleteOffer);
router.route("/updateofferstatus/:id").put(verifyAdmin, offercont.updateOfferStatus);


module.exports = router;