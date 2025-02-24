const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require("dotenv").config();
const moment = require("moment");

const app = express();
app.use(cors());
app.use(express.json());

// Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "Product_Management",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database Connection Failed: ", err);
    process.exit(1);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// Get all products
app.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Get all categories
app.get("/categories", (req, res) => {
  db.query("SELECT * FROM categories", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Add a new category
app.post("/categories", (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO categories (name) VALUES (?)", [name], (err, result) => {
    if (err) return res.status(500).json({ error: "Category already exists" });
    res.json({ message: "Category added successfully" });
  });
});

// Update a category
app.put("/categories/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  db.query("UPDATE categories SET name = ? WHERE id = ?", [name, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Category updated successfully" });
  });
});

// Delete a category
app.delete("/categories/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM categories WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Category deleted successfully" });
  });
});

// Get product usage analytics
app.get("/analytics", (req, res) => {
  const sql = `
    SELECT name, old_stock, quantity, consumed, 
           (old_stock + quantity - consumed) AS in_hand_stock 
    FROM products
  `;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Get detailed analytics with category filter
app.get("/detailed-analytics", (req, res) => {
  const category = req.query.category ? req.query.category : "%";
  const sql = `
    SELECT p.name, p.old_stock, p.quantity, p.consumed, 
           (p.old_stock + p.quantity - p.consumed) AS in_hand_stock, 
           c.name AS category 
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE c.name LIKE ?
  `;
  db.query(sql, [category], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
});

// Get stock forecast
app.get("/stock-forecast", (req, res) => {
  const category = req.query.category ? req.query.category : "%";
  const sql = `
    SELECT name, date, consumed FROM products 
    WHERE category_id IN (SELECT id FROM categories WHERE name LIKE ?)
    ORDER BY date DESC LIMIT 30
  `;
  db.query(sql, [category], (err, result) => {
    if (err) return res.status(500).json({ error: "Database query failed", details: err });

    if (result.length === 0) {
      return res.status(404).json({ message: "No data available for forecasting" });
    }

    const forecastData = {};
    result.forEach((row) => {
      if (!forecastData[row.name]) forecastData[row.name] = [];
      forecastData[row.name].push({ date: row.date, consumed: row.consumed });
    });

    const forecastResults = Object.entries(forecastData).map(([name, data]) => {
      data = data.reverse();
      let sma = data.slice(-7).reduce((sum, d) => sum + d.consumed, 0) / Math.min(7, data.length);
      let nextDate = moment(data[data.length - 1].date).add(1, "days").format("YYYY-MM-DD");
      return { name, next_date: nextDate, forecasted_consumption: Math.round(sma) };
    });

    res.json(forecastResults);
  });
});

// Start the server (Moved to end)
app.listen(5000, () => console.log("✅ Server running on port 5000"));
