const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const productRoutes = require("./Routes/ProductRoutes");
const productuserRoutes = require("./Routes/UserRoute");

const app = express();

// ✅ Improved CORS Configuration
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ API Routes (Added before static file serving)
app.use("/", productuserRoutes);
app.use("/", productRoutes);

// ✅ Serving Frontend Build (Ensure it's after API routes)
const frontendPath = path.resolve(__dirname, "../frontend/build");
app.use(express.static(frontendPath));

app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// ✅ Server Initialization
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
