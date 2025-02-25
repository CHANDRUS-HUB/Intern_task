const express = require("express");
const mysql = require("mysql2"); // ✅ Import MySQL
const cors = require("cors");
require("dotenv").config();
const moment = require("moment");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Create a MySQL connection pool
const db = mysql.createPool({
  host: "localhost",
  user: "newuser",
  password: "password123",
  database: "Product_Management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise(); // ✅ Promisify the connection pool

// ✅ Test database connection properly
async function testDBConnection() {
  try {
    const connection = await db.getConnection();
    console.log("✅ Database connected successfully!");
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
}

testDBConnection();

// ✅ Fetch all products with category names
app.get("/products", async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT p.id, p.name, c.name AS category_name, p.in_hand_stock
      FROM products p
      JOIN categories c ON p.category = c.id
    `);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error", details: err });
  }
});

// ✅ Fetch all categories
app.get("/categories", async (req, res) => {
  try {
    const [categories] = await db.query("SELECT * FROM categories");
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/add-product", async (req, res) => {
  const { name, category, date, old_stock, quantity, consumed } = req.body;

  try {
    // Check if the product already exists
    const [existingProduct] = await db.query("SELECT * FROM products WHERE name = ?", [name]);

    let oldStock = old_stock || 0;

    if (existingProduct.length > 0) {
      // If product exists, update old_stock
      oldStock = existingProduct[0].in_hand_stock;

      await db.query(
        "UPDATE products SET old_stock = ?, quantity = ?, consumed = ?, date = ? WHERE name = ?",
        [oldStock, quantity, consumed, date, name] // ✅ Removed in_hand_stock
      );

      return res.json({ updated: true, message: "Product stock updated!", oldStock });
    } else {
      // If product doesn't exist, insert as new
      await db.query(
        "INSERT INTO products (name, category, date, old_stock, quantity, consumed) VALUES (?, ?, ?, ?, ?, ?)",
        [name, category, date, oldStock, quantity, consumed] // ✅ Removed in_hand_stock
      );

      return res.json({ added: true, message: "Product added successfully!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error occurred." });
  }
});


// ✅ API to fetch existing product details by name
app.get("/product/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const [product] = await db.query("SELECT * FROM products WHERE name = ?", [name]);

    if (product.length > 0) {
      return res.json(product[0]);
    } else {
      return res.json(null);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error occurred." });
  }
});

// ✅ Add a category
app.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required" });

    await db.query("INSERT INTO categories (name) VALUES (?)", [name]);
    res.json({ message: "Category added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add category" });
  }
});

// ✅ Update a category
app.put("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await db.query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category", details: error });
  }
});

// ✅ Delete a category
app.delete("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM categories WHERE id = ?", [id]);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete category", details: error });
  }
});

// ✅ Start the server
app.listen(5000, () => console.log("✅ Server running on port 5000"));
