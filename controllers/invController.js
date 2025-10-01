const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassification = async function (req, res, next) {
  const classification_id = req.params.classification_id
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.Util.buildClassificationGrid(data)
  let nav = await utilities.Util.getNav()
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
invCont.buildByInvId = async function (req, res, next) {
  try {
  const inv_id = req.params.inv_id;
  const vehicle = await invModel.getInventoryByInvId(inv_id);
  let nav = await utilities.Util.getNav();
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

module.exports = invCont
