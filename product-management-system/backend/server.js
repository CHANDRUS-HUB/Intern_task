const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();
const moment = require("moment");

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createPool({
  host: "localhost",
  user: "newuser",
  password: "password123",
  database: "Product_Management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise();


async function testDBConnection() {
  try {
    const connection = await db.getConnection();
    console.log("Database connected successfully!");
    connection.release();
  } catch (err) {
    console.error(" Database connection failed:", err);
  }
}

testDBConnection();


app.get("/products", async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT p.id, p.name, c.name AS category_name, 
             DATE_FORMAT(p.date, '%Y-%m-%d') AS date, 
             p.old_stock, p.quantity, p.consumed, p.in_hand_stock
      FROM products p
      JOIN categories c ON p.category = c.id
      ORDER BY p.date DESC
    `);
    res.json(products);
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});


app.get("/categories", async (req, res) => {
  try {
    const [categories] = await db.query("SELECT * FROM categories");
    res.json(categories);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/add-product", async (req, res) => {
  try {
    const { name, category, date, quantity, consumed } = req.body;

  
    if (!name || !category || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let categoryId = Number(category);
    let parsedQuantity = parseInt(quantity) || 0;
    let parsedConsumed = parseInt(consumed) || 0;
    let formattedDate = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");

    console.log("Received Data:", { name, categoryId, formattedDate, parsedQuantity, parsedConsumed });


    const [categoryCheck] = await db.query("SELECT id FROM categories WHERE id = ?", [categoryId]);
    if (categoryCheck.length === 0) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    
    const [lastEntry] = await db.query(
      "SELECT in_hand_stock FROM products WHERE name = ? ORDER BY date DESC LIMIT 1",
      [name]
    );
    
    let oldStock = lastEntry.length > 0 ? Number(lastEntry[0].in_hand_stock) : 0;
    
    await db.query(
      "INSERT INTO products (name, category, date, old_stock, quantity, consumed) VALUES (?, ?, ?, ?, ?, ?)",
      [name, categoryId, formattedDate, oldStock, parsedQuantity, parsedConsumed]
    );
    
    let inHandStock = oldStock + parsedQuantity - parsedConsumed;

    console.log("Old Stock:", oldStock, "New In-Hand Stock:", inHandStock);

  
    await db.query(
      "INSERT INTO products (name, category, date, old_stock, quantity, consumed) VALUES (?, ?, ?, ?, ?, ?)", 
      [name, categoryId, formattedDate, oldStock, parsedQuantity, parsedConsumed]
    );
    

    return res.json({ added: true, message: "Product added successfully!" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Database error occurred.", details: error.message });
  }
});



app.get("/product/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const [product] = await db.query("SELECT * FROM products WHERE name = ?", [name]);

    if (product.length > 0) {
      return res.json(product[0]);
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
});


app.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Category name is required" });

    await db.query("INSERT INTO categories (name) VALUES (?)", [name]);
    res.json({ message: "Category added successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
});

app.get("/analytics", async (req, res) => {
  try {
    const { category } = req.query;

    let query = `
      SELECT 
        p.name, 
        p.old_stock, 
        p.quantity, 
        p.consumed, 
        p.in_hand_stock
      FROM products p
      WHERE p.old_stock > 0 OR p.quantity > 0 OR p.consumed > 0 OR p.in_hand_stock > 0
    `;

    const queryParams = [];

    if (category) {
      query += " AND p.category = (SELECT id FROM categories WHERE name = ?)";
      queryParams.push(category);
    }

    const [analyticsData] = await db.query(query, queryParams);
    
    res.json(analyticsData);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
});



app.put("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    await db.query("UPDATE categories SET name = ? WHERE id = ?", [name, id]);
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});


app.delete("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM categories WHERE id = ?", [id]);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});
app.put("/update-product", async (req, res) => {
  const { productId, newStock } = req.body;

  // Get the last in_hand_stock from the database
  const product = await db.query(
    "SELECT in_hand_stock FROM products WHERE id = ?",
    [productId]
  );

  if (product.length > 0) {
    const oldStock = product[0].in_hand_stock;

    // Update oldstock and in_hand_stock
    await db.query(
      "UPDATE products SET oldstock = ?, in_hand_stock = ? WHERE id = ?",
      [oldStock, newStock, productId]
    );

    res.json({ message: "Product updated successfully" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});


app.listen(5000, () => console.log("✅ Server running on port 5000"));