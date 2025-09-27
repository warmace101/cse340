const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassification = async function (req, res, next) {
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

invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.inv_id;
  const vehicle = await invModel.getInventoryByInvId(inv_id);
  let nav = await utilities.getNav();
  if (vehicle) {
    const detailHTML = utilities.buildDetailHTML(vehicle);
    res.render("./inventory/detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detailHTML
    });
  } else {
    res.status(404).send("Vehicle not found");
  }
};

module.exports = invCont
