const db = require("../config/db");
const moment = require("moment");

exports.getAllProducts = async (req, res) => {
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
};

// Add Product
exports.addProduct = async (req, res) => {
  try {
    const { name, category, date, quantity, consumed } = req.body;
    if (!name || !category || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    let formattedDate = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");

    const [categoryCheck] = await db.query("SELECT id FROM categories WHERE id = ?", [category]);
    if (categoryCheck.length === 0) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Fetch last stock
    const [lastEntry] = await db.query(
      "SELECT in_hand_stock FROM products WHERE name = ? ORDER BY date DESC LIMIT 1",
      [name]
    );
    
    let oldStock = lastEntry.length > 0 ? Number(lastEntry[0].in_hand_stock) : 0;
    let inHandStock = oldStock + (parseInt(quantity) || 0) - (parseInt(consumed) || 0);

    await db.query(
      "INSERT INTO products (name, category, date, old_stock, quantity, consumed, in_hand_stock) VALUES (?, ?, ?, ?, ?, ?, ?)", 
      [name, category, formattedDate, oldStock, quantity, consumed, inHandStock]
    );

    res.json({ message: "Product added successfully!" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};
