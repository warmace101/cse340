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

// Show the registration form
router.get("/register", accountController.buildRegister);

// Process the registration form
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Update account info view
router.get(
  "/update/:account_id",
  utilities.checkJWTToken,
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
);

// Process account info update
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdateAccountData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process password update
router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

// Logout route
router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
});

module.exports = router;