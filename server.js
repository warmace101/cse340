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
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities")
const session = require("express-session")
const pool = require("./database/")
const accountRoute = require("./routes/accountRoute")
const accountController = require("./controllers/accountController")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const messageRoute = require("./routes/messageRoute")

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
app.use(cookieParser());
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(utilities.checkJWTToken);

// View engine, static, etc...
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "layouts/layout")
app.use(express.static("public"))

/* ***********************
 * Routes
 *************************/
app.use(static)


// Index Route
app.get("/", baseController.buildHome)

// Inventory Route
app.use("/inv", inventoryRoute);
// Account Route
app.use("/account", accountRoute)
// Message Route
app.use("/messages", messageRoute)

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
