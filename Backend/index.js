const express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoute = require("./Routes/auth");
const accountRoute = require("./Routes/account");
var bodyParser = require("body-parser");

const app = express();
require("dotenv").config();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// use cors
app.use(cors());
app.use(cookieParser());
app.use(express.json());

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("connect db");
});

// routes
app.use("/v1/auth", authRoute);
app.use("/v1/account", accountRoute);

app.listen(3000, () => {
  console.log("server in running");
});
