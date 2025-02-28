const Product = require("../Models/ProductModel"); // ✅ Ensure correct model path

// ✅ Get All Products (Optional: Filter by category)
const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

  
    const products = await Product.find(filter)
      .sort({ createdAt: -1 }) // Show latest first
      .select("name category old_stock new_stock consumed in_hand_stock createdAt");

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

    if (!name || !category || !new_stock || !unit || consumed === undefined) {
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
    const { name, category, new_purchase, consumed } = req.body;

    let newStock = Number(new_purchase) || 0;
    let consumedStock = Number(consumed) || 0;

    // ✅ Get the last product entry for this name & category
    const lastProduct = await Product.findOne({ name, category }).sort({ createdAt: -1 });

    if (!lastProduct) {
      return res.status(400).json({ error: "⚠️ Error: Product does not exist. Please add it first." });
    }

    let oldStock = lastProduct.in_hand_stock;
    let finalInHandStock = oldStock + newStock - consumedStock;

    // ✅ Prevent negative in-hand stock
    if (finalInHandStock < 0) {
      return res.status(400).json({ error: "❌ Error: Consumption exceeds available stock!" });
    }

    // ✅ Get today's date (Midnight to compare correctly)
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Check if today's entry already exists
    let todayEntry = await Product.findOne({ 
      name, 
      category, 
      createdAt: { $gte: today } 
    });

    if (todayEntry) {
      // ✅ If a previous product entry exists for today, update the entry
      todayEntry.new_stock += newStock;
      todayEntry.consumed += consumedStock;
      todayEntry.in_hand_stock = todayEntry.old_stock + todayEntry.new_stock - todayEntry.consumed;
      await todayEntry.save();
      console.log("✅ Updated Today's Entry:", todayEntry);

      // ✅ Add a new row showing updated stock correctly
      const updatedEntry = new Product({
        name,
        category,
        old_stock: todayEntry.in_hand_stock, // Correct variable name (should be `todayEntry.in_hand_stock`)
        new_stock: newStock,
        consumed: consumedStock,
        in_hand_stock: todayEntry.in_hand_stock + newStock - consumedStock, // Fix to use correct variables
        createdAt: new Date(), // Current timestamp for new row
      });

      await updatedEntry.save();
      console.log("✅ New Updated Stock Entry Added:", updatedEntry);

    } else {
      return res.status(400).json({ error: "⚠️ Error: No existing entry for today. No new entry will be created." });
    }

    res.json({ success: true, message: "✅ Product stock updated successfully!" });
  } catch (error) {
    console.error("❌ Update Error:", error); // Log the actual error message
    res.status(500).json({ error: "⚠️ Server error occurred.", details: error.message }); // Send back error details
  }
};

// Fetch latest product by name and category
const getProductByNameAndCategory = async (req, res) => {
  try {
    const { name, category } = req.query;
    const product = await Product.findOne({ name, category })
      .sort({ createdAt: -1 })  // Fetch the latest entry
      .select("name category in_hand_stock");  // Only fetch relevant fields

    if (product) {
      return res.json(product);  // Return the most recent product data
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product details" });
  }
};


module.exports = { getProducts, addProduct, updateProductByName,getProductByNameAndCategory};
