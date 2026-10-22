# Feature: Household financial decision engine (KPI → priority → actions)

Turn an already computed set of household KPIs (with ideal / attention / alert zones) into **one primary decision**, **global status**, and **up to three concrete actions**, for display on a **decision screen** aimed at non-experts.

**Assumed prerequisite:** KPIs (`savings_rate`, `income_committed_pct`, `credit_utilization_index`, `monthly_cash_flow`, `surplus_capacity`, `fixed_vs_variable_split`, and optional extensions such as `debt_service_to_income`, `checking_runway_days`) already exist as valid numeric values per period, with zone bands defined by the product. **Irregular income:** already reflected in upstream **KPI levels**; the engine **does not** receive a flag or special-case handling.

---

## Product decisions (v1) — closed

| Theme | Decision |
| --- | --- |
| Language | **Direct PT-BR** in all user-facing text (`title`, `description`, `impact`). **No i18n** in this version. |
| Weights and bands | **Fixed in code** in v1; future evolution may become configurable (out of v1 scope). |
| Irregular income | **Outside the engine**; already incorporated in KPI calculation/classification. |
| Incomplete data | `primary_issue` = **`data_incomplete`**; `status` = **`attention`**; return **at least one** action guiding **complete data** (do not invent R$/%). |
| Healthy state | **Always exactly one** positive micro-action (habit reinforcement); **do not** return an empty action list. |

---

## User Stories

- **US-1 — Immediate clarity**  
  As a non-expert user, I want to see **one primary problem** and **at most three steps** so I do not feel overwhelmed, knowing **why** that was chosen.

- **US-2 — Sensible priority**  
  As a user in cash difficulty, I want the system to **prioritize running out of money** (negative flow, low runway) **before** messages about savings optimization or card usage, so I act in the right order.

- **US-3 — Measurable actions**  
  As a user, I want each action with **explicit impact in R$ or %** (when derivable from data), to compare effort and outcome without financial jargon.

- **US-4 — Transparency**  
  As a skeptical user, I want to see **which KPIs triggered** each action and the **ordering reason** (`ordering_rationale` in the API response), to trust the recommendation.

- **US-5 — Global state**  
  As a user, I want a **single status** for the situation (e.g., healthy vs needs attention vs critical) aligned with the severity of the primary problem.

**Acceptance criteria (summary)**

- Given a KPI + zone snapshot, the system returns **status**, **primary_issue**, and **up to 3** actions in the agreed format (see FRs).
- If **no** KPI is in attention or alert and data is complete, status is **healthy** and there is **exactly one** positive micro-action (FR-14).
- If the snapshot is **incomplete**, `primary_issue` = `data_incomplete`, with an action to complete data (FR-0).
- With **several** KPIs off ideal, **one** `primary_issue` is chosen by the documented **severity ladder**.
- Each action lists **reason** as KPI identifiers that support it.
- The user **never** receives more than **three** simultaneous actions on this screen.

---

## Functional Requirements

### Precondition: snapshot data

**FR-0 — Incomplete data (priority over ladder)**  
If the snapshot is considered **incomplete** by quality rules agreed with the KPI pipeline (missing required fields or invalid critical KPIs), the engine **does not** apply FR-1 ladder for financial diagnosis. It must return: **`primary_issue` = `data_incomplete`**, **`status` = `attention`**, and **at least one** PT-BR action to **complete registration/data** (e.g., link account, enter card limit, classify income). **`reason`** may list affected KPIs or internal id `data_quality` if applicable. **Do not** invent quantitative `impact` values.

### Prioritization and severity

**FR-1 — Severity ladder (default order)**  
Applies only when **FR-0** does not fire.  
The product must classify financial problems by the following **precedence order** when multiple risk conditions coexist (most severe to least):

| Order | Axis | Typical supporting KPIs | Why (business) |
| --- | --- | --- | --- |
| 1 | Immediate liquidity | `checking_runway_days` in alert (if present); `monthly_cash_flow` in alert | No cash or negative flow **breaks** ability to pay obligations; other optimizations are secondary. |
| 2 | Debt service | `debt_service_to_income` in alert (if present) | High minimums **commit** the next month contractually, close to liquidity. |
| 3 | Credit pressure | `credit_utilization_index` in alert | High usage increases minimums and cash stress **before** savings effects. |
| 4 | Income already committed | `income_committed_pct` in alert | Little structural slack to absorb shocks; systemic household risk. |
| 5 | Surplus capacity | `surplus_capacity` in alert or attention | Predictability of future “surplus”; relevant after stabilizing cash and credit. |
| 6 | Savings / discipline | `savings_rate` in alert or attention | Important for goals, but **after** stabilizing flow and credit/commitment pressure. |
| 7 | Budget rigidity | `fixed_vs_variable_split` in alert (excessive fixed) | Medium-term structural adjustment; must not mask liquidity or credit alerts. |

**FR-2 — Tie-break**  
If two KPIs in the **same order** are in alert, tie-break by **greater distance from the zone boundary** (greater numeric severity within the band). If still tied, use fixed lexicographic order of KPI ids published by the product.

**FR-3 — Missing optional KPIs**  
If a ladder KPI is missing or **invalid** (e.g., net income ≤ 0 for savings rate), skip that step **provided** the snapshot is still valid for decision. If absence/invalidity means **incomplete snapshot** per product rules, apply **FR-0** instead of silently skipping.

### Zones and scoring model

**FR-4 — Levels per KPI**  
For each present KPI, the engine must receive or derive a discrete level: **ok**, **warn** (attention), **alert**, aligned with bands already defined by the product.

**FR-5 — Score for auxiliary ordering**  
Each (KPI, level) combination contributes an **integer weight** for internal ranking and action selection:

| Level | Base weight |
| --- | ---: |
| ok | 0 |
| warn | 3 |
| alert | 7 |

**FR-6 — Weight per KPI (intrinsic severity)**  
Multiply base weight by a **KPI factor** **fixed in v1** (constants in code), consistent with the ladder: liquidity and flow **≥** credit **≥** commitment **≥** surplus **≥** savings **≥** fixed rigidity. Numeric values are defined in v1 implementation and must **preserve FR-1 precedence**. Remote configuration is **out of v1 scope**.

### Primary problem selection and action limit

**FR-7 — Primary problem (`primary_issue`)**  
Must be **one** stable identifier (slug) chosen from a closed catalog of “decision themes”, mandatorily including **`data_incomplete`** and **`healthy`**, and ladder-aligned themes per `plan.md` §3 (**API v1 canonical slugs**): `liquidity_risk`, `debt_pressure`, `credit_overuse`, `high_commitment`, `low_surplus`, `low_savings`, `high_fixed_cost`. Legacy names like `liquidity_crisis` are **not** exposed in the API. Theme matches **FR-0** when applicable; otherwise the **first non-ok step** in FR-1; if all ok and data complete, **`healthy`**.

**FR-8 — Action limit**  
Return **at most 3** actions. **Minimum:** **1** action when `primary_issue` is **`healthy`** or **`data_incomplete`** (FR-14 and FR-0). In other cases, **minimum 0** is allowed only if the catalog produces no aligned candidate — scenario to avoid in implementation; in practice expect **≥ 1** action whenever a KPI is not `ok`, except when FR-0 already forced the complete-data action.

**FR-9 — Coherence**  
Every returned action must be **linked** to `primary_issue` or a KPI in the **same or higher** FR-1 ladder step (never suggest only “increase savings” when liquidity is in alert without addressing cash/credit first).

### Actionable actions

**FR-10 — Required fields per action**  
Each action must include:

- **title**: short, imperative, **in PT-BR**, no jargon.
- **description**: what to do in everyday language **in PT-BR**.
- **impact**: **always** filled with magnitude when data allows — text format including **R$** or **%** (e.g., “Cut up to **R$ 320/month** in flexible expenses”, “Stop new card purchases until usage falls **below 40%**”). If not calculable, use the single qualitative phrase allowed by the product (“High impact on cash”) and mark low confidence (see NFR).
- **reason**: array of KPI ids (`monthly_cash_flow`, etc.) that **trigger** the action.

**FR-11 — Action catalog**  
The product must maintain a **catalog** of candidate actions associated with combinations (primary theme + KPIs in alert/warn). The engine **selects** and **parameterizes** (R$ / % values) from period data — do not invent numbers without declared rules.

**FR-12 — Frontend output (data contract)**  
The response must serialize to the following logical format (required fields):

```json
{
  "status": "string",
  "primary_issue": "string",
  "ordering_rationale": "string",
  "actions": [
    {
      "title": "string",
      "description": "string",
      "impact": "string",
      "reason": ["kpi_1", "kpi_2"]
    }
  ]
}
```

Expected semantics:

- **status**: enum with at least `healthy`, `attention`, `critical` (stable values; PT-BR copy only in UI if needed, but action text already comes in PT-BR).
- **primary_issue**: theme slug (FR-7).
- **ordering_rationale**: short **PT-BR**, **deterministic** text explaining why this `primary_issue` was chosen relative to FR-1 ladder and, when applicable, FR-2 tie-break within the step (US-4); under **FR-0**, lists incompleteness reasons (KPIs/`data_quality`).
- **actions**: length **1–3** when `healthy` or `data_incomplete`; otherwise up to **3** and preferably **≥ 1** if a financial problem is classified (FR-8).

**FR-13 — Global status**  
When **FR-0** does not apply: `status` is **critical** if any FR-1 ladder KPI is in **alert** through level 3 (liquidity, debt service, credit) or `monthly_cash_flow` in alert; **attention** if there is **warn** or alerts in levels 4–7 without critical; **healthy** if all **ok**. When **FR-0** applies, **ignore** this rule for `status` (remains **attention** per FR-0).

### Experience and additional business rules

**FR-14 — “Healthy” mode**  
When all KPIs are **ok** and **FR-0** does not apply, `primary_issue` = `healthy`, `status` = `healthy`, and **actions** must contain **exactly one** positive micro-action (habit reinforcement), **in PT-BR**, never contradicting ok KPIs. **Do not** return an empty list.

**FR-15 — Temporal consistency**  
The engine operates on an explicit **snapshot** (period + timestamp + cash vs accrual view). The UI must display the same period used in KPI calculation.

---

## Non-Functional Requirements

**NFR-1 — Latency**  
Decision must be computable from already materialized KPIs in negligible time for interactive UX (order of milliseconds per request under normal conditions).

**NFR-2 — Determinism**  
For the same input set (KPIs, levels, parameters), the result must be **identical** (no randomness).

**NFR-3 — Security and privacy**  
Outputs are for the authenticated **household holder** and company/account scope already validated by the product; do not expose sensitive data beyond what is needed in the impact message.

**NFR-4 — Accessibility (content)**  
Short **PT-BR** text, simple language, no unexplained acronyms on the decision screen itself.

**NFR-5 — Observability**  
It must be possible to log, for support and continuous improvement, which **version** of the rules/actions catalog was applied and which KPIs/levels fed the decision (no PII in public logs).

**NFR-6 — Data confidence**  
When the snapshot is **incomplete**, apply **FR-0** (`primary_issue` = `data_incomplete`, `status` = `attention`, complete-data action, no invented quantitative impact).

---

## Out of Scope

- Internationalization (i18n) and per-locale catalogs — **v1 PT-BR only**.
- Remotely configurable weight/band parameters — **v1 fixed code**; later evolution allowed.
- Calculation or ingestion of raw series (transactions, cards, limits) and definition of each KPI’s **numeric bands** (already exist).
- Personalization by machine learning model or psychometric profile.
- Automatic payment execution, physical card blocking, or write bank integration.
- Multi-user collaborative budget with granular permissions (beyond existing product scope).
- Push notifications and reminder cadence.

---

## Open Questions

*None pending for v1 — decisions closed in “Product decisions (v1)”. **Exact incomplete snapshot criteria (FR-0)** are defined in `data-model.md` §3 (rules **C1–C9**); the KPI/composer pipeline must reflect these rules when building the snapshot.*

---

## Document history

| Version | Date | Author |
| --- | --- | --- |
| 0.1 | 2026-05-04 | Architect (SDD specify) |
| 0.2 | 2026-05-04 | v1 decisions: PT-BR, fixed weights, no irregular income flag, `data_incomplete`, micro-action in `healthy` |
| plan | 2026-05-04 | HOW artifacts: `plan.md`, `research.md`, `data-model.md`, `contracts/` |
| 0.3 | 2026-05-04 | FR-7 canonical slugs; FR-12 `ordering_rationale` (US-4); Open Questions → C1–C9 in `data-model.md` |
