# Tasks — Complete Financial Plan

| ID | Status | Task |
| --- | --- | --- |
| T-001 | ✅ | Backend: `InstallmentsSnapshotService` + spec (generalizes `getActiveInstallments` for company) |
| T-002 | ✅ | Backend: pure `behavior-analyzer`, `projection-builder`, `personal-rules-builder` + specs |
| T-003 | ✅ | Backend: `LLMNarrativeService` with cache via `AgentInsight` + deterministic fallback + spec |
| T-004 | ✅ | Backend: `CompletePlanService` (composer), Controller, DTO, Module + specs + e2e |
| T-005 | ✅ | Backend: register `CompletePlanModule` in `app.module.ts` and validate Swagger |
| T-006 | ✅ | Frontend: `completePlanService` (Zod) + `useCompletePlan` + tests |
| T-007 | ✅ | Frontend: `DecisionCompletePlanSection` + sub-cards (Diagnosis, Numbers, Projection, Installments, Behavior, Rules, Outcome) with correct DS tokens + tests |
| T-008 | ✅ | Frontend: integrate section in `pages/decision/index.tsx` below PlaybookCard and extend Refresh button invalidation |
| T-009 | ✅ | Create `specs/004-complete-financial-plan/` (spec, plan, research, data-model, contracts, tasks) |
| T-010 | ✅ | Run lint/typecheck/tests on backend and frontend; visual validation mobile + dark |

---

## Acceptance criteria per task

- **T-001** — Snapshot groups by `baseDescription + accountId`, drops transactions without installment pattern, classifies `accountType` by account type, prioritizes by share. ≥ 5 tests.
- **T-002** — Pure functions with 100% tests for top categories, peak days, 30/60/90 projection, and rules by slug.
- **T-003** — Deterministic context hash, hit uses cache, miss persists with 7d TTL, fallback on invalid JSON and exception.
- **T-004** — Service orchestrates composer + engine + snapshot + analyzers + LLM, controller uses guards, DTO documented in Swagger, e2e validates shape and 400 on invalid format.
- **T-005** — `CompletePlanModule` listed in `app.module.ts`. Build passes. Endpoint appears in `/swagger`.
- **T-006** — `fetchCompletePlan` parses, sends `referencePeriod`, rejects invalid payload (Zod). 4+ vitest tests.
- **T-007** — Root component isolates loading/error/success. Correct DS tokens (no `text-foreground`, no `bg-muted`). Mobile-first. 5 tests.
- **T-008** — Section integrated after `DecisionPlaybookCard`. Refresh button invalidates `['decision-engine']` (covers auto + complete-plan).
- **T-009** — Folder `specs/004-complete-financial-plan/` with `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/openapi.yaml`, `contracts/complete-plan.types.ts`, `tasks.md`.
- **T-010** — `yarn lint` + `yarn typecheck` + test suites pass in both repos. Component snapshot on mobile (375px) and dark validated manually by team.
