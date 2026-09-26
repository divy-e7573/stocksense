const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sku: { type: String, required: true, unique: true, trim: true },
  category: { type: String, trim: true, default: "" },
  unit: { type: String, trim: true, default: "unit" },
  currentStock: { type: Number, default: 0, min: 0 },
  reorderThreshold: { type: Number, default: 0, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
