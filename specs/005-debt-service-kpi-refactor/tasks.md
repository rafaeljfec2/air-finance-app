# Tasks — 005 Debt Service KPI Refactor

> Each task follows Red → Green → Refactor. Every task starts by writing a failing spec before touching production code.

## Backend (`back-end-financeiro-nestjs`)

- **T-001 — Spec for `IndebtednessService.calculateMonthlyDebtService()`**
  - Cover: installments-only, installments + revolving (with and without interest data), overdraft, zero income.
  - File: `src/indebtedness/indebtedness.service.spec.ts` (new `describe` block).

- **T-002 — Implement `calculateMonthlyDebtService(companyId, referenceDate?)`**
  - Returns `{ totalMonthlyDebtService: number, monthlyRevenue: number, percentage: number, components: { installments, revolvingCreditEstimate, overdraftEstimate } }`.
  - Revolving estimate: `15% * overdueInvoiceBalance` when interest data unavailable.
  - Reuse `InstallmentsSnapshotService` for installments (inject via constructor).

- **T-003 — Composer spec with new KPI**
  - `mapDebtServiceLevel`: new thresholds (`>= 40` alert, `>= 25` warn).
  - `optionalDebtService`: receives `MonthlyDebtServiceDto` instead of `DebtToRevenueDto`.

- **T-004 — Update composer**
  - `DecisionEngineSources.debtToRevenue` replaced by `monthlyDebtService` (internal interface).
  - `composer.composeBundle` calls `calculateMonthlyDebtService` instead of `calculateDebtToRevenue` for the engine.
  - `DebtToRevenueDto` remains on `IndebtednessService` for other screens.

- **T-005 — Update `decision-engine` specs that mock `debt_service_to_income`**
  - `primary-issue.resolver.spec.ts`, `theme-phase.resolver.spec.ts`, `decision-engine.service.spec.ts`, `complete-plan.service.spec.ts`.
  - Ensure mocked values reflect cash-flow semantics (0 to ~0.5), not stock.

- **T-006 — Bump narrative `agentVersion`**
  - In `LLMNarrativeService` (or where defined), increment version to invalidate cache.
  - Spec ensures cache key changes.

- **T-007 — Smoke boot test** (lesson from 004)
  - Confirm via real `nest start` (not only `Test.createTestingModule`) that the module boots without errors.

- **T-008 — Add caption in Swagger DTO**
  - `CompletePlanNumbersDto`: `committedPct` description clarifying composition.

## Frontend (`air-finance-app/apps/web`)

- **T-009 — Explanatory caption on `CompletePlanNumbersCard`**
  - Short secondary text below "Today you commit X%" such as "includes installments + card interest + overdraft".
  - Updated snapshot/test spec.

## Final validation

- **T-010 — Quality gates**
  - `yarn lint` + `yarn test` + `yarn build` on backend.
  - `yarn lint` + `yarn typecheck` on web monorepo.
  - Real `nest start` boots without error.
  - Browser E2E: my user (11% installments) moves from `Critical` to `OK`/`Attention` with coherent narrative.

## Do not do in this phase

- Do not touch `IndebtednessController` (HTTP route `/debt-to-revenue` stays intact).
- Do not create parallel KPI `total_debt_to_monthly_income` (spec decision).
- Do not create a feature flag (direct rollout, spec decision).
- Do not notify users about re-classification.
