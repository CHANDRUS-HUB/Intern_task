const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const productRoutes = require("./Routes/ProductRoutes");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB (Fixed: Removed deprecated options)
mongoose.connect("mongodb://localhost:27017/productsDB")
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(5000, () => console.log("🚀 Server running on port 5000"));
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ API Routes  
app.use("/", productRoutes);
