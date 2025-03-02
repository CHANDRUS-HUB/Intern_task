const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");  // ✅ Import Database Connection
const productRoutes = require("./Routes/ProductRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();  // ✅ Call database connection function

app.use("/", productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
