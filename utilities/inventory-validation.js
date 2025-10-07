const { body, validationResult } = require("express-validator");
const validate = {};

/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("classification_id").notEmpty().withMessage("Classification is required."),
    body("inv_make").trim().escape().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().escape().notEmpty().withMessage("Model is required."),
    body("inv_year").isInt({ min: 1900, max: 2099 }).withMessage("Year must be between 1900 and 2099."),
    body("inv_description").trim().escape().notEmpty().withMessage("Description is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required."),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
    body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a positive integer."),
    body("inv_color").trim().escape().notEmpty().withMessage("Color is required.")
  ];
};

/* ******************************
 * Check data and return errors or continue to add inventory
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require("../utilities").getNav();
    let classificationList = await require("../utilities").buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      flash: "",
      errors,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color
    });
    return;
  }
  next();
};

/* **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name is required and must not contain spaces or special characters.")
  ];
};

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await require("../utilities").getNav();
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      flash: "",
      errors,
      classification_name
    });
    return;
  }
  next();
};

module.exports = validate;