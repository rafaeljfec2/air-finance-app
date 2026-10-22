# Implementation plan — Complete Financial Plan

> Mirrors the executed plan (no frontmatter). Preserves delivery history.

## Architecture (hybrid)

```
UI (DecisionPage)
  └── GET evaluate-auto  → DecisionEngine
  └── GET complete-plan  → CompletePlanController
                              └── CompletePlanService (deterministic)
                                    ├── DecisionEngineComposerService → DecisionEngineService
                                    ├── InstallmentsSnapshotService
                                    ├── DashboardService (summary, expensesByCategory)
                                    ├── IndebtednessService
                                    └── LLMNarrativeService → InsightCache + LLMProvider (gpt-4o-mini)
```

- **Deterministic**: numbers, phases, projection, installments, rules, behavior.
- **LLM**: only `diagnosis` and `expectedOutcome`. Cached in `AgentInsight` by context hash (7-day TTL).
- **UI**: new lazy-loaded section below `DecisionPlaybookCard`.

---

## Backend — `back-end-financeiro-nestjs`

### Structure

`src/decision-engine/complete-plan/`

```
complete-plan.module.ts
complete-plan.controller.ts (+ spec)
complete-plan.service.ts    (+ spec)
installments-snapshot.service.ts (+ spec)
llm-narrative.service.ts    (+ spec)
dto/
  complete-plan-query.dto.ts
  complete-plan-response.dto.ts
domain/
  complete-plan.types.ts
  behavior-analyzer.ts        (+ spec)
  projection-builder.ts       (+ spec)
  personal-rules-builder.ts   (+ spec)
prompts/
  complete-plan.prompt.ts
```

### Endpoint

`POST /meu-financeiro/v1/companies/:companyId/decision-engine/complete-plan?referencePeriod=YYYY-MM`

- Guards: `JwtAuthGuard` + `CompanyPermissionGuard` (`Permission.INDEBTEDNESS_READ`).
- Response: `CompletePlanResponseDto` with full Swagger.

### Technical decisions

- **InstallmentsSnapshotService** generalizes `getActiveInstallments` (previously card-only) for the whole company. Uses `detectInstallment` (existing parser) and categorizes priority by installment `share` of monthly total.
- **BehaviorAnalyzer** pure: top 3 categories by share + days with spend ≥ 1.5× current month daily average. `creditUtilizationTrend` always `null` in V1.
- **ProjectionBuilder** pure: subtract installments ending in 30/60/90 days.
- **PersonalRulesBuilder** pure: anchor rule per `primary_issue` + extras when early-month peak signals or credit utilization ≥ 60%.
- **LLMNarrativeService**: cache via `InsightCacheService.findValid`. Hash combines `primary_issue`, `theme_phase`, period, discrete committed-% buckets, and top category names. Persists via `AgentInsight.create` with `expiresAt = now + 7 days`. Deterministic fallback per `primary_issue` if LLM fails or returns invalid JSON.

### App integration

`CompletePlanModule` is imported in `app.module.ts` next to `DecisionEngineModule`. Imports `DecisionEngineModule`, `DashboardModule`, `IndebtednessModule`, `PermissionModule`, `UserModule` and exposes `LLMProviderService` + `InsightCacheService` locally (`AgentInsight` schema registered via `MongooseModule.forFeature`).

### Tests

- Unit (Jest): 34 tests covering all pure functions, snapshot, narrative service (cache hit/miss, fallback, deterministic hash), and composer service.
- E2E (Jest + supertest): contract and DTO validation.
- `test/jest-e2e.json` received `moduleNameMapper` to resolve `@/` alias (pre-existing fix that also unblocked `decision-engine-evaluate-auto.e2e-spec.ts`).

---

## Frontend — `air-finance-app/apps/web`

### Service + hook

- `src/services/completePlanService.ts` — `fetchCompletePlan` + `CompletePlanResponseSchema` (Zod).
- `src/hooks/useCompletePlan.ts` — `useQuery` with `staleTime: 5min`, `gcTime: 30min`, `queryKey: ['decision-engine', 'complete-plan', companyId, period]`.

### Components

`src/pages/decision/components/complete-plan/`

```
DecisionCompletePlanSection.tsx (+ test)
CompletePlanDiagnosis.tsx
CompletePlanNumbersCard.tsx
CompletePlanProjectionCard.tsx
CompletePlanInstallmentsCard.tsx
CompletePlanBehaviorCard.tsx
CompletePlanRulesCard.tsx
CompletePlanOutcome.tsx
copy.ts
format.ts
```

- **DS tokens** strictly from project (`bg-card`, `text-text`, `border-border` + `*-dark` variants; semantic `red-500/amber-500/primary-500` with dark fallback `*-400` or `*-950/30`).
- Mobile-first, `space-y-4`, `px-4 sm:px-6`, touch targets ≥ 44px.
- States: loading (Spinner), error (Card + retry), `data_incomplete` uses same render because backend already returns textual fallback.

### Integration

- `pages/decision/index.tsx` renders `<DecisionCompletePlanSection companyId={companyId} />` after `<DecisionPlaybookCard />`.
- Refresh button invalidates `['decision-engine']` (single prefix — covers `evaluate-auto` and `complete-plan`).

### Tests (Vitest)

- `completePlanService.test.ts`: parse, query param, invalid payload rejection, `data_incomplete`.
- `DecisionCompletePlanSection.test.tsx`: loading, error, full data, empty installments, no fetch when `companyId` empty.

---

## Quality gates

- Backend: `yarn jest src/decision-engine/complete-plan --runInBand --testTimeout=60000` (34/34 ✓), e2e (2/2 ✓), clean `tsc --noEmit`, clean `eslint --fix`.
- Frontend: vitest 9/9 ✓, clean `tsc --noEmit`, clean eslint.

---

## V1 limitations (declared)

- `creditUtilizationTrend = null` (no intra-month series).
- `peakDaysOfMonth` based **only** on current month.
- LLM cached 7 days by `contextHash`. Subtle input changes that do not alter `primary_issue/theme_phase/levels` reuse narrative.
- Installment list limited to end date ≤ 12 months.
