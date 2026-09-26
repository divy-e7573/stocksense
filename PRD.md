# PRD.md — StockSense (MERN MVP, 8-Hour Hackathon Build)

## 1. Context
Odoo-style hackathon problem statement: build a modular Inventory Management System (IMS)
that digitizes stock operations (receipts, deliveries, transfers, adjustments) with a
real-time dashboard. Original spec is enterprise-scale — this PRD scopes it down to what's
**actually buildable and demoable in 8 hours** with MERN.

## 2. MVP Goal
A working app where a logged-in user can:
1. Add/manage products
2. Receive stock (increases inventory)
3. Deliver stock (decreases inventory)
4. See a dashboard with live KPIs
5. See a full stock movement ledger (audit trail)

That's the demo. Everything else is stretch.

## 3. In-Scope Features (P0 — must ship)

### 3.1 Auth
- Signup (name, email, password)
- Login (JWT-based)
- Protected routes (no OTP reset — cut for time)

### 3.2 Products
- Create product: name, SKU, category, unit of measure, opening stock, reorder threshold
- List products with current stock, search by name/SKU
- Edit / delete product

### 3.3 Receipts (Incoming Stock)
- Create receipt: supplier name (free text), product, quantity, status (Draft → Done)
- On "Validate": stock increases, ledger entry created
- List all receipts with status filter

### 3.4 Delivery Orders (Outgoing Stock)
- Create delivery: customer name (free text), product, quantity, status (Draft → Done)
- On "Validate": stock decreases (block if insufficient stock), ledger entry created
- List all deliveries with status filter

### 3.5 Dashboard
- KPI cards: Total Products, Total Stock Units, Low Stock Count, Pending Receipts, Pending Deliveries
- Recent stock movements (last 10, from ledger)

### 3.6 Stock Ledger (Move History)
- Auto-logged, read-only table: product, type (Receipt/Delivery/Adjustment/Transfer), qty change, resulting stock, timestamp, user

## 4. Stretch Features (P1 — only if P0 is done with time left)
- Internal Transfers (location A → location B, stock-neutral)
- Stock Adjustments (manual correction of counted vs recorded stock)
- Low stock email/alert banner
- Multi-warehouse (single warehouse assumed for MVP; field exists but UI doesn't branch on it)
- OTP password reset

## 5. Explicitly Out of Scope (do not build, do not gold-plate)
- Multi-warehouse routing logic
- Role-based permissions (Inventory Manager vs Warehouse Staff — single role for MVP)
- Reordering rules automation
- Advanced smart filters / saved views
- File uploads (product images)
- Notifications system beyond a simple banner

## 6. Tech Stack
- **Frontend:** React (Vite), React Router, Axios, plain CSS or Tailwind (whichever you're faster in)
- **Backend:** Node.js, Express
- **DB:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt
- **State:** React Context or simple prop drilling (no Redux — not worth the setup time)

## 7. Data Models (high-level)

**User:** name, email, passwordHash, createdAt

**Product:** name, sku, category, unit, currentStock, reorderThreshold, createdAt

**Receipt:** supplier, product (ref), quantity, status, validatedAt, createdBy

**Delivery:** customer, product (ref), quantity, status, validatedAt, createdBy

**Ledger:** product (ref), type (RECEIPT/DELIVERY/ADJUSTMENT/TRANSFER), quantityChange, resultingStock, timestamp, refId (points to source doc)

## 8. Success Criteria for Demo
- [ ] Can sign up and log in
- [ ] Can create a product and see it listed
- [ ] Can create + validate a receipt → stock goes up, ledger entry appears
- [ ] Can create + validate a delivery → stock goes down, ledger entry appears
- [ ] Dashboard KPIs update live and match reality
- [ ] Insufficient-stock delivery is blocked with a clear error
- [ ] No crashes during a 3-minute live walkthrough
