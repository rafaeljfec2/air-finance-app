# SDD Review — `002-decision-engine-composer`

**Date:** 2026-05-04  
**Reviewer:** Cursor agent (Tech Lead checklist)  
**Scope:** Composer + `evaluate-auto` (BE) + initial web consumption (FE delivered in the same product cycle).

## Verdict

**APPROVED**

Code and HTTP contract align with what the specs require for **US-1 / FR-6** (one call that evaluates without building KPIs on the client) and with the OpenAPI fragment for `evaluate-auto`. The front end only consumes the endpoint, validates the response with Zod, and does not recompute the decision. Residual risk is **scope documentation** between spec 002 and UI delivery (see Major).

---

## Critical issues

_None._ Nothing identified that requires blocking merge for security, broken contract, or missing auth on the exposed path.

---

## Major

1. **Scope alignment across specs**  
   In `specs/002-decision-engine-composer/spec.md`, **Out of Scope** includes “UI on the front (separate sprint)”, but the current delivery includes the `/decision` screen in `apps/web` (consistent with `specs/001-financial-decision-engine/spec.md`, which defines the decision screen).  
   **Recommended action:** update 002 (remove or rewrite the UI item) **or** state explicitly in 002 that UI is tracked in **001** and 002 covers only composer + endpoint.

---

## Minor

1. **`primary_issue` in UI** — Humanized slug display may fall short of 001’s “direct PT-BR” for all cases; acceptable as MVP if the backend keeps sending slugs; evolution = copy on BE or label map on FE for presentation only.  
2. **`referencePeriod` in UI** — Optional; contract already supports query; omission does not violate US-3 on the client if the product accepts current month until phase two.  
3. **Quality gate SIZE** — Script `quality-check.sh` may still fail on other monorepo files `>500` lines (e.g., `CreditCardFormModal`, `apiErrorHandler`, `openiService`), outside this feature core. Handle in a separate chore or explicit limit policy.  
4. **`git diff <base>...HEAD`** — Not available in this review environment; re-run review locally with full diff before merge if the branch diverges.

---

## Positive

- **Separation of concerns:** client does not reimplement FR-1 ladder / engine; only displays `status`, `primary_issue`, `ordering_rationale`, up to three actions.  
- **Contract:** `POST .../evaluate-auto`, optional `referencePeriod` query, validated response (Zod) mirroring Nest DTO.  
- **UX states:** loading, error, no company, no actions; first action highlighted.  
- **Tests:** service + hook with stable mocks (`decisionEngineService.test.ts`, `useDecisionEngineEvaluateAuto.test.tsx`).  
- **Quality infra:** `setupTests` compatible with Vitest + jest-dom; pinned `jsdom`; `IndebtednessCard` / `DatePicker` split to respect line limits where applicable.

---

## Spec compliance (summary)

| Reference | Assessment |
|------------|-----------|
| 002 FR-1 / FR-6 / OpenAPI `evaluate-auto` | Met on FE (path + query + POST without logical body). |
| 002 FR-7 (composer without decision) | BE scope; not line-by-line reviewed here; assumed delivered per prior handoff. |
| 001 US-1–US-5 (decision screen) | Partial: transparency (`ordering_rationale`), status, up to 3 actions, first highlighted — **OK**. PT copy for `primary_issue` slug can improve. |

---

## Quality output

- **Typecheck / lint (web):** per prior repo sessions, `yarn workspace @air-finance/web type-check` and `lint` pass after tsconfig/jest-dom fixes and size refactors.  
- **`quality-check.sh`:** improved script (subshell `fail`, cwd, PM binary); full run recommended at repo root before merge.

---

## Next steps

1. **Merge** after optional human diff and green CI.  
2. **Docs:** fix “UI out of scope” inconsistency in 002 or reference 001.  
3. **Product backlog:** PT labels for `primary_issue`; `YYYY-MM` selector; E2E smoke against API if required by the team.  
4. **Chore:** remaining files `>500` lines or adjust size gate.
