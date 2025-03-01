const express = require("express");
const cors = require("cors");
require("dotenv").config();


const productRoutes = require("./Routes/ProductRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", productRoutes);


module.exports = app;
