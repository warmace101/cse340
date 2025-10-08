const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Login route
router.get("/login", accountController.buildLogin);

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Protect the account management view
router.get(
  "/",
  utilities.checkJWTToken, // <-- checks for a valid JWT and sets res.locals.loggedin
  utilities.checkLogin,     // <-- only allows access if logged in
  utilities.handleErrors(accountController.buildAccountManagement)
);

module.exports = router;