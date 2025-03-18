const pool = require("../config/database");
const moment = require("moment");
const db = require("../config/database"); 

const getProducts = async (req, res) => {
  try {
    let query = `
      SELECT id, name, category, old_stock, new_stock, unit, consumed, in_hand_stock, created_at AS createdAt 
      FROM products
    `;
    const params = [];
    const conditions = [];

    if (req.query.category) {
      conditions.push("category = ?");
      params.push(req.query.category);
    }
    if (req.query.name) {
      conditions.push("name LIKE ?");
      params.push(`%${req.query.name}%`); 
    }
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += " ORDER BY created_at DESC"; 
    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getProductByDetails = async (req, res) => {
  try {
    const { name, category, unit } = req.params; 

    let query = `
      SELECT id, name, category, old_stock, new_stock, unit, consumed, in_hand_stock, created_at 
      FROM products 
      WHERE name = ?
    `;

    const params = [name];

    if (category) {
      query += " AND category = ?";
      params.push(category);
    }
    if (unit) {
      query += " AND unit = ?";
      params.push(unit);
    }

    const [rows] = await pool.execute(query, params);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found!" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const detectCategory = async (productName) => {

  const [rows] = await pool.execute(`
    SELECT c.id AS category_id, c.name AS category_name, k.keyword
    FROM keywords k
    JOIN categories c ON k.category_id = c.id
  `);
  
 
  for (const row of rows) {
    if (productName.toLowerCase().includes(row.keyword.toLowerCase())) {
     
      return { id: row.category_id, name: row.category_name };
    }
  }
  

  return { id: 1, name: "Other" };
};

const addProduct = async (req, res) => {
  try {
    console.log("Received data:", req.body);

    const { name, new_stock, unit } = req.body;
    if (!name || new_stock === undefined || !unit) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const detected = await detectCategory(name);
    const category_id = detected.id;
    const categoryName = detected.name;

    const [allowedRows] = await pool.execute(
      "SELECT unit FROM units WHERE category_id = ?",
      [category_id]
    );
    const allowedUnits = allowedRows.map(row => row.unit.toLowerCase());
    if (!allowedUnits.includes(unit.toLowerCase())) {
      return res.status(400).json({
        error: `Unit '${unit}' is not allowed for category '${categoryName}'. Allowed units are: ${allowedUnits.join(", ")}`
      });
    }

    const checkQuery = `
      SELECT in_hand_stock FROM products 
      WHERE name = ? AND unit = ? 
      ORDER BY created_at DESC LIMIT 1
    `;
    const [existingProducts] = await pool.execute(checkQuery, [name, unit]);
    const old_stock = existingProducts.length > 0 ? existingProducts[0].in_hand_stock : 0;

    // ✅ Corrected Duplicate Check Logic
    const duplicateCheckQuery = `
      SELECT id FROM products 
      WHERE name = ? AND unit = ?
    `;
    const [existingProduct] = await pool.execute(duplicateCheckQuery, [
      name, unit
    ]);

    if (existingProduct.length > 0) {
      return res.status(400).json({ error: "Product already exists!" });
    }

    const in_hand_stock = new_stock;

    const query = `
      INSERT INTO products (name, category, category_id, old_stock, new_stock, unit, in_hand_stock, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?,  ?)
    `;
  

    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
    
    


    await pool.execute(query, [name, categoryName, category_id, old_stock, new_stock, unit, in_hand_stock, createdAt]);

    res.status(201).json({ 
      message: "Product added successfully!", 
      category: categoryName, 
      category_id, 
      in_hand_stock 
    });

  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateProductByName = async (req, res) => {
  try {
    const { name, category, unit } = req.params;
    const { new_stock, consumed } = req.body;

    // Validate Required Fields
    if (!name || !category || !unit || new_stock === undefined || consumed === undefined) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Convert & Validate Numbers
    const newStockNumber = Number(new_stock);
    const consumedNumber = Number(consumed);

    if (isNaN(newStockNumber) || isNaN(consumedNumber) || newStockNumber < 0 || consumedNumber < 0) {
      return res.status(400).json({ error: "Invalid stock values. Must be numbers >= 0." });
    }

    // Fetch the Latest Product Record
    const [rows] = await pool.execute(
      `SELECT id, in_hand_stock, category_id FROM products 
       WHERE LOWER(TRIM(name)) = LOWER(TRIM(?)) 
         AND LOWER(TRIM(category)) = LOWER(TRIM(?)) 
         AND LOWER(TRIM(unit)) = LOWER(TRIM(?))
       ORDER BY created_at DESC LIMIT 1`,
      [name, category, unit]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const product = rows[0];
    const oldStock = product.in_hand_stock;
    const finalInHandStock = oldStock + newStockNumber - consumedNumber;

    if (finalInHandStock < 0) {
      return res.status(400).json({ error: "Consumption exceeds available stock." });
    }

    // Insert New Record with Updated Stock
    const insertQuery = `
      INSERT INTO products 
      (name, category, category_id, old_stock, new_stock, unit, consumed, in_hand_stock, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    await pool.execute(insertQuery, [
      name,
      category,
      product.category_id,
      oldStock,
      newStockNumber,
      unit,
      consumedNumber,
      finalInHandStock
    ]);

    return res.status(201).json({
      message: "Stock updated successfully!",
      updatedProduct: {
        name,
        category,
        unit,
        old_stock: oldStock,
        new_stock: newStockNumber,
        consumed: consumedNumber,
        in_hand_stock: finalInHandStock,
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// Get all categories
const getCategories = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM categories");
        res.json(rows);
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ error: "Database error" });
    }
};

// Get products by category ID
const getProductsByCategoryId = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const [products] = await db.query(
            "SELECT name, unit FROM products WHERE category_id = ?", 
            [categoryId]
        );
        res.json(products);
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ error: "Database error" });
    }
};

// Get units by category ID
const getUnitsByCategoryId = async (req, res) => {
    const { categoryId } = req.params;

    try {
        const [rows] = await db.query("SELECT unit FROM units WHERE category_id = ?", [categoryId]);
        res.json({ units: rows.map(row => row.unit) });
    } catch (error) {
        console.error("Error fetching units:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get products by unit
const getProductsByUnit = async (req, res) => {
    const { unit } = req.params;

    try {
        const [rows] = await db.query("SELECT * FROM products WHERE unit = ?", [unit]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "No products found for this unit." });
        }

        res.json(rows);
    } catch (err) {
        console.error("Database Query Error:", err);
        res.status(500).json({ error: "Database error" });
    }
};

// Delete product by ID
 const deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Invalid product ID." });
    }

    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found." });
    }

    res.status(200).json({ message: "Product deleted successfully." });
};

// Update product history
const updateProductHistory = async (req, res) => {
    const { id } = req.params;
    const { new_stock, consumed } = req.body;

    if (new_stock === undefined || consumed === undefined) {
        return res.status(400).json({ error: "Both 'new_stock' and 'consumed' are required." });
    }

    try {
        const [result] = await db.execute(
            "UPDATE products SET new_stock = ?, consumed = ?, in_hand_stock = new_stock - consumed WHERE id = ?",
            [new_stock, consumed, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No product history found with this ID." });
        }

        res.status(200).json({ message: "Product history updated successfully." });
    } catch (error) {
        console.error("Error updating product history:", error);
        res.status(500).json({ error: "Failed to update product history." });
    }
};

const getKeywordsByCategoryId= async (req, res) => {
  try {
    const { categoryId } = req.params;
    const [rows] = await pool.query("SELECT keyword FROM keywords WHERE category_id = ?", [categoryId]);
    const keywords = rows.map((row) => row.keyword);
    res.json({ keywords });
  } catch (error) {
    console.error("Error fetching keywords:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getProducts,
  addProduct,
  updateProductByName,
  getProductByDetails,getCategories,getProductsByCategoryId,
  getUnitsByCategoryId,
  getProductsByUnit,deleteProduct,updateProductHistory,getKeywordsByCategoryId
};
