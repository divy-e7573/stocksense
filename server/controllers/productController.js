const Product = require("../models/Product");

// GET /api/products?search=
async function list(req, res, next) {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) {
      const rx = new RegExp(search.trim(), "i");
      filter.$or = [{ name: rx }, { sku: rx }];
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
}

// POST /api/products
async function create(req, res, next) {
  try {
    const { name, sku, category, unit, currentStock, reorderThreshold } = req.body;
    const product = await Product.create({
      name,
      sku,
      category,
      unit,
      currentStock, // opening stock (set at creation only; never mutated here after)
      reorderThreshold,
    });
    res.status(201).json(product);
  } catch (err) {
    if (err.code === 11000) {
      err.status = 409;
      err.message = "SKU already exists";
    }
    next(err);
  }
}

// PUT /api/products/:id
async function update(req, res, next) {
  try {
    const { name, sku, category, unit, reorderThreshold } = req.body;
    // currentStock is intentionally excluded — stock changes only via ledgerService.
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, sku, category, unit, reorderThreshold },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    if (err.code === 11000) {
      err.status = 409;
      err.message = "SKU already exists";
    }
    next(err);
  }
}

// DELETE /api/products/:id
async function remove(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json({ deleted: true, id: req.params.id });
  } catch (err) {
    next(err);
  }
}

module.exports = { list, create, update, remove };
