const express = require("express");
const router = express.Router();
const categotycont=require('../Controllers/CategoryController')
const { verifyAdmin } = require("../middleware/verifyToken");



router.route("/getcategory").get(categotycont.getCategories);
router.route("/addcategory").post(verifyAdmin,categotycont.addCategory);
router.route("/deletecategory/:id").delete(verifyAdmin,categotycont.deleteCategory);


module.exports = router;