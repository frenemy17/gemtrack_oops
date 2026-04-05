# 📄 /docs — Project Documentation

This folder contains all written documentation for the GemTrack project, intended for academic submission and developer onboarding.

---

## Contents

| File | Description |
|---|---|
| `project_overview.md` | Full project overview: problem statement, target users, key features, and system goals |

---

## OOP Concepts Used

GemTrack's backend is strictly architected around the **4 pillars of Object-Oriented Programming**:

### 1. Abstraction
- `BaseRepository` and `BaseService` act as **abstract base classes**.
- They define contracts (method signatures like `findAll()`, `validate()`, `execute()`) without exposing internal complexity.
- Direct instantiation is blocked: `if (new.target === BaseRepository) throw new Error(...)`.

### 2. Encapsulation
- Private fields (`#prisma`, `#itemRepo`, `#customerRepo`) and private methods (`#calculatePaymentStatus()`, `#buildSearchFilter()`, `#generateBillNumber()`) in `SaleService` and `ItemRepository` hide internal state from outside access.
- Only controlled public APIs expose functionality.

### 3. Inheritance
- `ItemRepository` and `CustomerRepository` both **extend `BaseRepository`**, inheriting `findById()`, `create()`, `update()`, and `delete()` without duplication.
- `SaleService` **extends `BaseService`**, inheriting the `_formatError()` utility and the abstract contract.

### 4. Polymorphism
- `ItemRepository` **overrides** `BaseRepository.findAll()` to add jewelry-specific filters (HUID, SKU, purity, category, metal, isSold).
- `ItemRepository` **overrides** `BaseRepository.delete()` to enforce a business rule: sold items cannot be deleted.

---

## Design Pattern Identified: Repository Pattern

**What it is:** The Repository Pattern abstracts the data access layer, decoupling business logic from database queries.

**How it's used in GemTrack:**
- `BaseRepository` defines generic CRUD operations using Prisma ORM.
- `ItemRepository` and `CustomerRepository` extend it with domain-specific query logic.
- Controllers and services never talk directly to Prisma — they always go through a repository class.

**Why it matters:** If the database or ORM is ever swapped (e.g., from Prisma to TypeORM), only the repository layer needs to change — not the controllers or services.

---

## SDLC Model: Iterative & Incremental

GemTrack was built using an **Iterative and Incremental SDLC**:

| Phase | What Happened |
|---|---|
| **Iteration 1 (MVP)** | Procedural Express.js backend — basic CRUD for items and customers |
| **Iteration 2** | Sales, billing, payment tracking, and customer linking added |
| **Iteration 3 (OOP Refactor)** | Full refactor to OOP: BaseRepository, BaseService, Repository Pattern, Singleton, Dependency Injection |
| **Iteration 4 (Polish)** | Server-side pagination, analytics dashboard, live gold/silver rate integration |

Each iteration delivered a working, testable version that was progressively improved — aligning with real-world Agile practices.
