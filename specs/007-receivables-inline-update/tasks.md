# Tasks — 007 Receivables inline update

> Red → Green → Refactor. Frontend only (`apps/web`). SDD artifacts in this folder first.

## SDD (docs)

- **T-000 [DOCS] — Spec + plan + data-model + contracts + tasks** ✅
  - Files under `specs/007-receivables-inline-update/`

## Frontend (TDD)

- **T-001 [FE] — Spec `receivableUpdate.types`** ✅
  - Editability always true; status ↔ reconciled mapping.
  - File: `apps/web/src/components/budget/hooks/receivableUpdate.types.test.ts`

- **T-002 [FE] — Implement `receivableUpdate.types`** ✅
  - Depends: T-001
  - File: `receivableUpdate.types.ts`

- **T-003 [FE] — Spec `useReceivableActions`** ✅
  - Toggle once → one API call with `{ reconciled }`; save value once; invalid value no API; toasts.
  - File: `useReceivableActions.test.tsx`

- **T-004 [FE] — Implement `useReceivableActions`** ✅
  - Depends: T-003, T-002
  - Reuses `usePayableMutation`
  - File: `useReceivableActions.ts`

- **T-005 [FE] — Spec `ReceivablesSection` interaction** ✅
  - Badge clickable for PENDING; double-click value enters edit mode.
  - File: `ReceivablesSection.test.tsx`

- **T-006 [FE] — Implement editable `ReceivablesSection`** ✅
  - Depends: T-005, T-004
  - Replace SectionTable with ReceivableRow / ReceivablesTable
  - File: `ReceivablesSection.tsx`

## Validação

- **T-007 [FE] — Quality gates** ✅
  - Vitest: types + actions + section — 13/13
  - `tsc --noEmit` ✅
  - ESLint (changed files) ✅
  - Manual: `/budget` → Contas a Receber → toggle + edit value (pendente)