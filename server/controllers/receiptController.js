const Receipt = require("../models/Receipt");
const { applyStockChange } = require("../services/ledgerService");

// GET /api/receipts?status=
async function list(req, res, next) {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const receipts = await Receipt.find(filter)
      .populate("product", "name sku")
      .sort({ createdAt: -1 });
    res.json(receipts);
  } catch (err) {
    next(err);
  }
}

// POST /api/receipts  (always created as Draft)
async function create(req, res, next) {
  try {
    const { supplier, product, quantity } = req.body;
    const receipt = await Receipt.create({
      supplier,
      product,
      quantity,
      status: "Draft",
      createdBy: req.user.id,
    });
    res.status(201).json(receipt);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/receipts/:id/validate  → Done, increases stock via ledgerService
async function validate(req, res, next) {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (!receipt) return res.status(404).json({ error: "Receipt not found" });
    if (receipt.status === "Done") {
      return res.status(400).json({ error: "Receipt already validated" });
    }

    await applyStockChange(receipt.product, "RECEIPT", receipt.quantity, receipt._id);

    receipt.status = "Done";
    receipt.validatedAt = new Date();
    await receipt.save();

    res.json(receipt);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, validate };
