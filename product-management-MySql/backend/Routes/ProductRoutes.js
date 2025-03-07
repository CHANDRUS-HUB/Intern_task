const express = require("express");
const productController = require("../Controllers/ProductController");
const { updateProductByName } = require("../Controllers/ProductController");
const db = require("../config/database"); 
const router = express.Router();
const pool = require("../config/database");


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
});



router.get("/units/:categoryId", async (req, res) => {
  const { categoryId } = req.params;
  try {
    const [rows] = await pool.query("SELECT unit FROM units WHERE category_id = ?", [categoryId]);
   
    res.json({ units: rows.map(row => row.unit) });
  } catch (error) {
    console.error("Error fetching units:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/unit-products/:unit", async (req, res) => {
  const { unit } = req.params;

  try {
      console.log(`Fetching products with unit: ${unit}`);

      const [rows] = await db.query( 
          "SELECT * FROM products WHERE unit = ?", 
          [unit]
      );

      if (rows.length === 0) {
          return res.status(404).json({ message: "No products found for this unit." });
      }

      res.json(rows);
  } catch (err) {
      console.error("Database Query Error:", err);
      res.status(500).json({ error: "Database error" });
  }
});


router.get("/products", productController.getProducts);

router.post("/add-product", productController.addProduct);

router.get("/products/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log(`Fetching products for category ID: ${categoryId}`);

    const [rows] = await db.query(
      "SELECT id, name FROM products WHERE category_id = ?",
      [categoryId]
    );

    console.log("Products fetched:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/products/:category", async (req, res) => {
  try {
    const { category } = req.params;
    console.log(`Fetching products for category: ${category}`);

    // Case-insensitive match on category name
    const [rows] = await db.query(
      "SELECT id, name FROM products WHERE LOWER(category) = LOWER(?)",
      [category]
    );

    console.log("Products fetched:", rows);
    res.json(rows); // e.g., [{ id: 5, name: 'rice' }, ...]
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.get("/keywords/:categoryId", async (req, res) => {
  try {
    const { categoryId } = req.params;
    const [rows] = await pool.query("SELECT keyword FROM keywords WHERE category_id = ?", [categoryId]);
    const keywords = rows.map((row) => row.keyword);
    res.json({ keywords });
  } catch (error) {
    console.error("Error fetching keywords:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.put("/update/:name/:category/:unit", updateProductByName);

router.get("/product/:name/:category/:unit", productController.getProductByDetails);
router.get("/product/:name/:category", productController.getProductByDetails);
router.get("/product/:name", productController.getProductByDetails);

module.exports = router;