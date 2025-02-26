const express = require("express");
const { getProducts, addProduct, updateProductByName } = require("../Controllers/ProductController");

const router = express.Router();

router.get("/products", getProducts); // ✅ Fetch all products (Optional filter by category)
router.post("/add-product", addProduct); // ✅ First page: Add product
router.put("/update-product", updateProductByName); // ✅ Second page: Update stock after purchase & consumption

module.exports = router;