const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const accountController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    flash: ""
  });
};

/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async function(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    flash: ""
  });
};

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
 
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );


  console.log("Registration Result:", regResult); // Debugging line

  if (regResult && regResult.rowCount > 0) {
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      flash: req.flash("notice")
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      flash: req.flash("notice")
    });
  }
};

module.exports = accountController;