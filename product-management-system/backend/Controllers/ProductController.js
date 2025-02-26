const Product = require("../Models/ProductModel"); // ✅ Only Declare Once

// ✅ Fetch all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};

// ✅ Add a new product
const addProduct = async (req, res) => {  // ✅ No need to declare Product again!
  try {
    const { name, category, quantity, consumed, unit } = req.body;

    // 🔎 Check if a previous entry exists
    const lastProduct = await Product.findOne({
      where: { name, category },
      order: [["id", "DESC"]], // Get latest entry
    });

    // 🧮 Calculate stock values
    let old_stock = lastProduct ? lastProduct.in_hand_stock : 0;
    let in_hand_stock = old_stock + quantity - consumed; // ✅ Correct stock calculation

    // 📝 Create new product entry
    const newProduct = await Product.create({
      name,
      category,
      old_stock,
      quantity,
      unit,
      consumed,
      in_hand_stock, // ✅ Store calculated in-hand stock
    });

    res.json({ success: true, message: "Product added successfully!", data: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};

// ✅ Update consumption
const updateConsumption = async (req, res) => {
  try {
    const { id, consumed } = req.body;
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    product.consumed += consumed;
    await product.save();

    res.json({ success: true, message: "Consumption updated successfully!", data: product });
  } catch (error) {
    console.error("Error updating consumption:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};

module.exports = { getProducts, addProduct, updateConsumption }; // ✅ Ensure all functions are exported
