const pool = require("../config/database");
const { getProductCategory } = require("./CategoryController");

const unitTypes = ["kg", "g", "liter", "ml", "package", "piece", "box", "dozen", "bottle", "can"];


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



const addProduct = async (req, res) => {
  try {
      console.log("Received data:", req.body);

      const { name, category, new_stock, unit, consumed, inHandStock } = req.body;
      const in_hand_stock = inHandStock;
      const missingFields = [];
      
      if (!name) missingFields.push("name");
      if (!category) missingFields.push("category");
      if (new_stock === undefined) missingFields.push("new_stock");
      if (!unit) missingFields.push("unit");
      if (consumed === undefined) missingFields.push("consumed");
      if (in_hand_stock === undefined) missingFields.push("in_hand_stock");

      if (missingFields.length > 0) {
          return res.status(400).json({ error: `Missing fields: ${missingFields.join(", ")}` });
      }

      const checkQuery = `SELECT * FROM products WHERE name = ? AND category = ? AND unit = ?`;
      const [existingProducts] = await pool.execute(checkQuery, [name, category, unit]);

      if (existingProducts.length > 0) {
          return res.status(400).json({ error: "Product with the same name and unit already exists!" });
      }
   
      const query = `INSERT INTO products (name, category, new_stock, unit, consumed, in_hand_stock, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`;
      const createdAt = new Date().toISOString().slice(0, 19).replace("T", " ");
      
      await pool.execute(query, [name, category, new_stock, unit, consumed, in_hand_stock, createdAt]);

      res.status(201).json({ message: "Product added successfully!" });

  } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};





const updateProductByName = async (req, res) => {
  try {

    const { name, category, unit } = req.params;
    const { new_stock, consumed } = req.body;

    console.log("Received Params:", { name, category, unit });
    console.log("Received Body:", { new_stock, consumed });

    // Validate required fields
    if (!name || !category || !unit || new_stock === undefined || consumed === undefined) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const newStockNumber = Number(new_stock);
    const consumedNumber = Number(consumed);

    if (isNaN(newStockNumber) || isNaN(consumedNumber) || newStockNumber < 0 || consumedNumber < 0) {
      return res.status(400).json({ error: "Invalid stock values. Must be numbers >= 0." });
    }

 
    const [rows] = await pool.execute(
      `SELECT * FROM products 
       WHERE LOWER(name) = LOWER(?) 
         AND LOWER(category) = LOWER(?) 
         AND LOWER(unit) = LOWER(?)
       ORDER BY created_at DESC LIMIT 1`,
      [name, category, unit]
    );

    console.log("Product Found:", rows);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const product = rows[0];
    const oldStock = product.in_hand_stock;
    const finalInHandStock = oldStock + newStockNumber - consumedNumber;

    if (finalInHandStock < 0) {
      return res.status(400).json({ error: "Consumption exceeds available stock." });
    }

   
    await pool.execute(
      "UPDATE products SET old_stock = ?, new_stock = ?, consumed = ?, in_hand_stock = ? WHERE id = ?",
      [oldStock, newStockNumber, consumedNumber, finalInHandStock, product.id]
    );

    return res.status(200).json({
      message: "Product updated successfully!",
      updatedProduct: {
        id: product.id,
        name,
        category: product.category,
        unit,
        old_stock: oldStock,
        new_stock: newStockNumber,
        consumed: consumedNumber,
        in_hand_stock: finalInHandStock,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = {
  getProducts,
  addProduct,
  updateProductByName,
  getProductByDetails,
};
