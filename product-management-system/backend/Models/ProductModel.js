const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    old_stock: { type: Number, default: 0 },
    new_stock: { type: Number, default: 0 }, 
    unit: { type: String, required: true },

    consumed: { type: Number, default: 0 },
    in_hand_stock: { type: Number, default: 0 },
  },
  { timestamps: true } 
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
