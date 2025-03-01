const Product = require("../Models/ProductModel"); 


const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

  
    const products = await Product.find(filter)
      .sort({ createdAt: -1 }) // Show latest first
      .select("name category old_stock new_stock consumed in_hand_stock createdAt");

    res.json(products);
  } catch (error) {
    console.error(" Error fetching products:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};



//  Add a New Product
const addProduct = async (req, res) => {
  try {
    console.log(" Incoming Product Data:", req.body); //  Debugging log

    const { name, category, new_stock, unit, consumed } = req.body;

    if (!name || !category || new_stock === undefined || !unit || consumed === undefined) {
      console.log("⚠️ Missing required fields:", req.body);
      return res.status(400).json({ error: "All fields (name, category, new_stock, unit, consumed) are required." });
    }
    

    let product = await Product.findOne({ name, category });

    if (product) {
      return res.status(400).json({ error: " Product already exists. Use update instead." });
    }

    product = new Product({
      name,
      category,
      old_stock: 0,  
      new_stock: Number(new_stock),  
      unit,
      consumed: Number(consumed) || 0, 
      in_hand_stock: Number(new_stock) - (Number(consumed) || 0), 
    });

    await product.save();
    console.log(" Product added successfully:", product);

    res.status(201).json({ success: true, message: "Product added successfully!", data: product });
  } catch (error) {
    console.error(" Error adding product:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};



//  Update an Existing Product by Name
const updateProductByName = async (req, res) => {
  try {
    const { name, category } = req.params;
    const { new_purchase, consumed } = req.body;

    console.log("📩 Update Request Received:", { name, category, new_purchase, consumed });

    if (!name || !category) {
      return res.status(400).json({ error: "Product name and category are required." });
    }

    let newStock = new_purchase !== undefined ? Number(new_purchase) : 0;
    let consumedStock = consumed !== undefined ? Number(consumed) : 0;

    // 🔍 Find the latest product entry
    const lastProduct = await Product.findOne({ name, category }).sort({ createdAt: -1 });

    if (!lastProduct) {
      return res.status(400).json({ error: "Product not found for update. Please add it first." });
    }

    console.log("🔍 Before Update:", {
      oldStock: lastProduct.old_stock,
      newStockBeforeUpdate: lastProduct.new_stock,
      consumedBeforeUpdate: lastProduct.consumed,
      inHandStockBeforeUpdate: lastProduct.in_hand_stock,
    });

    // ✅ Ensure consumption does not exceed available stock
    let finalInHandStock = lastProduct.in_hand_stock + newStock - consumedStock;

    if (finalInHandStock < 0) {
      return res.status(400).json({
        error: `Error: You are trying to consume ${consumedStock}, but only ${lastProduct.in_hand_stock} is available.`,
      });
    }

    // ✅ Update values in DB
    lastProduct.new_stock += newStock;
    lastProduct.consumed += consumedStock;
    lastProduct.in_hand_stock = finalInHandStock;

    await lastProduct.save();

    console.log("✅ After Update:", {
      oldStock: lastProduct.old_stock,
      newStockAfterUpdate: lastProduct.new_stock,
      consumedAfterUpdate: lastProduct.consumed,
      inHandStockAfterUpdate: lastProduct.in_hand_stock,
    });

    res.json({ success: true, message: "Product stock updated successfully!", data: lastProduct });

  } catch (error) {
    console.error("❌ Update Error:", error);
    res.status(500).json({ error: "Server error occurred.", details: error.message });
  }
};


const getProductByNameAndCategory = async (req, res) => {
  try {
    let { name, category } = req.params;

    // Decode URI components (fix issues with spaces in URLs)
    name = decodeURIComponent(name);
    category = decodeURIComponent(category);

    console.log("📌 Fetching Product:", { name, category });

    const product = await Product.findOne({ name, category })
      .sort({ createdAt: -1 }) 
      .select("name category old_stock new_stock consumed in_hand_stock createdAt");

    if (!product) {
      return res.status(404).json({ error: "❌ Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ error: "❌ Error fetching product details" });
  }
};

module.exports = { getProducts, addProduct, updateProductByName,getProductByNameAndCategory};
