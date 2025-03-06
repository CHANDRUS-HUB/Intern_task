const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/database");  
const productRoutes = require("./Routes/ProductRoutes");

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





app.use("/", productRoutes);


const frontendPath = path.resolve(__dirname, "../frontend/build");
app.use(express.static(frontendPath));


app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
