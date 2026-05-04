# Research — Decision Engine Composer

## 1. KPI source strategy

| Approach | Pros | Cons |
| --- | --- | --- |
| **A — Reuse `IndebtednessService` + `DashboardService` + installment snapshot** | Consolidated metrics; debt service can use `totalMonthly` from one snapshot build | Mapping layer must stay versioned; installment semantics are narrower than “all future cash out” |
| **B — New Mongo aggregations only in composer** | Fine-grained control | Duplicates dashboard/indebtedness; high drift risk |
| **C — Persisted decision snapshots / event sourcing** | Audit trail, replay | Out of scope for v1 composer |

**Decision:** **A** for v1 (constitution: no parallel KPI engine in the monorepo client; API owns aggregates).

## 2. Exposing sources: `composeInput` vs `composeBundle`

| Approach | Pros | Cons |
| --- | --- | --- |
| **Single `composeInput`** | Minimal API surface | Complete plan would re-fetch or duplicate parallel calls |
| **`composeBundle` + `composeInput` thin wrapper** | One `Promise.all` load path; reconcile can diff bundle vs fresh diagnostic | Callers must treat bundle as sensitive (no logging full payloads) |

**Decision:** **`composeBundle`** as the canonical internal loader; **`composeInput`** returns `bundle.input` only for `evaluate-auto`.

## 3. Installment detection source

| Approach | Pros | Cons |
| --- | --- | --- |
| **Text regex only (`detectInstallment`)** | Matches imported OFX descriptions; no schema migration | Ignores `quantityInstallments` when text lacks `N/M` |
| **Text OR `quantityInstallments > 1`** | Broader coverage | Requires rules for conflicts, missing current/total, deduplication |
| **Structured-only** | Clean for analytics | Backfill / migration for legacy rows |

**Decision (v1):** **Text regex** remains the implementation; **reconcile endpoint** documents funnel counts so stakeholders can compare to Mongo. Product policy change → new spec/ADR, not silent composer tweak.

## 4. Reference period and “today” boundary

| Approach | Pros | Cons |
| --- | --- | --- |
| **UTC month default (`YYYY-MM`)** | Deterministic across regions; matches OpenAPI description | Installment “future” filter uses server local midnight in snapshot code — potential skew vs strict UTC cohorts in Atlas |
| **Company time zone** | UX-aligned “month” and “today” | Needs tenant TZ source of truth + tests |
| **Explicit `referenceStartOfDayUtc` everywhere** | Auditable single instant | Requires threading through all queries |

**Decision:** **v1** keeps **UTC `referencePeriod`** for dashboard alignment; **reconcile** exposes **`referenceStartOfDayUtc`** for DB validation. Long-term: unify “day boundary” in one helper (see open item in `spec.md` / backlog).

## 5. Deterministic `monthlyValue` per installment group

| Approach | Pros | Cons |
| --- | --- | --- |
| **Unsorted Mongo `find` (status quo risk)** | None for decision quality | Non-deterministic `monthlyValue` when multiple rows per group |
| **`.sort({ paymentDate: 1, _id: 1 })` + documented rule** | Reproducible | Requires index review |
| **Aggregate `$first` with explicit sort** | Same as sort in pipeline | Slightly more code |

**Recommendation:** **Sort + documented tie-break** (implementation backlog in API repo; tracked as quality gate for finance decisions).

## 6. Internal references

- `back-end-financeiro-nestjs/src/decision-engine/composer/decision-engine-composer.service.ts` — `composeBundle`, `loadSources`
- `back-end-financeiro-nestjs/src/decision-engine/composer/map-sources-to-input.ts` — `ComposerSourceBundle`, `mapSourcesToDecisionInput`
- `back-end-financeiro-nestjs/src/decision-engine/complete-plan/installments-snapshot.service.ts` — snapshot build
- `back-end-financeiro-nestjs/src/decision-engine/complete-plan/installments-reconcile.service.ts` — diagnostics
- `specs/001-financial-decision-engine/contracts/decision-engine.types.ts` — engine I/O
- `specs/004-complete-financial-plan/` — complete plan product spec and DTOs

## 7. External references

- NestJS custom providers & testing: https://docs.nestjs.com/fundamentals/custom-providers  
- OpenAPI 3.0 security schemes (cookie + bearer): https://swagger.io/specification/
