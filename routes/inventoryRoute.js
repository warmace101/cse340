//Needed Resources
const express = require("express");
const router = new express.Router();
const invValidate = require("../utilities/inventory-validation");
const invController = require("../controllers/invController");
const utilities = require("../utilities");

//Route to build inventory bt classification view
router.get("/type/:classification_id", invController.buildByClassification);

//Route to deliver a single inventory item view
router.get("/detail/:inv_id", invController.buildByInvId);

// Management view route
router.get("/", utilities.handleErrors(invController.buildManagement));

// GET add-classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// POST add-classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// GET add-inventory view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// POST add-inventory
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to get inventory as JSON
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

module.exports = router;
