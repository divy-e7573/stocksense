const Product = require("../models/Product");
const Receipt = require("../models/Receipt");
const Delivery = require("../models/Delivery");
const Ledger = require("../models/Ledger");

// GET /api/dashboard
async function summary(req, res, next) {
  try {
    const [
      totalProducts,
      stockAgg,
      lowStockCount,
      pendingReceipts,
      pendingDeliveries,
      recentMovements,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.aggregate([
        { $group: { _id: null, total: { $sum: "$currentStock" } } },
      ]),
      Product.countDocuments({
        $expr: { $lte: ["$currentStock", "$reorderThreshold"] },
      }),
      Receipt.countDocuments({ status: "Draft" }),
      Delivery.countDocuments({ status: "Draft" }),
      Ledger.find()
        .populate("product", "name sku")
        .sort({ timestamp: -1 })
        .limit(10),
    ]);

    res.json({
      totalProducts,
      totalStock: stockAgg[0]?.total || 0,
      lowStockCount,
      pendingReceipts,
      pendingDeliveries,
      recentMovements,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { summary };
