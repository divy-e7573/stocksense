const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  type: {
    type: String,
    enum: ["RECEIPT", "DELIVERY", "ADJUSTMENT", "TRANSFER"],
    required: true,
  },
  quantityChange: { type: Number, required: true },
  resultingStock: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  refId: { type: mongoose.Schema.Types.ObjectId, default: null },
});

module.exports = mongoose.model("Ledger", ledgerSchema);
