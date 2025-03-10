const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    transactionType: { type: String, enum: ["addition", "consumption"], required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", transactionSchema);
