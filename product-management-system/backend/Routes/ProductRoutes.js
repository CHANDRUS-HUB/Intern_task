const express = require("express");
const {
  getProducts,
  addProduct,
  updateProductByName,
  getProductByName,
} = require("../Controllers/ProductController");

const router = express.Router();

// Route to get all products (with optional category filter)
router.get("/products", getProducts);

// Route to add a new product
router.post("/add-product", addProduct);

// Route to update a product by name
router.put("/products/update/:name", updateProductByName);

// Route to get a product by name
router.get("/product/:name", getProductByName);

module.exports = router;
