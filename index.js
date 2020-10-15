const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const passport = require("./config/passport");

require("dotenv").config({ path: "variables.env" });

// helpers
const helpers = require("./helpers");

// create db connection
const db = require("./config/db");

// import models
require("./models/Projects");
require("./models/Tasks");
require("./models/Users");

// import handlers
require("./handlers/email");

db.sync()
  .then(() => console.log("db connected"))
  .catch((error) => console.log(error));

// create app
const app = express();

// static files
app.use(express.static("public"));

// enable pug engine
app.set("view engine", "pug");

// enable bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// folder views
app.set("views", path.join(__dirname, "./views"));

// add flash messages
app.use(flash());

//add cookie parser
app.use(cookieParser());

// add session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.messages = req.flash();
  res.locals.user = { ...req.user } || null;
  next();
});

app.use("/", routes());

const host = process.env.HOST || "0.0.0.0";
const port = process.env.PORT || "3000";

app.listen(port, host, () => {
  console.log("Server running");
});
