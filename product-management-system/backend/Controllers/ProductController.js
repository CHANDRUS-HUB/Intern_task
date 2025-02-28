const Product = require("../Models/ProductModel"); // ✅ Ensure correct model path

// ✅ Get All Products (Optional: Filter by category)
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const products = await Product.find(filter).select("name category old_stock quantity unit consumed in_hand_stock");

    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};


// ✅ Add a New Product
const addProduct = async (req, res) => {
  try {
    const { name, category, quantity, unit } = req.body;

    if (!name || !category || !quantity || !unit) {
      return res.status(400).json({ error: "❌ Missing required fields." });
    }

    let product = await Product.findOne({ name, category });

    if (product) {
      return res.status(400).json({ error: "⚠️ Product already exists. Use update instead." });
    }

    product = new Product({
      name,
      category,
      quantity: Number(quantity),
      unit,
      old_stock: 0,
      consumed: 0, // ✅ Ensure consumed is explicitly stored
      in_hand_stock: Number(quantity),
    });

    await product.save();
    res.status(201).json({ success: true, message: "✅ Product added successfully!", data: product });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};


// ✅ Update an Existing Product by Name
const updateProductByName = async (req, res) => {
  try {
    const { name } = req.params;
    const { category, new_purchase, consumed } = req.body;

    const purchaseQty = Number(new_purchase) || 0;
    const consumedQty = Number(consumed) || 0;

    const product = await Product.findOne({ name, category });

    if (!product) {
      return res.status(404).json({ error: `❌ Product '${name}' not found in category '${category}'` });
    }

    const old_stock = product.in_hand_stock;
    const updated_in_hand_stock = old_stock + purchaseQty - consumedQty;

    if (updated_in_hand_stock < 0) {
      return res.status(400).json({ error: "⚠️ In-Hand Stock cannot be negative." });
    }

    product.old_stock = old_stock;
    product.quantity += purchaseQty;
    product.consumed += consumedQty; // ✅ Ensure previous consumed is updated
    product.in_hand_stock = updated_in_hand_stock;

    await product.save();

    res.json({
      success: true,
      message: `✅ Product '${name}' updated successfully!`,
      data: product,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};


module.exports = { getProducts, addProduct, updateProductByName };
