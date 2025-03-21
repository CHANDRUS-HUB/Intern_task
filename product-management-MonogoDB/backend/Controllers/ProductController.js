const Product = require("../Models/ProductModel"); 
const Transaction = require("../Models/TransactionModel"); 
const mongoose = require("mongoose");

const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const products = await Product.find(filter)
      .sort({ createdAt: 1 }) 
      .select("name category old_stock new_stock unit consumed in_hand_stock createdAt");

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Database error occurred." });
  }
};


const unitTypes = ["kg", "g", "liter", "ml", "package", "piece", "box", "dozen", "bottle", "can"];

const addProduct = async (req, res) => {
  try {
    // console.log(" Incoming Product Data:", req.body); 

    let { name, new_stock, unit, consumed } = req.body;

    
    name = typeof name === "string" ? name.trim() : "";

    
    new_stock = new_stock !== undefined ? Number(new_stock) : NaN;
    consumed = consumed !== undefined ? Number(consumed) : NaN;

    
    const nameRegex = /^[A-Za-z]+(?: [A-Za-z]+)*$/;

    if (!name || !nameRegex.test(name)) {
      return res.status(400).json({ error: " Invalid product name. Only letters and single spaces allowed." });
    }

    if (!unit || !unitTypes.includes(unit)) {
      return res.status(400).json({ error: " Invalid unit type. Choose from: " + unitTypes.join(", ") });
    }

    if (isNaN(new_stock) || isNaN(consumed) || new_stock < 0 || consumed < 0) {
      return res.status(400).json({ error: " Invalid stock values. Must be numbers >= 0." });
    }

    let product = await Product.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }
    });

    if (product) {
      return res.status(400).json({ error: " Product already exists. Use update instead." });
    }

    product = new Product({
      name,
      old_stock: 0,
      new_stock,
      unit,
      consumed,
      in_hand_stock: new_stock - consumed, 
    });

    await product.save();
    console.log(" Product added successfully:", product);

    res.status(201).json({ success: true, message: " Product added successfully!", data: product });
  } catch (error) {
    console.error(" Error adding product:", error);
    res.status(500).json({ error: " Database error occurred." });
  }
};

const updateProductByName = async (req, res) => {
  try {
    console.log("Received Update Request:", req.body);
    const { name } = req.params; 
    const { new_stock, consumed, unit } = req.body; 

    
    if (new_stock === undefined || consumed === undefined || !unit) {
      return res.status(400).json({ error: " Missing required fields." });
    }

    
    if (!unitTypes.includes(unit)) {
      return res.status(400).json({ error: " Invalid unit type. Choose from: " + unitTypes.join(", ") });
    }

    let newStock = Number(new_stock);
    let consumedStock = Number(consumed);

    
    if (isNaN(newStock) || isNaN(consumedStock) || newStock < 0 || consumedStock < 0) {
      return res.status(400).json({ error: " Invalid stock values. Must be numbers >= 0." });
    }

    
    const product = await Product.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }
    }).sort({ createdAt: 1 });

    if (!product) {
      console.log(" Product does not exist. Update request rejected.");
      return res.status(400).json({ error: " Product does not exist." });
    }

    
    let oldStock = product.in_hand_stock;
    let finalInHandStock = oldStock + newStock - consumedStock;

    
    if (finalInHandStock < 0) {
      return res.status(400).json({ error: " Error: Consumption exceeds available stock!" });
    }

    
    const newEntry = new Product({
      name,
      category: product.category, 
      unit,
      old_stock: oldStock,
      new_stock: newStock,
      consumed: consumedStock,
      in_hand_stock: finalInHandStock,
      createdAt: new Date(),
    });

    
    await newEntry.save();

    console.log(" Product stock updated successfully:", newEntry);
    res.json({ success: true, message: " Product stock updated successfully!", data: newEntry });

  } catch (error) {
    console.error(" Error updating product:", error);
    res.status(500).json({ error: " Error updating product stock." });
  }
};


const getProductByName = async (req, res) => {
  try {
    let { name } = req.params;

    
    name = name.toLowerCase();

    console.log("🔍 Searching for:", { name });

    
    const product = await Product.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") }, 
    })
      .sort({ createdAt: -1 }) 
      .select("name category old_stock new_stock unit consumed in_hand_stock");

    if (!product) {
      console.log(" Product not found in DB");
      return res.status(404).json({ error: " Product not found." });
    }

    console.log(" Product found:", product);
    res.json(product);
  } catch (error) {
    console.error(" Error fetching product:", error);
    res.status(500).json({ error: " Error fetching product details." });
  }
};
const getDashboardData = async (req, res) => {
  try {
      // Aggregate data for categories
      const categoryData = await Product.aggregate([
          {
              $group: {
                  _id: "$category",
                  stock: { $sum: "$in_hand_stock" },
                  consumption: { $sum: "$consumption" }
              }
          }
      ]);

      // Fetch all product details
      const productData = await Product.find({}, 'name category in_hand_stock consumption');

      res.status(200).json({ categoryData, productData });
  } catch (error) {
      console.error("Error fetching dashboard data:", error);
      res.status(500).json({ error: "Failed to fetch dashboard data." });
  }
};



const EditProduct = async (req, res) => {
  const { productId, newStock, consumed } = req.body;

  try {
      const product = await Product.findById(productId);

      if (!product) {
          return res.status(404).json({ success: false, message: "Product not found!" });
      }

      const oldStock = product.old_stock || 0; 

      const availableStock = oldStock + Number(newStock);

      if (Number(consumed) > availableStock) {
          return res.status(400).json({
              success: false,
              message: "Consumption cannot exceed available stock."
          });
      }

      
      const inHandStock = availableStock - Number(consumed);

      
      product.old_stock = availableStock;
      product.in_hand_stock = inHandStock;
      product.new_stock = Number(newStock);
      product.consumed = Number(consumed);

      await product.save();
      console.log("✅ Updated Product Values:", {
        old_stock: product.old_stock,
        new_stock: product.new_stock,
        consumed: product.consumed,
        in_hand_stock: product.in_hand_stock
    });
    
      res.status(200).json({
          success: true,
          message: "Product details updated successfully!",
          product
      });

  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Server error occurred.",
          error: error.message
      });
  }
};





const deleteProduct = async (req, res) => {
  const { id } = req.params;
  
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
          success: false,
          message: "Invalid transaction ID format. Please provide a valid ObjectId."
      });
  }

  try {
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (!deletedProduct) {
          return res.status(404).json({
              success: false,
              message: "Product not found."
          });
      }

      res.status(200).json({
          success: true,
          message: "Product deleted successfully."
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Error deleting product.",
          error
      });
  }
};






module.exports = { getProducts,EditProduct, addProduct, updateProductByName, getProductByName ,getDashboardData,deleteProduct };
