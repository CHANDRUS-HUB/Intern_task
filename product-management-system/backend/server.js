const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");
const productRoutes = require("./Routes/ProductRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Correct route usage
app.use("/", productRoutes); // Changed from "/" to "/api" for better organization

// ✅ Ensure database is synced and then start server
sequelize.sync({ alter: true }).then(() => {
  console.log("Database connected & tables synced");
  app.listen(5000, () => console.log("Server running on port 5000"));
}).catch(err => console.error("Database sync error:", err));
