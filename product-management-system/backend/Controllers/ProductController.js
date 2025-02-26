const Product = require("../Models/ProductModel");

// ✅ Fetch all products (Optional: Filter by category)
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { where: { category } } : {};
    const products = await Product.findAll(filter);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};

// ✅ Add a new product (First Page)
const addProduct = async (req, res) => {
  try {
    const { name, category, quantity, unit } = req.body;

    // 🔎 Check last recorded in-hand stock for the product
    const lastProduct = await Product.findOne({
      where: { name, category },
      order: [["id", "DESC"]],
    });

    let old_stock = lastProduct ? lastProduct.in_hand_stock : 0;
    let in_hand_stock = old_stock + quantity; // No consumption yet

    // ✅ Save new product entry
    const newProduct = await Product.create({
      name,
      category,
      old_stock,
      quantity,
      unit,
      consumed: 0, // Default 0 when added
      in_hand_stock,
    });

    res.json({ success: true, message: "Product added successfully!", data: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};

// ✅ Update stock after new purchase & consumption (Second Page)
// ✅ Update stock after new purchase & consumption (Second Page)
const updateProductByName = async (req, res) => {
  try {
    const { name } = req.params; // Get product name from URL
    const { category, new_purchase, consumed } = req.body; // Get data from body

    // 🔎 Find the product in the database
    const product = await Product.findOne({
      where: { name, category },
      order: [["id", "DESC"]],
    });

    if (!product) {
      return res.status(404).json({ error:` Product '${name}' not found in category '${category}'` });
    }

    // 🧮 Calculate stock updates
    const old_stock = product.in_hand_stock; // Get previous in-hand stock
    const updated_in_hand_stock = old_stock + new_purchase - consumed;

    // ✅ Update the product in the database
    await Product.update(
      {
        old_stock,
        quantity: new_purchase,
        consumed,
        in_hand_stock: updated_in_hand_stock,
      },
      { where: { id: product.id } }
    );

    // 🔄 Fetch updated product
    const updatedProduct = await Product.findByPk(product.id);

    res.json({
      success: true,
      message: `Product '${name}' updated successfully!`,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};

// ✅ Export all functions correctly
module.exports = { getProducts, addProduct, updateProductByName };