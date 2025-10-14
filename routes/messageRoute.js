const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const utilities = require("../utilities");

// Only allow logged-in users
router.get("/", utilities.checkLogin, messageController.showBoard);
router.post("/", utilities.checkLogin, messageController.postMessage);

module.exports = router;