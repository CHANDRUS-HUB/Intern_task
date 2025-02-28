const express = require("express");
const {
  getProducts,
  addProduct,
  updateProductByName,
} = require("../Controllers/ProductController");

const router = express.Router();

// ✅ Route to get all products (with optional category filter)
router.get("/products", getProducts);

// ✅ Route to add a new product
router.post("/add-product", addProduct);

// ✅ Route to update an existing product
router.put("/update-product", updateProductByName);



module.exports = router;
