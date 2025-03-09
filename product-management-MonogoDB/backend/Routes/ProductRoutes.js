const express = require("express");
const {
  getProducts,
  addProduct,
  updateProductByName,
  getProductByName,getDashboardData 
} = require("../Controllers/ProductController");
const { generatePDF } = require('../Controllers/PdfControlers');

const router = express.Router();


router.get("/products", getProducts);

router.get("/dashboard-data", getDashboardData);

router.post("/add-product", addProduct);


router.put("/products/update/:name", updateProductByName);

router.get("/export-pdf",generatePDF);

router.get("/product/:name", getProductByName);

module.exports = router;
