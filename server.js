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
const utilities = require("./utilities")
const session = require("express-session")
const pool = require("./database/")
const accountRoute = require("./routes/accountRoute")
const accountController = require("./controllers/accountController")
const bodyParser = require("body-parser")

/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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
// Account Route
app.use("/account", accountRoute)



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
