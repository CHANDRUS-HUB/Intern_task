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

  
    const lastProduct = await Product.findOne({ name, category }).sort({ createdAt: -1 });

    if (!lastProduct) {
      return res.status(400).json({ error: "⚠️ Error: Product does not exist. Please add it first." });
    }

    let oldStock = lastProduct.in_hand_stock;
    let finalInHandStock = oldStock + newStock - consumedStock;

  
    if (finalInHandStock < 0) {
      return res.status(400).json({ error: "❌ Error: Consumption exceeds available stock!" });
    }

    let today = new Date();
    today.setHours(0, 0, 0, 0);


    let todayEntry = await Product.findOne({ 
      name, 
      category, 
      in_hand_stock: oldStock,
      createdAt: { $gte: today } 
    });

    if (todayEntry) {
 
      todayEntry.new_stock += newStock;
      todayEntry.consumed += consumedStock;
      todayEntry.in_hand_stock = todayEntry.old_stock + todayEntry.new_stock - todayEntry.consumed;
      await todayEntry.save();
      console.log("✅ Updated Today's Entry:", todayEntry);

   
      const updatedEntry = new Product({
        name,
        category,
        old_stock: todayEntry.in_hand_stock, 
        new_stock: newStock,
        consumed: consumedStock,
        in_hand_stock: todayEntry.in_hand_stock + newStock - consumedStock, 
        createdAt: new Date(), 
      });

      await updatedEntry.save();
      console.log("✅ New Updated Stock Entry Added:", updatedEntry);

    } else {
      return res.status(400).json({ error: "⚠️ Error: No existing entry for today. No new entry will be created." });
    }

    res.json({ success: true, message: "✅ Product stock updated successfully!" });
  } catch (error) {
    console.error("❌ Update Error:", error); 
    res.status(500).json({ error: "⚠️ Server error occurred.", details: error.message }); 
  }
};


const getProductByNameAndCategory = async (req, res) => {
  try {
    const { name, category,in_hand_stock } = req.query;
    const product = await Product.findOne({ name, category ,in_hand_stock})
      .sort({ createdAt: -1 })  
      .select("name category in_hand_stock"); 

    if (product) {
      return res.json(product);  
    } else {
      return res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product details" });
  }
};


module.exports = { getProducts, addProduct, updateProductByName,getProductByNameAndCategory};
