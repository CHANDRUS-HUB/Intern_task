const express = require("express");
const {
  getProducts,
  addProduct,
  updateProductByName,getProductByNameAndCategory
} = require("../Controllers/ProductController");

const router = express.Router();

//  Route to get all products (with optional category filter)
router.get("/products", getProducts);

//  Route to add a new product
router.post("/add-product", addProduct);

//  Route to update an existing product
router.get("/product/:name/:category", getProductByNameAndCategory);

router.put("/update/:name/:category", updateProductByName);

router.get("/product/latest-stock/:category/:name", getProductByNameAndCategory);



module.exports = router;
