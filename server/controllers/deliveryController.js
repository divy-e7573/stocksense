const Delivery = require("../models/Delivery");
const { applyStockChange } = require("../services/ledgerService");

// GET /api/deliveries?status=
async function list(req, res, next) {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const deliveries = await Delivery.find(filter)
      .populate("product", "name sku")
      .sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (err) {
    next(err);
  }
}

// POST /api/deliveries  (always created as Draft)
async function create(req, res, next) {
  try {
    const { customer, product, quantity } = req.body;
    const delivery = await Delivery.create({
      customer,
      product,
      quantity,
      status: "Draft",
      createdBy: req.user.id,
    });
    res.status(201).json(delivery);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/deliveries/:id/validate  → Done, decreases stock via ledgerService.
// Returns 400 if currentStock < quantity (guard enforced inside ledgerService).
async function validate(req, res, next) {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ error: "Delivery not found" });
    if (delivery.status === "Done") {
      return res.status(400).json({ error: "Delivery already validated" });
    }

    await applyStockChange(delivery.product, "DELIVERY", -delivery.quantity, delivery._id);

    delivery.status = "Done";
    delivery.validatedAt = new Date();
    await delivery.save();

    res.json(delivery);
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, validate };
