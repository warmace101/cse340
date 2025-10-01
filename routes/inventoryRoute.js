//Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")

//Route to build inventory bt classification view
router.get("/type/:classification_id", invController.buildByClassification);

//Route to deliver a single inventory item view
router.get("/detail/:inv_id", invController.buildByInvId);

module.exports = router;
