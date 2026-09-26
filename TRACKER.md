# TRACKER.md — 8-Hour Build Tracker

Total budget: 8 hours. Times are targets, not hard walls — but if you blow past one by
more than 30 min, cut scope per RULES.md §6.

## Phase 0 — Setup (Target: 0:00–0:30 | 30 min)
- [ ] Init `server/` (Express, Mongoose, dotenv, cors, bcrypt, jsonwebtoken)
- [ ] Init `client/` (Vite + React)
- [ ] MongoDB connection working (Atlas or local)
- [ ] `.env` files created (PORT, MONGO_URI, JWT_SECRET, VITE_API_URL)
- [ ] Folder structure from RULES.md in place
- [ ] "Hello API" route + client fetch confirms full stack is connected

## Phase 1 — Auth (Target: 0:30–1:30 | 1 hr)
- [ ] User model
- [ ] POST /api/auth/signup (hash password, create user, return JWT)
- [ ] POST /api/auth/login (verify, return JWT)
- [ ] Auth middleware (verify JWT, attach req.user)
- [ ] Client: Signup page, Login page
- [ ] Client: AuthContext storing token, ProtectedRoute wrapper
- [ ] Manual test: signup → login → hit a protected route

## Phase 2 — Core Inventory API (Target: 1:30–3:30 | 2 hr)
- [ ] Product model + CRUD routes (create, list, update, delete)
- [ ] Ledger model + `ledgerService.js` (single stock-mutation entry point)
- [ ] Receipt model + routes (create, list, validate → calls ledgerService to +stock)
- [ ] Delivery model + routes (create, list, validate → calls ledgerService to -stock, blocks if insufficient)
- [ ] Dashboard route: aggregates KPIs (total products, total stock, low stock count, pending receipts/deliveries)
- [ ] Seed script (1 user, 5 products, a couple sample receipts/deliveries)
- [ ] Test every endpoint with Postman/curl before touching frontend

## Phase 3 — Frontend Foundation (Target: 3:30–4:30 | 1 hr)
- [ ] App layout: Navbar/sidebar with links (Dashboard, Products, Receipts, Deliveries, Ledger)
- [ ] Routing set up (React Router) with protected routes
- [ ] Axios instance with JWT interceptor
- [ ] Products page: list + create form working end-to-end

## Phase 4 — Frontend Core Screens (Target: 4:30–6:30 | 2 hr)
- [ ] Receipts page: list, create form, "Validate" button, status filter
- [ ] Deliveries page: list, create form, "Validate" button, status filter, insufficient-stock error shown
- [ ] Dashboard page: KPI cards + recent movements list
- [ ] Ledger page: full movement history table

## Phase 5 — Stretch Features (Target: 6:30–7:15 | 45 min, ONLY if P0 fully working)
- [ ] Internal Transfers (basic form + ledger entry, stock-neutral)
- [ ] Stock Adjustments (basic form + ledger entry)
- [ ] Low stock visual indicator on Products page
- [ ] Minor UI polish (loading states, empty states)

## Phase 6 — Demo Prep (Target: 7:15–8:00 | 45 min, NON-NEGOTIABLE, no new code)
- [ ] Refresh seed data so demo starts clean
- [ ] Write 5–7 line README (what it does, stack, how to run, what's stretch/not done)
- [ ] Rehearse 3-minute walkthrough: login → add product → receipt → delivery → dashboard → ledger
- [ ] Double-check .env / secrets aren't committed
- [ ] Final commit + push

---

## Running Log
_(fill in as you go — helps if you need to explain decisions later)_

| Time | Note |
|------|------|
| | |
