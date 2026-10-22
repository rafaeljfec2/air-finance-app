# Feature: Inline editing — Accounts receivable (expanded modal)

Add **update status** (Received/Pending) and **edit value** actions in the budget **Accounts Receivable** section (`ReceivablesSection` / `BudgetExpandedModal` modal), with UX parity to Accounts Payable (spec 006).

**Context:** The expanded Accounts Receivable modal is read-only. Users need to mark receivables as received and adjust amounts without leaving the budget. Accounts Payable already supports this flow via `usePayableActions` + `usePayableMutation`.

**Assumed prerequisites:**

- Existing endpoint `PATCH /companies/:companyId/transactions/:id` (via `transactionService.updateTransaction`).
- Receivables map to REVENUE transactions; `Transaction.reconciled` → UI status `RECEIVED` / `PENDING`.
- Query keys: `['budget', companyId]`, `['transactions', companyId]`.
- Reuse `usePayableMutation` (same payload `{ value?, reconciled? }` and cache invalidation).

**Reference:** `specs/006-payables-unified-update/`

---

## Product decisions (v1) — closed

| Theme | Decision |
| --- | --- |
| Scope | Frontend only (`apps/web`); no REST contract changes |
| UX status | One click toggles Received ↔ Pending and reflects after success |
| UX value | Double-click → edit → blur/Enter persists on the **first** attempt |
| Status colors | `warning` (Pending) / `success` (Received) — receivables identity |
| Editability | All budget receivables are editable (no `card-*` exclusion) |
| Toasts | Distinct feedback per action (value vs status) |
| Mutation | Reuse `usePayableMutation`; new `useReceivableActions` |
| Rollout | Direct; no feature flag |

---

## User Stories

- **US-1 — One click, one action**
  As a budget user, I want to mark a receivable as received with a single click on the badge.

- **US-2 — Value persists on the first try**
  As a user, I want to edit a receivable amount and see the updated total after saving once (blur or Enter).

- **US-3 — Parity without duplicating mutation**
  As a developer, I want to reuse the unified payables mutation for receivables without duplicating cache invalidation.

---

## Acceptance criteria

1. Given a pending receivable, clicking the "Pending" badge changes status to "Received" on the **first interaction** and the group total recalculates after refetch.
2. Given a receivable with an editable value, changing the value and pressing Enter (or blur) persists the new value on the **first attempt** and updates the total.
3. Distinct toasts for status ("Marked as received" / "Marked as pending") and value.
4. `useReceivableActions` reuses `usePayableMutation` without duplicating invalidation.
5. Unit tests cover: status toggle, value save, invalid value, awaiting the mutation.
6. Compact `ReceivablesCard` remains read-only.
7. `yarn typecheck` and `yarn lint` pass; Vitest tests are green.

---

## Out of scope (v1)

- Inline editing on the compact `ReceivablesCard` (stays read-only).
- Backend: new endpoints or fields.
- Optimistic updates.
- `/receivables` page.
- Generalizing payables/receivables hooks into a single generic hook.

---

## Quality gates

- `yarn typecheck`
- `yarn lint`
- Vitest: `useReceivableActions` + `ReceivablesSection` + types
- Manual validation: "Accounts Receivable" modal — toggle status and edit value
