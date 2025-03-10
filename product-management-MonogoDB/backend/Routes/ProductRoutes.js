const express = require("express");
const {
  getProducts,
  addProduct,
  updateProductByName,
  getProductByName,getDashboardData ,deleteProduct
} = require("../Controllers/ProductController");
const { exportPDF} = require('../Controllers/PdfControlers');

const router = express.Router();


router.get("/products", getProducts);

router.get("/dashboard-data", getDashboardData);


router.get("/export-pdf",exportPDF);
router.post("/add-product", addProduct);


router.put("/products/update/:name", updateProductByName);

// router.get("/export-pdf",generatePDF);

router.get("/product/:name", getProductByName);

router.delete("/delete/:id",deleteProduct);


module.exports = router;
