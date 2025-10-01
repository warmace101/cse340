/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const invRoute = require("./routes/inventoryRoute")
const Util = require("./utilities")


/* ***********************
 * View Enigine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout") // not at views root

// Server the static files from the public folder
app.use(express.static("public"))

/* ***********************
 * Routes
 *************************/
app.use(static)


// Index Route
app.get("/", baseController.buildHome)

// Inventory Route
app.use("/inv", invRoute)

// 404 handler (for unmatched routes)
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// General error handler (place after all routes)
app.use(async (err, req, res, next) => {
  let nav="";
  try {
    nav = await utilities.getNav();
  } catch (e) {
    nav = ""; // fallback if nav fails
  }
  res.status(err.status || 500);
  res.render("error", {
    title: "Error",
    message: err.message,
    error: err,
    nav
  });
});


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
