const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  old_stock: { type: Number, default: 0 },  // ✅ Ensure it's included
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  consumed: { type: Number, default: 0 },  // ✅ Fix: Ensure `consumed` field is included
  in_hand_stock: { type: Number, default: 0 }
});

module.exports = mongoose.model("Product", productSchema);
