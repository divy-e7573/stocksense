// Clears and reseeds the database with demo data (RULES.md §1.5).
// Run with: npm run seed
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");
const Receipt = require("./models/Receipt");
const Delivery = require("./models/Delivery");
const Ledger = require("./models/Ledger");
const { applyStockChange } = require("./services/ledgerService");

async function seed() {
  await connectDB();

  // 1. Clear everything
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Receipt.deleteMany({}),
    Delivery.deleteMany({}),
    Ledger.deleteMany({}),
  ]);
  console.log("Cleared existing data");

  // 2. Test user
  const passwordHash = await bcrypt.hash("test1234", 10);
  const user = await User.create({
    name: "Test User",
    email: "test@test.com",
    passwordHash,
  });
  console.log("Created user test@test.com / test1234");

  // 3. Five products with varied stock (opening stock set at creation)
  const products = await Product.create([
    { name: "Steel Bolt M6", sku: "BOLT-M6", category: "Fasteners", unit: "pcs", currentStock: 500, reorderThreshold: 100 },
    { name: "Copper Wire 2mm", sku: "WIRE-CU2", category: "Electrical", unit: "m", currentStock: 40, reorderThreshold: 50 }, // low stock
    { name: "PVC Pipe 1in", sku: "PIPE-PVC1", category: "Plumbing", unit: "pcs", currentStock: 120, reorderThreshold: 30 },
    { name: "Safety Gloves", sku: "GLOVE-STD", category: "Safety", unit: "pair", currentStock: 0, reorderThreshold: 20 }, // out of stock
    { name: "LED Panel 40W", sku: "LED-40W", category: "Electrical", unit: "pcs", currentStock: 75, reorderThreshold: 25 },
  ]);
  console.log(`Created ${products.length} products`);

  // 4. Two receipts — one validated (stock up + ledger), one left as Draft (pending)
  const receipt1 = await Receipt.create({
    supplier: "Acme Supplies", product: products[1]._id, quantity: 200, status: "Draft", createdBy: user._id,
  });
  await Receipt.create({
    supplier: "Bolt Depot", product: products[0]._id, quantity: 1000, status: "Draft", createdBy: user._id,
  });
  // Validate receipt1 through the ledger service so stock + ledger stay consistent
  await applyStockChange(receipt1.product, "RECEIPT", receipt1.quantity, receipt1._id);
  receipt1.status = "Done";
  receipt1.validatedAt = new Date();
  await receipt1.save();
  console.log("Created 2 receipts (1 validated, 1 Draft)");

  // 5. One delivery — validated (stock down + ledger)
  const delivery1 = await Delivery.create({
    customer: "BuildRight Co", product: products[2]._id, quantity: 20, status: "Draft", createdBy: user._id,
  });
  await applyStockChange(delivery1.product, "DELIVERY", -delivery1.quantity, delivery1._id);
  delivery1.status = "Done";
  delivery1.validatedAt = new Date();
  await delivery1.save();
  console.log("Created 1 delivery (validated)");

  console.log("Seed complete.");
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch(async (err) => {
  console.error("Seed failed:", err);
  await mongoose.connection.close();
  process.exit(1);
});
