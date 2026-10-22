# Research — Decision playbook 3 phases

> Closed decisions for `spec.md` v0.1. Focus: catalog architecture and relationship with current numeric `actions[]`.

---

## 1. Decision A — Where the plan catalog lives (3 phases + rule + impact)

**Chosen:** **hybrid** (backend resolves phase, frontend holds copy).

### Alternatives evaluated

#### A1) Full backend
Backend owns PT-BR catalog (extends `action-catalog.ts` with playbook per slug); composer/service resolves phase + returns full playbook in contract.

- **Pros:** closed contract versioned by `ruleEngineVersion`; single source of truth if new channels appear (native mobile, partners).
- **Cons:** any copy iteration requires backend deploy; fine copy mixed with numeric logic; larger contract surface.

#### A2) Full frontend (architecture-driven choice)
Backend unchanged; frontend has PT-BR catalog and infers phase locally from available `kpis`.

- **Pros:** zero backend surgery.
- **Cons:** phase classification logic **leaks** to frontend (`KpiSnapshot.level` exists in contract but is not exposed in current response); would duplicate FR-1/FR-3 rules; violates “single source of truth” for decision.

#### A3) Hybrid (chosen)
Backend returns only `theme_phase: 'red' | 'yellow' | 'green' | null`. Frontend has PT-BR catalog (`apps/web/src/pages/decision/playbooks/`).

- **Pros:**
  - Numeric logic stays **inside** the engine (preserves FR-2 and `DECISION_LADDER`).
  - Fast copy iteration without backend deploy.
  - Matches project precedent: `primaryIssueLabels.ts`, `kpiPlainLabels.ts`, `humanizeImpactForDisplay.ts` are local copy.
  - Contract grows by **one** optional/nullable field — backward compatible.
- **Cons:** if another channel uses the same API someday, it will need its own catalog (acceptable: unlikely in v1).

### Decisive criterion
Copy iteration speed + project precedent + minimal contract cost. Hybrid wins on all three.

---

## 2. Decision B — Replace vs complement current numeric `actions[]`

**Chosen:** **complement**.

### Alternatives evaluated

#### B1) Replace
Swap `actions[]` (up to 3 actions with R$ / % impact) for 3-phase plan (3–5 static actions per phase).

- **Pros:** simpler UI; 100% guided content.
- **Cons:** **loses** numeric impact hook (“You could save about R$ 2,731.00/month”) that drives action today; breaks existing contract.

#### B2) Coexist in tabs
Tab “Next step” (current UI) + tab “Full plan” (3 phases).

- **Pros:** user chooses depth.
- **Cons:** fragments screen; more cognitive load; extra navigation for what matters.

#### B3) Complement (chosen)
Keep `DecisionStatusStrip` + `DecisionPrimaryBlock` (R$ / % impact) + `DecisionSecondaryActions` exactly as they are. Add `DecisionPlaybookCard` **below**, with active phase expanded.

- **Pros:**
  - Preserves numeric hook that already works.
  - Adds educational depth **without** breaking screen hierarchy.
  - User in `red` sees immediate action + exit plan; user in `green` sees habit reinforcement.
  - Zero contract break (new field is optional).
- **Cons:** screen gets longer (acceptable tradeoff for a 3–5 card route).

### Decisive criterion
Do not lose numeric evidence that moves the user today + preserve US-1 from `001` (one problem at a time).

---

## 3. Relevant technical notes

- **Missing driver KPI fallback** (FR-3 in this spec): inherits `DECISION_LADDER` from `001-financial-decision-engine/`. If `liquidity_risk` driver KPI (`monthly_cash_flow`) is missing, resolver looks at other KPIs on the same step (`checking_runway_days`) and uses worst level found. Keeps consistency with FR-1 ladder.
- **Accordion without new dependency**: current DS does not export `Accordion` (only `Card`, `Badge`, `Button`). Implementation uses `<button aria-expanded aria-controls>` + `role="region"` in React (no new libs — meets NFR-5).
- **Forbidden terms in copy**: validated via test in `playbooks.test.ts` (centralized forbidden-substring list). Can be extended without production code change.
- **Global `MongoMemoryServer` in `src/test/setup.ts`** (backend): pure `decision-engine` tests run correctly with `--runInBand`; in parallel they compete for instances and hit timeout. Documented for QA.
