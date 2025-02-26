const express = require("express");
const { getProducts, addProduct, updateConsumption } = require("../Controllers/ProductController"); // ✅ Ensure correct path

const router = express.Router();

router.get("/products", getProducts); // ✅ Get all products
router.post("/add-product", addProduct); // ✅ Add a new product
router.put("/update-consumption", updateConsumption); // ✅ Update consumption

module.exports = router;
