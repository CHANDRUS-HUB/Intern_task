const express = require("express");
const router = express.Router();
const productController = require("../Controllers/ProductController");




const protect = require("../middleware/ProtectedRoute");



router.get("/categories", protect,productController.getCategories);
router.get("/products/:categoryId",protect, productController.getProductsByCategoryId);
router.get("/units/:categoryId",protect, productController.getUnitsByCategoryId);
router.get("/unit-products/:unit", protect,productController.getProductsByUnit);
router.delete("/delete/:id", protect,productController.deleteProduct);
router.put("/history/:id", protect,productController.updateProductHistory);
router.get("/keywords/:categoryId",protect, productController.getKeywordsByCategoryId);
router.get("/products", protect,productController.getProducts);

router.post("/add-product", protect,productController.addProduct);

router.put("/update-product/:name/:category/:unit", protect,productController.updateProductByName);

router.get("/product/:name/:category/:unit",protect, productController.getProductByDetails);
router.get("/product/:name/:category", protect,productController.getProductByDetails);
router.get("/product/:name",protect, productController.getProductByDetails);

module.exports = router;