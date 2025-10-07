const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassification = async function (req, res, next) {
  const classification_id = req.params.classification_id
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ****************************
 * Inventory Detail
 ******************************* */
invController.buildByInvId = async function (req, res, next) {
  try {
  const inv_id = req.params.inv_id;
  const vehicle = await invModel.getInventoryByInvId(inv_id);
  let nav = await utilities.getNav();
  if (vehicle) {
    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle
    });
  } else {
    const err = new Error("Vehicle Not Found");
    err.status = 404;
    next(err);
  }
} catch (err) {
  next(err)
}};

// Deliver the management view
invController.buildManagement = async function(req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    flash: req.flash("notice")
  });
};

invController.buildAddClassification = async function(req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    flash: "",
    errors: null,
    classification_name: ""
  });
};

invController.addClassification = async function(req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const result = await invModel.addClassification(classification_name);

  if (result && result.rowCount > 0) {
    req.flash("notice", `Classification "${classification_name}" added successfully.`);
    nav = await utilities.getNav(); // update nav with new classification
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      flash: req.flash("notice")
    });
  } else {
    req.flash("notice", "Sorry, the classification could not be added.");
    res.render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      flash: req.flash("notice"),
      errors: null,
      classification_name
    });
  }
};


invController.buildAddInventory = async function(req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add New Inventory Item",
    nav,
    flash: "",
    errors: null,
    classificationList,
    classification_id: "",
    inv_make: "",
    inv_model: "",
    inv_year: "",
    inv_description: "",
    inv_image: "",
    inv_thumbnail: "",
    inv_price: "",
    inv_miles: "",
    inv_color: ""
  });
};

invController.addInventory = async function(req, res) {
  let nav = await utilities.getNav();
  let {
    classification_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  } = req.body;

  const result = await inventoryModel.addInventory(
    classification_id, inv_make, inv_model, inv_year, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  );

  if (result && result.rowCount > 0) {
    req.flash("notice", `Inventory item "${inv_make} ${inv_model}" added successfully.`);
    nav = await utilities.getNav(); // update nav
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      flash: req.flash("notice")
    });
  } else {
    req.flash("notice", "Sorry, the inventory item could not be added.");
    let classificationList = await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      flash: req.flash("notice"),
      errors: null,
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
  }
};

module.exports = invController
