const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const productRoutes = require("../routes/ProductRoutes");
const categoryRoutes = require("../routes/categoryRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Test Database Connection
db.getConnection()
  .then((conn) => {
    console.log("✅ Database connected successfully!");
    conn.release();
  })
  .catch((err) => console.error("❌ Database connection failed:", err));

// Register routes
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", analyticsRoutes);

module.exports = app;
