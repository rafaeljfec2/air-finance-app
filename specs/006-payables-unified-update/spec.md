# Feature: Unified mutations — Accounts payable (expanded modal)

Fix duplicated logic and silent failures in **update status** (Paid/Pending) and **edit value** actions in the budget **Accounts Payable** section (`PayablesSection` / `BudgetExpandedModal` modal).

**Context:** users must click **twice** for status or value to persist. Root cause: `useEditableValue` and `usePayableStatus` call `updateTransaction` via `mutate` (fire-and-forget) wrapped in `await Promise.resolve(...)`, which **does not await** the mutation. Both hooks also duplicate cache invalidation, toasts, and `useTransactions` wiring.

**Assumed prerequisites:**

- Existing endpoint `PATCH /companies/:companyId/transactions/:id` (via `transactionService.updateTransaction`).
- Recurring account payables map to `Transaction.reconciled`; credit card invoices (`id` prefix `card-`) are not toggleable.
- Query keys: `['budget', companyId]`, `['transactions', companyId]`.

---

## Product decisions (v1) — closed

| Theme | Decision |
| --- | --- |
| Scope | Frontend only (`apps/web`); no REST contract changes |
| UX status | One click toggles Paid ↔ Pending and reflects immediately after success |
| UX value | Double-click → edit → blur/Enter persists on the **first** attempt |
| Credit card invoices | Remain read-only for status (`card-` prefix) |
| Toasts | Keep distinct feedback per action (value vs status), centralizing only the mutation |
| Rollout | Direct replacement of duplicated hooks; no feature flag |

---

## User Stories

- **US-1 — One click, one action**
  As a budget user, I want to mark an account as paid with a single click, without repeating the action.

- **US-2 — Value persists on the first try**
  As a user, I want to edit a payable amount and see the updated total after saving once (blur or Enter).

- **US-3 — Code without duplication**
  As a developer, I want a single mutation function for payables so cache invalidation and error handling are not repeated across two hooks.

---

## Acceptance criteria

1. Given a pending recurring payable, clicking the "Pending" badge changes status to "Paid" on the **first interaction** and the group total recalculates after refetch.
2. Given a payable with an editable value, changing the value and pressing Enter (or blur) persists the new value on the **first attempt** and updates the total.
3. Given a payable with id `card-*`, the status badge stays non-clickable.
4. `useEditableValue` and `usePayableStatus` are replaced by a unified hook (or composed pair with shared mutation) without duplicating invalidation/toasts/mutation wiring.
5. Unit tests cover: real mutation await, invalidation of `budget` + `transactions`, status toggle, value save, non-toggleable id.
6. `yarn typecheck` and `yarn lint` pass; Vitest hook tests are green.

---

## Out of scope (v1)

- Inline status/value editing on the compact `PayablesCard` (stays read-only).
- Backend: new endpoints or fields.
- Optimistic updates (possible follow-up).
- Editing credit card invoices via the credit-cards API.

---

## Quality gates

- `yarn typecheck` ✅
- `yarn lint` ✅
- Vitest: unified hook + PayablesSection regression (if applicable) ✅
- Manual validation: "Accounts Payable" modal — toggle status and edit value with one click/attempt each
