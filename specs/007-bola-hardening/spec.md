# Feature: BOLA Hardening — Multi-tenant Authorization

Eliminate Broken Object Level Authorization (BOLA / IDOR) across Air Finance deployables.

**Context:** OWASP API Top 10 #1. Authentication alone does not prevent cross-tenant access when resource IDs are manipulated.

**Repos:** `back-end-financeiro-nestjs`, `connexto-integration-bank`, `air-finance-app` (defense-in-depth paths).

---

## Invariants (Level 3)

1. Identity (`userId`, `companyId`, `tenantId`) comes from JWT or service token — never from client body/query for authorization decisions.
2. Single-object queries use scoped WHERE: `{ _id, companyId }` or `{ tenantId, itemId }`.
3. Deny with **404** when object exists but caller lacks ownership (avoid confirming existence).
4. Structural guards make the insecure path hard to forget.

---

## User Stories

- **US-1:** As tenant user A, I cannot access account/banking resources of company B by swapping `accountId`.
- **US-2:** As user A, I cannot read/update user B unless we share a company (or self).
- **US-3:** As user A, I cannot assign roles or cancel subscriptions belonging to user B.
- **US-4:** As Connexto tenant A, I cannot access Openi `itemId` owned by tenant B.
- **US-5:** Unauthenticated callers cannot access tenant admin, diagnostics, or legacy current-account APIs.

---

## Acceptance Criteria

1. All `/banking/accounts/:accountId/*` routes reject cross-company access with 404.
2. `GET/PUT /user/:id` enforce scoped access; `PUT company-role` requires company permission guard.
3. Notifications derive `userId` from JWT only.
4. Subscription checkout/cancel use authenticated user ownership.
5. `GET /companies` returns only caller's companies (god sees all).
6. Connexto tenant/diagnostics require service API key; Openi item endpoints validate tenant ownership.
7. Frontend banking paths include company scope where backend expects it.
8. BOLA matrix tests BOLA-01..BOLA-10 pass.

---

## Out of Scope

- BFLA-only issues (admin panel without role check unrelated to object IDs)
- Active pentest / JWT key rotation
- RBAC granularity for credit-cards/agents (phase 3 optional hardening)

---

## Quality Gates

- Backend: `yarn test`, `yarn lint`, `yarn build`
- Connexto: `yarn test`, `yarn lint`, `yarn build`
- Frontend: `yarn vitest run`, `yarn typecheck`, `yarn lint`
