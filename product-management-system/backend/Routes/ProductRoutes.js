const express = require("express");
const productController = require("../Controllers/ProductController");
const { updateProductByName } = require("../Controllers/ProductController");

const router = express.Router();


router.get("/products", productController.getProducts);


router.post("/add-product", productController.addProduct);


router.put("/update/:name/:category/:unit", updateProductByName);

  


router.get("/product/:name/:category/:unit", productController.getProductByDetails);
router.get("/product/:name/:category", productController.getProductByDetails);
router.get("/product/:name", productController.getProductByDetails);

module.exports = router;