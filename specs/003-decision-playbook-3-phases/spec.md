# Feature: Three-phase decision plan (red / yellow / green) by theme

Extend the financial decision engine to deliver — alongside the current “next step” — an **educational three-phase plan** (red, yellow, green) per theme, with a simple **ongoing rule** and **expected outcome** in plain language. The system does not forbid; it teaches how to keep living (installments, card use) with a clear rule.

**Assumed prerequisite:** the engine in `specs/001-financial-decision-engine/` already returns `status`, `primary_issue`, and parameterized `actions[]` (R$ / %), and the composer in `specs/002-decision-engine-composer/` builds KPIs from real dashboard and indebtedness metrics.

---

## Product decisions (v1) — closed

| Theme | Decision |
| --- | --- |
| Language | **Direct PT-BR** in all plan copy (title, explanation, actions, rule, outcome). No i18n in this version. |
| Catalog | **Hybrid**: backend only decides active phase per theme (`theme_phase`); all PT-BR content lives on the **frontend** (`apps/web/src/pages/decision/playbooks/`). |
| Coexistence | **Complementary**, not a replacement: the current “next step” with numeric impact (R$ / %) stays intact; the 3-phase plan appears **below** it. |
| Accordion | Active phase opens **expanded by default**; user can expand others (keyboard accessible). |
| Persistence | **No v1 persistence**: no “completed actions” state is saved (all neutral). |

---

## User Stories

- **US-1 — Know which phase I am in**  
  As a non-expert user, I want to see clearly which phase of the main theme I am in (red / yellow / green) so I know whether I need to react, adjust, or just maintain.

- **US-2 — Know what to do now**  
  As a user in any phase, I want **3 to 5 practical actions** from the active phase, in short non-jargon sentences, so I can start today.

- **US-3 — Understand the ongoing rule**  
  As a user who does not understand finance, I want **one simple rule** (“never commit more than 25% of income to installments”) as a day-to-day guide.

- **US-4 — See the full path**  
  As a curious user, I want to open phases I am not in yet to understand the recovery path to green, without losing focus on the current phase.

- **US-5 — Plain language**  
  As a non-technical user, I want text without terms like “KPI”, “index”, “interest rate”, “revolving” — only words from everyday life.

**Acceptance criteria (summary)**

- Given evaluate-auto returns `primary_issue ≠ data_incomplete`, the response includes `theme_phase ∈ {red, yellow, green}` and the UI shows the plan card with the correct phase expanded.
- Given `primary_issue = data_incomplete`, `theme_phase` is **null** and the UI shows placeholder “Complete your data first” (no phases).
- Given `primary_issue = healthy`, `theme_phase` is always **green**.
- Each of the 9 catalog slugs (`liquidity_risk`, `debt_pressure`, `credit_overuse`, `high_commitment`, `low_surplus`, `low_savings`, `high_fixed_cost`, `healthy`, `data_incomplete`) has a complete playbook.
- Each phase of each playbook has **3 to 5 actions**, all in PT-BR and without forbidden terms.
- User can expand/collapse phases via keyboard (`Enter` / `Space`).
- `theme_phase` inclusion is **backward compatible**: older clients ignore the field.

---

## Functional Requirements

### Engine output (backend)

**FR-1 — `theme_phase` field in response**  
The response of `POST /companies/:companyId/decision-engine/evaluate` and `.../evaluate-auto` gains a `theme_phase` field of type `'red' | 'yellow' | 'green' | null`. Field is **optional** in the contract (legacy clients keep working).

**FR-2 — Level → phase mapping**  
Given `primary_issue` and the corresponding **driver KPI** (table in `data-model.md`), that KPI’s level becomes the phase:
- `alert → red`
- `warn → yellow`
- `ok → green`
- `primary_issue = healthy → green`
- `primary_issue = data_incomplete → null`

**FR-3 — Missing driver KPI fallback**  
If the driver KPI for `primary_issue` is not present in `kpis`, the resolver uses the **worst level** among KPIs in the matching step in `DECISION_LADDER` (defined in `specs/001-financial-decision-engine/`). If no KPI from the step is present, returns `green`.

**FR-4 — Determinism**  
For the same input (slug + `KpiInputMap`), the phase resolver **always** produces the same result.

### Plan content (frontend)

**FR-5 — PT-BR catalog on frontend**  
Static catalog at `apps/web/src/pages/decision/playbooks/` with **9 entries** (one per slug). Each entry exports a `Playbook` with the shape in `data-model.md`.

**FR-6 — Each Playbook structure**  
Each `Playbook` has:
- `title`: PT-BR string.
- `explanation`: 1–2 plain sentences explaining what is happening.
- `phases.red`, `phases.yellow`, `phases.green`: each with `headline`, `objective`, and `actions` (3–5 items).
- `rule`: one-sentence ongoing rule.
- `expectedImpact`: single positive-tone outcome sentence.

**FR-7 — Resilient `getPlaybook(slug)`**  
Public `getPlaybook(slug: string): Playbook` returns the matching `Playbook`; unknown slug falls back to **`healthy`** (does not throw).

### UI (component)

**FR-8 — `DecisionPlaybookCard` component**  
Rendered **below** `DecisionStatusStrip`, `DecisionPrimaryBlock`, and `DecisionSecondaryActions` on route `/decision`. Shows:
1. `title` + Badge for active phase (`destructive`, custom amber, `success`).
2. `explanation`.
3. Accordion with 3 sub-blocks (red / yellow / green): **active phase expanded**; others collapsed.
4. “Simple rule” block highlighted (`border-l-4 border-l-primary-500`).
5. “Expected outcome” block in positive tone.

**FR-9 — Placeholder for `data_incomplete`**  
When `theme_phase === null` (or `undefined`), the card shows only title, explanation, and message “Complete your data so the app can build your phased plan.” — no accordion.

**FR-10 — Coexistence with current UI**  
`DecisionStatusStrip`, `DecisionPrimaryBlock` (R$ / % impact), and `DecisionSecondaryActions` stay unchanged. Playbook complements, does not replace.

---

## Non-Functional Requirements

**NFR-1 — Plain language**  
All playbook text **must not** contain forbidden substrings listed in `playbooks.test.ts` (PT-BR jargon such as index/rate/revolving equivalents, plus `KPI`, `severity`, `snapshot`). Automated validation via that test file.

**NFR-2 — Determinism**  
Same input → same `theme_phase`. Covered by resolver test and `decision-engine.service.spec.ts`.

**NFR-3 — Accessibility**  
Accordion with `<button aria-expanded aria-controls>` + `role="region"` on panel. Visible focus (`focus-visible:ring`). Touch ≥ 44px.

**NFR-4 — Mobile-first**  
Layout starts on small viewport (`px-4`), enriches at `sm:` (`px-6`). Dark mode via design system tokens (`text-foreground`, `text-muted-foreground`, `bg-card`, `bg-muted/40`).

**NFR-5 — No new dependencies**  
Implementation uses only existing primitives (`Card`, `Badge`, `Button`, `lucide-react`). No new packages.

**NFR-6 — Backward compatibility**  
`theme_phase` in contract is optional/nullable. Clients before deploy keep working unchanged.

---

## Out of Scope (v1)

- Persisting user progress on the plan (Mongo checklist state).
- Notifications when user advances phase.
- Playbooks for **themes other than** `primary_issue` (US-1 keeps focus on one problem at a time).
- Dedicated KPI for “active installments” (conceptual coverage via `high_commitment` is enough for v1).
- Remote configuration of playbook text (v1 is static in code).
- Translation / i18n.

---

## Open Questions

*None pending for v1 — decisions closed in “Product decisions (v1)” section.*

---

## Document history

| Version | Date | Author |
| --- | --- | --- |
| 0.1 | 2026-05-04 | Architect (SDD specify) |
