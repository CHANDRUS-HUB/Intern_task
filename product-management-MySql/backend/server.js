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

app.use(express.static(path.join(__dirname, '../frontend/build')));



app.get('*', cors(), (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));

module.exports = app;
