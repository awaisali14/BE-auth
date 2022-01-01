const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
const authRoute = require("./route/authRoutes");

//MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoute);

module.exports = app;
