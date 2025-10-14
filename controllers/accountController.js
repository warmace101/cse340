const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const accountController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    flash: req.flash("notice") // <-- always pass this
  });
};

/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async function(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Registration",
    nav,
    errors: null,
    flash: "",
    account_firstname: "",
    account_lastname: "",
    account_email: ""
  });
};

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function(req, res) {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.');
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
      flash: req.flash("notice"),
      account_firstname,
      account_lastname,
      account_email,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword // <-- use hashed password here
  );


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
      flash: req.flash("notice"),
      account_firstname,
      account_lastname,
      account_email,
    });
  }
};

/* ****************************************
 *  Process login request
 * ************************************ */
accountController.accountLogin = async function(req, res, next) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  console.log(accountData)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      flash: req.flash("notice")
    })
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 }) // 1 hour
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
        flash: req.flash("notice")
      })
    }
  } catch (error) {
    req.flash("notice", "Login error. Please try again.")
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
      flash: req.flash("notice")
    })
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
accountController.buildAccountManagement = async function(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/management", {
    title: "Account Management",
    nav,
    flash: req.flash("notice"),
    errors: null
  });
};

accountController.buildUpdateAccount = async function(req, res, next) {
  let nav = await utilities.getNav();
  const account = await accountModel.getAccountById(req.params.account_id);
  res.render("account/update", {
    title: "Update Account",
    nav,
    flash: req.flash("notice"),
    errors: null,
    account_id: account.account_id,
    account_firstname: account.account_firstname,
    account_lastname: account.account_lastname,
    account_email: account.account_email
  });
};

/* ****************************************
*  Process account info update
* *************************************** */
accountController.updateAccount = async function(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_firstname, account_lastname, account_email } = req.body;

  // Server-side validation (you should also have express-validator middleware)
  if (!account_firstname || !account_lastname || !account_email) {
    req.flash("notice", "All fields are required.");
    return res.render("account/update", {
      title: "Update Account",
      nav,
      flash: req.flash("notice"),
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    });
  }

  // Check if email is already used by another account
  const existingAccount = await accountModel.getAccountByEmail(account_email);
  if (existingAccount && existingAccount.account_id != account_id) {
    req.flash("notice", "That email is already in use.");
    return res.render("account/update", {
      title: "Update Account",
      nav,
      flash: req.flash("notice"),
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    });
  }

  // Update account in DB
  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  );

  if (updateResult) {
    req.flash("notice", "Account information updated successfully.");
    // Get updated account info for display
    const updatedAccount = await accountModel.getAccountById(account_id);
    res.render("account/management", {
      title: "Account Management",
      nav,
      flash: req.flash("notice"),
      errors: null,
      accountData: updatedAccount
    });
  } else {
    req.flash("notice", "Update failed. Please try again.");
    res.render("account/update", {
      title: "Update Account",
      nav,
      flash: req.flash("notice"),
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    });
  }
};

/* ****************************************
*  Process password update
* *************************************** */
accountController.updatePassword = async function(req, res, next) {
  let nav = await utilities.getNav();
  const { account_id, account_password } = req.body;

  // Server-side validation 
  if (!account_password || account_password.length < 12) {
    req.flash("notice", "Password must be at least 12 characters.");
    // Get current account info for sticky form
    const account = await accountModel.getAccountById(account_id);
    return res.render("account/update", {
      title: "Update Account",
      nav,
      flash: req.flash("notice"),
      errors: null,
      account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email
    });
  }

  // Hash new password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash("notice", "Error hashing password.");
    const account = await accountModel.getAccountById(account_id);
    return res.render("account/update", {
      title: "Update Account",
      nav,
      flash: req.flash("notice"),
      errors: null,
      account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email
    });
  }

  // Update password in DB
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (updateResult) {
    req.flash("notice", "Password updated successfully.");
    const updatedAccount = await accountModel.getAccountById(account_id);
    res.render("account/management", {
      title: "Account Management",
      nav,
      flash: req.flash("notice"),
      errors: null,
      accountData: updatedAccount
    });
  } else {
    req.flash("notice", "Password update failed. Please try again.");
    const account = await accountModel.getAccountById(account_id);
    res.render("account/update", {
      title: "Update Account",
      nav,
      flash: req.flash("notice"),
      errors: null,
      account_id,
      account_firstname: account.account_firstname,
      account_lastname: account.account_lastname,
      account_email: account.account_email
    });
  }
};


module.exports = accountController;