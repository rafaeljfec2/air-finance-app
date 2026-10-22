# Tasks — Decision Engine (`001-financial-decision-engine`)

**Target repo:** `back-end-financeiro-nestjs`  
**Inputs:** `spec.md` v0.2, `plan.md`, `data-model.md`, `contracts/`  
**Convention:** TDD required on the backend — failing test before production code for each component.

---

## Domain — deterministic core

### T1 — [BE] Constants and ladder order

**Description:** Create `src/decision-engine/domain/constants.ts` with `RULE_ENGINE_VERSION`, ordered FR-1 ladder steps (pairs: `PrimaryIssue` slug + KPI ids), `KPI_LEX_ORDER` for FR-2 tie-break, and FR-6 factors (fixed integers v1).

**Acceptance criteria:**
- Single semantic version export consumed by logs and optional response.
- Ladder order matches `plan.md` §3 (includes `high_commitment`, `low_surplus`).
- No conditional logic beyond static data.

**Dependencies:** —  
**Effort:** S

---

### T2 — [BE] Internal types aligned with contract

**Description:** Add `src/decision-engine/domain/decision-engine.types.ts` (or re-export from `contracts/`) mirroring SDD `contracts/decision-engine.types.ts` — `DecisionEngineInput`, `DecisionEngineOutput`, `KpiSnapshot`, enums.

**Acceptance criteria:**
- Strict TypeScript, no `any`.
- Types used by all module services.

**Dependencies:** T1  
**Effort:** S

---

### T3 — [BE] `CompletenessEvaluator` + unit tests

**Description:** Implement FR-0 evaluation per `data-model.md` §3 (C1–C9); return `{ complete: boolean; reasons: string[] }` with KPI ids or `data_quality`.

**Acceptance criteria:**
- Cases: null or ≤0 income → incomplete; missing mandatory KPI → incomplete; optional `checking_runway_days` / `debt_service_to_income` absent → still complete.
- `*.spec.ts` covers full happy path + 3 distinct failures.

**Dependencies:** T2  
**Effort:** M

---

### T4 — [BE] `PrimaryIssueResolver` + unit tests

**Description:** Given complete input and KPI→level map, return first `primary_issue` on the ladder with `warn` or `alert`; FR-2 tie-break by `severityDistance` desc; tie → `KPI_LEX_ORDER`.

**Acceptance criteria:**
- `monthly_cash_flow` alert without runway → `liquidity_risk`.
- Only `credit_utilization_index` alert → `credit_overuse`.
- Two KPIs same step → reproducible deterministic tie-break in test.
- Missing optional KPI on step → skip step (e.g. no `debt_service_to_income` → do not pick `debt_pressure` for that step).

**Dependencies:** T1, T2  
**Effort:** M

---

### T5 — [BE] Static PT-BR action catalog

**Description:** Implement `domain/catalog/action-catalog.ts` with templates from `data-model.md` §4 matrix (placeholders `{amount}`, `{pct}`, `{days}`).

**Acceptance criteria:**
- Cover all `primary_issue` values; `healthy` shares entry with dedicated 1 micro-action catalog.
- Pure function listing candidates by slug with no I/O.

**Dependencies:** T1  
**Effort:** M

---

### T6 — [BE] `ActionGeneratorService` + unit tests

**Description:** Select up to 3 actions per `primary_issue`, filter by KPIs in `warn`/`alert` per template `reason`; parameterize `impact`; ensure exactly 1 action for `healthy` and `data_incomplete`.

**Acceptance criteria:**
- `credit_overuse` with only row 2 applicable → returns ≤3 valid items.
- `impact` uses numeric input when rule defined; otherwise qualitative text allowed by spec.
- Tests: `healthy` → length 1; `data_incomplete` → length ≥1 without invented R$.

**Dependencies:** T2, T5  
**Effort:** M

---

### T7 — [BE] `StatusResolver` + unit tests

**Description:** Implement FR-13: `critical` for alert on levels 1–3 or `monthly_cash_flow` alert; `attention` for warn/alert levels 4–7 without critical; `healthy` all ok; FR-0 → `attention` short-circuited first (caller contract).

**Acceptance criteria:**
- Case matrix covered in unit tests (minimum 5 scenarios).

**Dependencies:** T1, T2  
**Effort:** S

---

### T8 — [BE] `DecisionEngineService` (orchestration) + unit tests

**Description:** Flow: `CompletenessEvaluator` → if false build FR-0 output (`primary_issue`, `status`, actions); else `PrimaryIssueResolver` → if implicit theme “all ok” use `healthy` → `StatusResolver` → `ActionGeneratorService`. Inject dependencies via Nest constructor.

**Acceptance criteria:**
- **Required test scenarios:** `data_incomplete`; `healthy` (1 action); negative flow / liquidity → `liquidity_risk` + `critical` or `attention` per levels; **high credit** → `credit_overuse`.
- Same input → same output (determinism).
- **Application facade omitted** if service is sole entrypoint (per plan).

**Dependencies:** T3, T4, T6, T7  
**Effort:** M

---

## HTTP interface — DTO and controller

### T9 — [BE] Request/response DTOs + validation

**Description:** `dto/decision-engine-request.dto.ts` and `decision-engine-response.dto.ts` with `class-validator` / `class-transformer`; mirror OpenAPI `contracts/openapi.yaml`; `@ApiProperty` on public fields.

**Acceptance criteria:**
- `referencePeriod` validatable format (`YYYY-MM`).
- `kpis` as object with validated values (level required per present entry).
- Existing global ValidationPipe rejects invalid body with 400.

**Dependencies:** T2  
**Effort:** M

---

### T10 — [BE] Thin `DecisionEngineController`

**Description:** `POST companies/:companyId/decision-engine/evaluate` — apply `JwtAuthGuard`, `CompanyGuard`, permission guards aligned with similar routes (`indebtedness`, `dashboard`); build `DecisionEngineInput` from path `companyId` + body; call `DecisionEngineService.evaluate`; return response DTO.

**Acceptance criteria:**
- Zero business branches in controller.
- Swagger `@ApiTags`, `@ApiOperation`, `@ApiResponse`.
- 403 when user does not belong to company.

**Dependencies:** T8, T9  
**Effort:** M

---

## Infrastructure — module and observability

### T11 — [BE] `DecisionEngineModule` + `AppModule` registration

**Description:** Declare providers (`CompletenessEvaluator`, `PrimaryIssueResolver`, `StatusResolver`, `ActionGeneratorService`, `DecisionEngineService`), controller, exports if needed for future composer.

**Acceptance criteria:**
- App boots without DI error.
- No circular import with Dashboard (engine does not import heavy feature).

**Dependencies:** T10  
**Effort:** S

---

### T12 — [BE] Structured logs (Pino)

**Description:** At end of `DecisionEngineService.evaluate`, log `info` with `ruleEngineVersion`, `companyId`, `primary_issue`, `status`, `{ kpiId, level }` array, `data_complete`; **do not** log PII or full payload — optional SHA-256 hash of canonical JSON if useful for support.

**Acceptance criteria:**
- Stable fields documented in brief comment or `plan.md` already covers — no secrets in log.
- Optional `debug` level with decision tree behind env `DEBUG_DECISION_ENGINE=true`.

**Dependencies:** T8  
**Effort:** S

---

## HTTP integration tests

### T13 — [BE] Controller integration tests

**Description:** `decision-engine.controller.integration.spec.ts` (or e2e in `test/`) with `@nestjs/testing` + supertest: mocked auth or project fixture; valid POST returns 200 and contract shape.

**Acceptance criteria:**
- At least one end-to-end test per scenario: `data_incomplete`, `healthy`, `credit_overuse` (alert).
- 400 validation for malformed body.

**Dependencies:** T11, T12  
**Effort:** M

---

## Documentation

### T14 — [DOCS] Update API routes

**Description:** In `back-end-financeiro-nestjs/docs/API_ROUTES.md` (or equivalent), document new endpoint, auth, and brief example.

**Acceptance criteria:**
- Link to global prefix `/meu-financeiro/v1`.

**Dependencies:** T10  
**Effort:** S

---

## Follow-up (outside this MVP list)

| Item | Note |
| --- | --- |
| Automatic composer | Service building `DecisionEngineInput` from `Dashboard`/`Indebtedness` — separate task after pure engine MVP. |
| `DecisionAuditLog` persistence | Optional phase 2. |
| Frontend | Consume endpoint on decision screen — `[FE]` in later sprint. |

---

## Suggested execution order

```
T1 → T2 → T3 → T4 → T7 → T5 → T6 → T8 → T9 → T10 → T11 → T12 → T13 → T14
```

*(T7 before T6 to allow isolated status tests; T5 can parallelize with T3–T4 if needed.)*

---

## Summary by tag

| Tag | Tasks |
| --- | --- |
| [BE] | T1–T13 |
| [DOCS] | T14 |
| [FE] | — (later) |
| [DEVOPS] | — (no new secrets/env v1) |
