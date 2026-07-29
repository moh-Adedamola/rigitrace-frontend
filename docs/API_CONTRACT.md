# RigiTrace API Contract (Draft v0.1)

Share this file with your backend colleague. It's derived directly from
the Engineering Build Guide's Section 6 (Core Database Entities) and
Section 7 (MVP Roadmap). Treat it as a living document — whoever changes
a shape here should ping the other person.

Types referenced below live in `src/lib/types/entities.ts`.

## Conventions

- All endpoints are versioned: `/api/v1/...`
- All list endpoints support `?page=&limit=` and return:
```json
  { "data": [...], "page": 1, "limit": 20, "total": 137 }
```
- Timestamps are ISO 8601 UTC strings.
- Auth: Bearer JWT in `Authorization` header. Consumer-facing read endpoints
  (product lookup, verification) require **no auth** per PRD Stage 4.
- Errors follow:
```json
  { "error": { "code": "PRODUCT_NOT_FOUND", "message": "..." } }
```

## Stage 1 — Identity Layer

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/brands` | Register a brand (status: draft) |
| GET | `/api/v1/brands/:id` | Get brand detail |
| PATCH | `/api/v1/brands/:id/status` | Admin: approve/suspend/revoke |
| POST | `/api/v1/products` | Create product (requires approved brand) |
| GET | `/api/v1/products/:id` | Get product detail |
| GET | `/api/v1/products` | Search/list products |
| PATCH | `/api/v1/products/:id` | Update product → creates a ProductVersion, never overwrites |
| GET | `/api/v1/products/:id/versions` | Full version history |
| POST | `/api/v1/products/:id/images` | Upload product image(s) |

## Stage 2 — Evidence Layer

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/products/:id/evidence` | Submit evidence (immutable) |
| GET | `/api/v1/products/:id/evidence` | List all evidence for a product |

Evidence is **never** PATCHed or DELETEd. A correction is a new record with
`supersedes` pointing at the old one.

## Stage 3 — Trust Engine

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/products/:id/trust-score` | Latest trust score + explanation |
| GET | `/api/v1/products/:id/trust-score/history` | Historical scores |
| POST | `/api/v1/products/:id/trust-score/recalculate` | Admin/system trigger |

Every response **must** include `explanation` and `factors[]` — the
frontend will refuse to render a bare number (PRD Rule 2).

## Stage 4 — Consumer Experience (no auth)

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/verify?barcode=` or `?query=` | Consumer product lookup |
| POST | `/api/v1/reports` | Submit suspicious product report (no account needed) |

## Stage 5 — Retailer System

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/v1/retailers` | Register retailer |
| PATCH | `/api/v1/retailers/:id/status` | Admin approval |
| POST | `/api/v1/retailer-product-links` | Retailer links to an existing product |
| GET | `/api/v1/products/:id/retailers` | "Available at" list for a product page |

## Stage 6 — Case Management

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/reports` | Admin: list/filter reports |
| PATCH | `/api/v1/reports/:id` | Update status, add resolution |
| POST | `/api/v1/reports/:id/responses` | Brand responds to a report |

## Stage 7 — Admin / Event Log

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/events?entityType=&entityId=` | Audit trail for any entity |
| GET | `/api/v1/admin/dashboard-summary` | Counts for admin console |

## Open questions to resolve with backend

- [ ] Pagination cursor vs offset — offset assumed above, confirm.
- [ ] Image upload: direct-to-S3 presigned URL, or through the API?
- [ ] Trust score recalculation: synchronous or job-queued (webhook/poll)?
- [ ] Rate limiting on the no-auth `/verify` and `/reports` endpoints.