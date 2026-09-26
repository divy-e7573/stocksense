const mongoose = require("mongoose");

const positiveQty = {
  validator: (v) => v > 0,
  message: "quantity must be greater than 0",
};

const deliverySchema = new mongoose.Schema({
  customer: { type: String, required: true, trim: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, validate: positiveQty },
  status: { type: String, enum: ["Draft", "Done"], default: "Draft" },
  validatedAt: { type: Date, default: null },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Delivery", deliverySchema);
