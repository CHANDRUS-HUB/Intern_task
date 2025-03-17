const pool = require("../config/database");
const moment = require("moment");
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



const fetchProducts = async (category) => {
  try {
    const response = await axios.get(`http://localhost:5000/products/${category}`);
    console.log("Fetched Products:", response.data); 
    setProducts(response.data);
  } catch (error) {
    console.error("Error fetching products:", error);
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


module.exports = {
  getProducts,
  addProduct,
  updateProductByName,
  getProductByDetails,fetchProducts 
};
