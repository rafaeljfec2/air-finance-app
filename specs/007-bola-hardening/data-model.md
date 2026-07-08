# Data Model — BOLA Hardening

## Backend (MongoDB)

### User
- `companyIds: string[]` — tenants user belongs to
- `companyRoles: Map<companyId, role>` — per-company RBAC
- Source of truth for membership checks (from JWT payload, validated against DB on sensitive ops)

### Account
- `_id`, `companyId` — banking routes must resolve account and verify `companyId ∈ user.companyIds`

### CurrentAccount (legacy)
- `user: ObjectId` — scope by authenticated user id

### Subscription
- `userId` / provider subscription linked to user — cancel must match JWT user

### Notification
- `userId` — all reads/writes scoped to JWT user

## Connexto (PostgreSQL)

### Tenant
- `id` (UUID) — admin routes protected by service API key

### OpeniItemEntity
- Composite scope: `(tenantId, itemId)` — unique per tenant; cross-tenant item access must 404

## Authorization Flow

```
JWT → user.id + user.companyIds
accountId param → Account.findOne({ _id, companyId: { $in: companyIds } })
x-tenant-id + itemId → OpeniItem.findOne({ tenantId, itemId })
```
