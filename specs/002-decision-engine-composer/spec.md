# Feature: Decision Engine — Automatic composer (snapshot → `DecisionEngineInput`)

Build the **`DecisionEngineInput`** used by the financial decision engine from **real data** already available in the API (transactions, accounts, cards, summaries), **without** reimplementing the deterministic prioritization/action logic of `DecisionEngineService`.

## User Stories

- **US-1 — One call to decide**  
  As a product integrator, I want an endpoint that **evaluates the decision** from company context and period, **without** manually building the KPI map on the client.

- **US-2 — Single metrics source**  
  As a maintainer, I want the composer to **reuse** services already responsible for metrics (e.g., indebtedness, dashboard summary) so **business calculations already consolidated are not duplicated**.

- **US-3 — Period transparency**  
  As an end user, I want the decision to use the **same reference month** as the financial view (YYYY-MM), aligned with what we already show on the dashboard.

- **US-4 — Separation of concerns**  
  As an architect, I want the composer **not** to apply FR-1 ladder, global status, or action selection — only **materialize** levels/values and completeness per the engine contract.

## Functional Requirements

**FR-1 — Input**  
The `evaluate-auto` endpoint accepts `companyId` (path) and **optional `referencePeriod` query** (`YYYY-MM`; omitted = current UTC month). In v1 the snapshot uses **fixed `viewMode` `cash_flow`** until a dedicated accrual pipeline exists.

**FR-2 — Data sources**  
Must fetch data via **existing services** (e.g., indebtedness metrics, dashboard summary and comparison, expense aggregations when needed for a KPI), in parallel when independent.

**FR-3 — Output**  
Produce a **`DecisionEngineInput`** compatible with the contract shared with the engine (`netIncomeMonth`, `kpis` with required `level` and `value`/`severityDistance` when applicable).

**FR-4 — KPI → level mapping**  
**Zone** rules (ok / warn / alert) for each KPI in the snapshot are **composer policy** (documented in the plan), aligned where possible with statuses already exposed by existing APIs; the engine **does not** reinterpret raw sources.

**FR-5 — Optional KPIs**  
Optional engine KPIs (e.g., `checking_runway_days`, `debt_service_to_income`) may **be missing** from the snapshot if data is insufficient; the engine already handles omission vs incompleteness.

**FR-6 — HTTP integration**  
Expose **`POST /companies/:companyId/decision-engine/evaluate-auto`** with the same read authentication/authorization as manual `evaluate`, returning the **same response shape** as the engine.

**FR-7 — No decision in composer**  
The composer **does not** invoke `primary_issue`, `status`, or action catalog rules outside `DecisionEngineService`.

## Non-Functional Requirements

**NFR-1 — Performance**  
Fetch sources **in parallel** when independent; latency acceptable for UX (on the order of hundreds of ms under normal conditions).

**NFR-2 — Observability**  
Optional structured log with `companyId`, `referencePeriod`, composer mapping version (no sensitive PII beyond already accepted ids).

**NFR-3 — Security**  
Respect **company scope** and the same permissions as the manual endpoint; do not accept `companyId` diverging from the path.

**NFR-4 — Testability**  
Pure mapping extracted to testable functions/classes with **fixtures**; endpoint integration tests with mocked dependencies.

## Out of Scope

- New KPI engine parallel to dashboard/indebtedness.
- Decision audit persistence (future phase).
- Front-end UI (separate sprint).
- `accrual` mode with different dashboard sources when the product does not yet expose parity — see plan.

## Open Questions

1. **`accrual` parity:** when exposed in the API, define distinct sources from the dashboard; until then the snapshot remains **`cash_flow` only** (no public parameter).
2. **Exact zone weights** for heuristically derived KPIs (e.g., `fixed_vs_variable_split` via categories) — calibrate with product after MVP.
