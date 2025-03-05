const express = require("express");
const {
  getProducts,
  addProduct,
  updateProductByName,
  getProductByName,
} = require("../Controllers/ProductController");

const router = express.Router();


router.get("/products", getProducts);


router.post("/add-product", addProduct);


router.put("/products/update/:name", updateProductByName);


router.get("/product/:name", getProductByName);

module.exports = router;
