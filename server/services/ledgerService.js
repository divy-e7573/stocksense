const Product = require("../models/Product");
const Ledger = require("../models/Ledger");

/**
 * The ONLY place stock is mutated (RULES.md §3).
 *
 * Atomically applies a stock change and records a ledger entry:
 *  - quantityChange > 0 increases stock (receipts, positive adjustments)
 *  - quantityChange < 0 decreases stock (deliveries, negative adjustments)
 *
 * When decreasing, the guard `currentStock >= |quantityChange|` is enforced in
 * the same findOneAndUpdate filter, so stock can never go negative even under
 * concurrent requests. Returns the updated product.
 *
 * Note: standalone MongoDB has no multi-doc transactions, so the $inc is the
 * atomic step; the ledger insert follows. If the ledger insert ever failed, the
 * stock change would already be committed — acceptable for the MVP scope.
 *
 * @param {string} productId
 * @param {"RECEIPT"|"DELIVERY"|"ADJUSTMENT"|"TRANSFER"} type
 * @param {number} quantityChange signed delta
 * @param {string} [refId] source document id (receipt/delivery)
 */
async function applyStockChange(productId, type, quantityChange, refId = null) {
  if (typeof quantityChange !== "number" || quantityChange === 0) {
    const err = new Error("quantityChange must be a non-zero number");
    err.status = 400;
    throw err;
  }

  const filter = { _id: productId };
  if (quantityChange < 0) {
    filter.currentStock = { $gte: -quantityChange };
  }

  const product = await Product.findOneAndUpdate(
    filter,
    { $inc: { currentStock: quantityChange } },
    { new: true }
  );

  if (!product) {
    // Either the product doesn't exist, or there wasn't enough stock to decrease.
    const exists = await Product.exists({ _id: productId });
    const err = new Error(exists ? "Insufficient stock" : "Product not found");
    err.status = exists ? 400 : 404;
    throw err;
  }

  await Ledger.create({
    product: productId,
    type,
    quantityChange,
    resultingStock: product.currentStock,
    refId,
  });

  return product;
}

module.exports = { applyStockChange };
