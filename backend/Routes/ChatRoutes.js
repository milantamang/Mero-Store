// backend/Routes/ChatRoutes.js
const express = require("express");
const router = express.Router();
const chatController = require("../Controllers/ChatController");

router.route("/chat").post(chatController.generateResponse);

module.exports = router;