const express = require("express");
const productController = require("../Controllers/ProductController");
const { updateProductByName } = require("../Controllers/ProductController");
const db = require("../config/database"); 
const router = express.Router();


router.get("/categories", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT * FROM categories");
      res.json(rows);
    } catch (err) {
      console.error("Database Query Error:", err);
      res.status(500).json({ error: "Database error" });
    }
  });

  router.get("/products/:categoryId", async (req, res) => {
    const { categoryId } = req.params;

    try {
        console.log(`Fetching products for category ID: ${categoryId}`);

        const [products] = await db.execute(
            "SELECT name, unit FROM products WHERE category_id = ?", 
            [categoryId]
        );

        console.log("Products fetched:", products);
        res.json(products);
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ error: err.message });
    }
})

router.get("/products", productController.getProducts);


router.post("/add-product", productController.addProduct);


router.put("/update/:name/:category/:unit", updateProductByName);

router.get("/product/:name/:category/:unit", productController.getProductByDetails);
router.get("/product/:name/:category", productController.getProductByDetails);
router.get("/product/:name", productController.getProductByDetails);

module.exports = router;