# Tasks — Decision Engine Composer (`002-decision-engine-composer`)

**Inputs:** `spec.md`, `plan.md` (v0.2), `data-model.md`, `contracts/*`  
**Primary codebase:** `back-end-financeiro-nestjs` (`src/decision-engine/`). **Consumer:** `air-finance-app/apps/web` (decision UI).

## Baseline already delivered (do not re-implement)

- `mapSourcesToDecisionInput` + `COMPOSER_MAPPING_VERSION`
- `DecisionEngineComposerService` with `composeInput` / `composeBundle`, parallel `Indebtedness` + `Dashboard` + `InstallmentsSnapshotService`
- `POST .../decision-engine/evaluate-auto` (guards + query `referencePeriod`)
- `GET .../decision-engine/installments-reconcile` + `InstallmentsReconcileService` + DTOs/Swagger
- Unit/integration tests: composer, controller `evaluate-auto`, reconcile, complete-plan wiring (verify green on branch)

Use the sections below for **closure, hardening, product alignment, and docs**.

---

## Backend [BE]

### T1 [BE] — Deterministic installment snapshot cursor

- **Description:** In `InstallmentsSnapshotService`, ensure stable sort on Mongo reads (e.g., `.sort({ paymentDate: 1, _id: 1 })`) and document in a minimal comment or internal doc which transaction defines `monthlyValue` when multiple rows exist in the same group (`baseDescription::accountId`).
- **Acceptance:**
  - Test reproduces two future transactions in the same group with different `monthlyValue` and asserts a **fixed expected value** after the chosen rule.
  - `explain` or PR note confirms compatible index use (e.g., `companyId` + `paymentDate` + `launchType` if applicable).
- **Dependencies:** —
- **Effort:** M

### T2 [BE] — Align “start of day” snapshot vs reconcile vs Atlas

- **Description:** Centralize “reference day start” helper (documented UTC vs company TZ — see `research.md`); use the same instant in snapshot `paymentDate` filter and reconcile hints `referenceStartOfDayUtc` / `suggestedMongosh`.
- **Acceptance:**
  - Edge test: transaction on UTC/local boundary does not flip inclusion without a test covering the case.
  - `installments-reconcile` and snapshot use the **same** helper (no duplicated scattered `setHours`).
- **Dependencies:** —
- **Effort:** L *(if policy is “UTC only”, can drop to M — cut scope in PR)*

### T3 [BE] — Composer observability (installment aggregates)

- **Description:** Extend structured log in `composeBundle` / `loadSources` with **aggregated** installment counts (`items.length`, `totalMonthly`) without raw transaction payload.
- **Acceptance:** Log at `log`/`debug` per project policy; no PII beyond ids already used.
- **Dependencies:** —
- **Effort:** S

### T4 [BE] — API route documentation

- **Description:** Update `back-end-financeiro-nestjs/docs/API_ROUTES.md` with `POST evaluate-auto`, `GET installments-reconcile`, and `POST complete-plan` (cross-reference to `CompletePlanController` module).
- **Acceptance:** Table or list with method, path, permission, query params.
- **Dependencies:** —
- **Effort:** S

### T5 [BE] — Test coverage after T1/T2

- **Description:** Adjust/extend `installments-snapshot.service.spec.ts` (if present) or composer integration tests for sort + boundary; ensure `installments-reconcile.service.spec.ts` covers unified helper when T2 exists.
- **Acceptance:** `yarn test` in API repo passes; new tests with descriptions in English.
- **Dependencies:** T1, T2 *(partial: can start after T1)*
- **Effort:** M

### T6 [BE] — Future `quantityInstallments` policy (optional / product)

- **Description:** If product approves **B** in `research.md`, extend detection beyond regex; ADR + KPI expectation migration. **Do not start without explicit decision.**
- **Acceptance:** Referenced ADR; regression tests for text-only vs field-only descriptions.
- **Dependencies:** product/ADR decision
- **Effort:** L

---

## Frontend [FE]

### T7 [FE] — `referencePeriod` selector (YYYY-MM)

- **Description:** On the decision route (`/decision` or equivalent), expose month/year selector that sends `referencePeriod` on `evaluate-auto` query (and optionally link same period on complete-plan when consumed).
- **Acceptance:** Loading/error state preserved; omitted query = current behavior (API default UTC month).
- **Dependencies:** —
- **Effort:** M

### T8 [FE] — PT-BR labels for `primary_issue`

- **Description:** Presentation map (FE) or labels endpoint (BE) — prefer FE typed map from contract slug union — so raw slug is not shown to the user.
- **Acceptance:** All contract 001 `PrimaryIssueSlug` values have PT labels; component or hook test covers at least 3 slugs.
- **Dependencies:** —
- **Effort:** M

### T9 [FE] — Explanatory copy “installments vs future expenses” (optional)

- **Description:** Tooltip or short UI text on decision/plan data, linking expectation to regex **subcount** (or link to internal doc). Coordinate copy with product.
- **Acceptance:** Approved copy; does not change KPIs without spec.
- **Dependencies:** —
- **Effort:** S

---

## Shared [SHARED]

### T10 [SHARED] — Fix UI scope in spec 002

- **Description:** Edit `specs/002-decision-engine-composer/spec.md` **Out of Scope** / references to align with `specs/002-decision-engine-composer/review.md` and `specs/001-financial-decision-engine/spec.md` (UI in 001 or 002 explicitly).
- **Acceptance:** Single source of truth; no “UI separate sprint” vs delivered contradiction.
- **Dependencies:** —
- **Effort:** S

### T11 [SHARED] — OpenAPI contract parity

- **Description:** Ensure `specs/004-complete-financial-plan/contracts/openapi.yaml` references or includes `GET installments-reconcile` **or** document in `004` that the canonical fragment lives in `002/contracts/installments-reconcile.openapi.yaml` (explicit link in specs folder README).
- **Acceptance:** Spec reader finds HTTP contract in ≤2 clicks.
- **Dependencies:** —
- **Effort:** S

---

## DevOps [DEVOPS]

### T12 [DEVOPS] — Optional HTTP smoke (staging)

- **Description:** Job or script documented in `DEVELOPMENT.md` / pipeline calling `evaluate-auto` + `installments-reconcile` with service token (secrets in CI vars), assert HTTP 200 + minimal JSON.
- **Acceptance:** Actionable CI failure; does not run against prod without separate gate.
- **Dependencies:** T4 *(stable paths)*
- **Effort:** L

### T13 [DEVOPS] — Files >500 lines gate (cross-cutting chore)

- **Description:** `review.md` Minor: handle files >500 outside core or adjust `quality-check.sh` with documented exceptions — **does not block** composer alone but unblocks monorepo CI.
- **Acceptance:** `quality-check.sh` green at root **or** prioritized refactor issue list.
- **Dependencies:** —
- **Effort:** L

---

## Dependency graph (summary)

```text
T1 ─┬─> T5
T2 ─┘
T4 ──> T12
T10, T11 (independent of BE)
T7, T8, T9 (FE parallel to T1–T6 after baseline)
```

## Suggested dispatch order

1. **T10** (spec) — unblocks product communication.  
2. **T1** + **T4** in parallel (BE).  
3. **T2** when capacity allows (BE, larger).  
4. **T5** after T1/T2.  
5. **T7** / **T8** (FE) parallel to BE after T10.

---

## Document history

| Version | Date | Notes |
| --- | --- | --- |
| 0.1 | 2026-05-04 | Initial tasks map/composer/endpoint |
| 0.2 | 2026-05-04 | Plan v0.2: composeBundle, reconcile, baseline, FE/DEVOPS/SHARED |
