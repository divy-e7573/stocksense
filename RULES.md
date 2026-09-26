# RULES.md — Engineering Rules for the 8-Hour Build

Purpose: keep decisions fast and consistent so you (or your AI pair) never re-litigate
"how should we structure this" mid-hackathon. When in doubt, pick the option that ships
faster, not the "more correct" one.

## 1. Golden Rules
1. **Working > perfect.** A boring CRUD screen that works beats an elegant one that's half-built at hour 8.
2. **No new libraries after hour 5.** Lock your stack early; don't introduce Redux/GraphQL/whatever mid-build.
3. **Commit after every working feature**, not after every file. Small, working commits > giant risky ones.
4. **If a feature isn't in PRD.md's P0 list, don't build it** unless P0 is fully done and demoed end-to-end.
5. **Seed data early.** Have a script that creates 1 test user + 5 products so you're never demoing an empty DB.

## 2. Folder Structure
```
stocksense/
├── server/
│   ├── models/          # Mongoose schemas: User, Product, Receipt, Delivery, Ledger
│   ├── routes/           # auth.js, products.js, receipts.js, deliveries.js, dashboard.js
│   ├── controllers/       # business logic per route file
│   ├── middleware/        # auth.js (JWT check), errorHandler.js
│   ├── config/             # db.js
│   ├── seed.js
│   ├── server.js
│   └── .env
├── client/
│   ├── src/
│   │   ├── pages/          # Login, Signup, Dashboard, Products, Receipts, Deliveries, Ledger
│   │   ├── components/    # Navbar, KPICard, StatusBadge, ProtectedRoute
│   │   ├── context/          # AuthContext.jsx
│   │   ├── api/                # axios instance + api calls per resource
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
├── PRD.md
├── RULES.md
└── TRACKER.md
```

## 3. Backend Rules
- REST only. No GraphQL.
- Every route wrapped in try/catch → pass to a single centralized error handler.
- Auth middleware checks JWT from `Authorization: Bearer <token>` header.
- Stock mutation logic (increase/decrease) lives in **one place only** — a `ledgerService.js`
  helper called by receipts, deliveries, adjustments, transfers. Never mutate `currentStock`
  directly from a route handler.
- Validate quantity > 0 and, for deliveries, `currentStock >= requestedQty` before allowing "Validate".
- Use Mongoose schema validation for required fields; don't hand-roll validation.

## 4. Frontend Rules
- One `axios` instance in `api/axios.js` with baseURL from `.env`, JWT attached via interceptor.
- Pages fetch their own data with `useEffect`; no premature abstraction into custom hooks unless duplicated 3+ times.
- Forms: plain controlled components with `useState`. No form libraries.
- Show loading and error states minimally (a spinner text and a red error line is enough — no need for toast libraries unless already comfortable with one).
- Status badges (Draft/Waiting/Ready/Done/Canceled) — for MVP, just two real statuses: `Draft` and `Done`. Skip the rest.

## 5. Naming Conventions
- Mongo collections: lowercase plural (`products`, `receipts`, `deliveries`, `ledgers`)
- API routes: `/api/products`, `/api/receipts`, `/api/deliveries`, `/api/dashboard`, `/api/auth`
- React components: PascalCase file names matching component name
- Branch names (if using git branches): `phase-1-auth`, `phase-2-inventory-api`, etc. — optional if solo, useful if team.

## 6. Time-boxing Discipline
- If a task in TRACKER.md is taking 2x its estimate, STOP, cut scope, move on. Come back only if all P0 is done.
- Do not refactor working code during the hackathon. Note it, fix after submission if time allows.
- Reserve the **last 30–45 minutes** purely for: seed data refresh, demo script rehearsal, README write-up. No new features in that window.

## 7. Definition of Done (per feature)
A feature is "done" only when:
- [ ] API tested via Postman/Thunder Client or curl
- [ ] UI connected and shows real data (not mock data)
- [ ] Happy path works
- [ ] One obvious error case handled (e.g., insufficient stock, empty field)
