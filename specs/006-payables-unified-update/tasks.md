# Tasks — 006 Payables unified update

> Red → Green → Refactor. Frontend only (`apps/web`).

## Frontend

- **T-001 [FE] — Spec `usePayableMutation`** ✅
  - Awaits `updateTransactionAsync`; invalidates `budget` + `transactions`; propagates errors.
  - File: `apps/web/src/components/budget/hooks/usePayableMutation.test.ts`

- **T-002 [FE] — Implement `usePayableMutation`** ✅
  - Depends: T-001
  - File: `usePayableMutation.ts`

- **T-003 [FE] — Expose `updateTransactionAsync` em `useTransactions`** ✅
  - Depends: T-002
  - File: `apps/web/src/hooks/useTransactions.ts`

- **T-004 [FE] — Spec `usePayableActions`** ✅
  - Toggle once → one API call; save value once; `card-*` not toggleable; invalid value no API.
  - File: `usePayableActions.test.ts`

- **T-005 [FE] — Implement `usePayableActions`** ✅
  - Depends: T-004, T-002
  - File: `usePayableActions.ts`

- **T-006 [FE] — Migrar `PayablesSection`** ✅
  - Depends: T-005
  - Remove imports de hooks legados.

- **T-007 [FE] — Remover hooks legados** ✅
  - Delete `useEditableValue.ts`, `usePayableStatus.ts`
  - Depends: T-006

## Validação

- **T-008 [FE] — Quality gates** (parcial)
  - `yarn vitest run src/components/budget/hooks/` ✅ 8/8
  - `yarn typecheck` ⚠️ falha pré-existente em `useDecisionEngineEvaluateAuto.test.tsx` (`issue_drivers` ausente), não relacionada a 006
  - `yarn lint` — rodar localmente se necessário
