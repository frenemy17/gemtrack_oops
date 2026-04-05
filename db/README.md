# 🗄️ /db — Database Design & Backup

This folder contains the database schema definition, local backup, and documentation of GemTrack's PostgreSQL data model.

---

## Contents

| File | Description |
|---|---|
| `local_backup.sql` | SQL dump of the local PostgreSQL development database |
| `schema.prisma` *(in `/src/backend/prisma/`)* | The authoritative Prisma ORM schema defining all models and relationships |

---

## Database: PostgreSQL (hosted on Neon Cloud)

GemTrack uses **PostgreSQL** as its relational database, accessed via **Prisma ORM** with a strict repository pattern separating raw queries from business logic.

---

## Tables & Responsibilities

| Table | Purpose |
|---|---|
| `users` | Stores login credentials (email, hashed password, name) |
| `customers` | Customer profiles — name, phone, email, PAN, address |
| `items` | Jewelry inventory — HUID, SKU, purity, weight, charges, GST, `isSold` flag |
| `sales` | POS bill records — total amount, discount, payment status (PAID / PARTIAL / UNPAID) |
| `sale_items` | Line items per sale — links items to a sale with sold price snapshot |
| `payments` | Individual payment installments per sale (supports credit/partial payments) |
| `shop_profile` | Shop branding: name, GSTIN, address, phone |

---

## Key Design Decisions

### 1. `isSold` flag on Items
Each jewelry item has a boolean `isSold` field. Once sold, the `ItemRepository.delete()` override **blocks deletion** — enforcing a business rule that sold inventory records must be preserved for audit trails.

### 2. Snapshot Pricing on `sale_items`
The `sale_items` table stores the **price at time of sale** — not a reference to the current item price. This ensures historical bills remain accurate even if item data is later updated.

### 3. Cascade Deletes
`sale_items` and `payments` are configured with `onDelete: Cascade` from `Sale` — so deleting a sale cleans up all its child records automatically.

### 4. Singleton PrismaClient
The `PrismaClient` instance is exported as a module-level singleton from `prismaClient.js`. This prevents connection pool exhaustion in serverless environments (Vercel).

---

## Singleton Pattern (Design Pattern)

**Pattern:** Singleton
**File:** `src/backend/src/prismaClient.js`

```js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
```

**Why:** In a serverless deployment (Vercel), creating a new `PrismaClient` per request would rapidly exhaust the PostgreSQL connection pool. By exporting a single shared instance, all repositories and services reuse the same connection pool — a classic Singleton pattern solving a real production problem.
