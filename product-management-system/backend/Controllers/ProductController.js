const Product = require("../Models/ProductModel"); // ✅ Ensure correct model path

// ✅ Get All Products (Optional: Filter by category)
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

  
    const products = await Product.find(filter)
      .sort({ createdAt: -1 }) // Show latest first
      .select("name category old_stock new_stock unit consumed in_hand_stock  createdAt");

    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};



// ✅ Add a New Product
const addProduct = async (req, res) => {
  try {
    console.log("📩 Incoming Product Data:", req.body); // ✅ Debugging log

    const { name, category, new_stock, unit, consumed } = req.body;

    if (!name || !category || !new_stock || !unit || !consumed ) {
      console.log("❌ Missing required fields:", req.body);
      return res.status(400).json({ error: "❌ Missing required fields." });
    }

    let product = await Product.findOne({ name, category });

    if (product) {
      return res.status(400).json({ error: "⚠️ Product already exists. Use update instead." });
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
    console.log("✅ Product added successfully:", product);

    res.status(201).json({ success: true, message: "✅ Product added successfully!", data: product });
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};



// ✅ Update an Existing Product by Name
const updateProductByName = async (req, res) => {
  try {
    console.log("📩 Received Update Request:", req.body);
    const { name, category, new_purchase, consumed, unit } = req.body;

    let newStock = Number(new_purchase) || 0;
    let consumedStock = Number(consumed) || 0;

    // 🔍 Find the latest product entry (case-insensitive search)
    const lastProduct = await Product.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      category: { $regex: new RegExp(`^${category}$`, "i") }
    }).sort({ createdAt: -1 });

    if (!lastProduct) {
      console.log("❌ Product does not exist. Update request rejected.");
      return res.status(400).json({ success: false, error: "⚠️ Product does not exist. Please add it first!" });
    }

    // ✅ Set old stock to the last recorded in-hand stock
    let oldStock = lastProduct.in_hand_stock;
    let finalInHandStock = oldStock + newStock - consumedStock;

    // ❌ Prevent stock going negative
    if (finalInHandStock < 0) {
      return res.status(400).json({ success: false, error: "❌ Error: Consumption exceeds available stock!" });
    }

    // 🆕 Create a new row instead of updating the existing one
    const newEntry = new Product({
      name,
      category,
      unit,
      old_stock: oldStock,  
      new_stock: newStock,
      consumed: consumedStock,
      in_hand_stock: finalInHandStock,
      createdAt: new Date(), 
    });

    await newEntry.save(); 
    console.log("✅ New Stock Entry Added:", newEntry);

    res.json({ success: true, message: "✅ Product stock updated successfully!", data: newEntry });

  } catch (error) {
    console.error("❌ Update Error:", error.stack || error); 
    res.status(500).json({ 
        success: false, 
        error: "⚠️ Server error occurred.", 
        details: error.message,
        stack: error.stack // This helps in debugging!
    });
  }
};

const getProductByNameAndCategory = async (req, res) => {
  try {
    let { name, category } = req.params;

    // Convert to lowercase for case-insensitive matching
    name = name.toLowerCase();
    category = category.toLowerCase();

    console.log("🔍 Searching for:", { name, category }); // Debugging Log

    const product = await Product.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, "i") }, // Case-insensitive match
      category: { $regex: new RegExp(`^${category}$`, "i") }
    })
      .sort({ createdAt: -1 })
      .select("name category in_hand_stock");

    if (!product) {
      console.log("Product not found in DB");
      return res.status(404).json({ error: "Product not found" });
    }

    console.log(" Product found:", product);
    res.json(product);
  } catch (error) {
    console.error(" Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product details" });
  }
};



module.exports = { getProducts, addProduct, updateProductByName,getProductByNameAndCategory};
