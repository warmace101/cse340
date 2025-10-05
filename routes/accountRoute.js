const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities  = require("../utilities");

// Login route
router.get("/login", accountController.buildLogin);

// Registration route
router.get("/register", accountController.buildRegister);

//Post registration route
router.post('/register', utilities.handleErrors(accountController.registerAccount));

module.exports = router;