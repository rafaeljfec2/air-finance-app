# Feature: Complete financial plan (decision engine + cached LLM narrative)

Add a new **“Your complete plan”** section to the `/decision` page that combines diagnosis, numeric situation, 30/60/90 projection, installment strategy, spending behavior, and personalized rules. Generation is **hybrid**: the deterministic backend builds the full structure from real data (income, installments, category expenses, peak spending days), and the LLM produces only **2 free-text blocks** (diagnosis and expected outcome), with strong caching in `AgentInsight`.

**Assumed prerequisites:**

- Decision engine returns `primary_issue` + `theme_phase` (specs/001 and 003).
- Current composer maps real metrics → KPIs (specs/002).
- Cards `DecisionPrimaryBlock`, `DecisionSecondaryActions`, and `DecisionPlaybookCard` stay unchanged; the new section is **complementary** and appears **below** `DecisionPlaybookCard`.

---

## Product decisions (v1) — locked

| Topic | Decision |
| --- | --- |
| Generation | **Hybrid**: deterministic backend for structure/numbers; LLM (`gpt-4o-mini`) only for `diagnosis` + `expectedOutcome`. |
| Cache | `AgentInsight` with 7-day TTL. Context hash includes `primary_issue`, `theme_phase`, period, commitment buckets, and top categories. |
| Fallback | If the LLM fails or returns invalid JSON, deterministic copy per `primary_issue` is used (response never breaks). |
| Language | **Lay Brazilian Portuguese (PT-BR)** in user-facing copy. No terms like KPI, rate, index, revolving credit. |
| Endpoint | Separate `POST /companies/:companyId/decision-engine/complete-plan` from `evaluate-auto` for frontend lazy-load and cache isolation. |
| UI | Dedicated `DecisionCompletePlanSection` with its own `useQuery`. Loading and errors are isolated (do not block the rest of the decision view). |
| Installment window | 12-month cap on installment grouping to reduce payload. |
| Behavior | V1 uses **current month only** for peak spending days. Intra-month credit utilization trend returns `null` (V2). |

---

## User stories

- **US-1 — Clear diagnosis**  
  As a non-expert user, I want to understand in 1 or 2 paragraphs what is happening with my money, without jargon.

- **US-2 — Honest numeric situation**  
  As a user, I want to see how much of my income is committed today, what a healthy target is, and how much I need to reduce per month.

- **US-3 — Next 90 days projection**  
  As a user, I want to know how my commitment changes at 30, 60, and 90 days if nothing changes, based on installments that end.

- **US-4 — Installment strategy**  
  As a user, I want active installments prioritized (high/medium/low) with practical guidance on where to start.

- **US-5 — Personalized behavior**  
  As a user, I want my top 3 spending categories and the days of the month when I spend the most.

- **US-6 — Simple rules**  
  As a user, I want short rules I can remember and one anchor “simple rule” for my main problem.

- **US-7 — Expected outcome**  
  As a user, I want one paragraph on what changes in my life if I follow the plan.

---

## Acceptance criteria

1. Given an authenticated user with complete data, when opening `/decision`, the “Your complete plan” section loads independently and shows diagnosis, numbers, 30/60/90 projection, installments, behavior, rules, and expected outcome.
2. When `primary_issue = data_incomplete`, the section still renders with fallback copy guiding the user to complete registration, without breaking.
3. If the LLM fails (network, invalid JSON), `diagnosis` and `expectedOutcome` receive deterministic fallback per `primary_issue`.
4. On mobile (375px), the section is fully readable, all touch targets ≥ 44px, and contrast is correct in dark mode.
5. The page “Refresh” button invalidates both `evaluate-auto` and `complete-plan`.

---

## Non-goals (v1)

- Multi-month historical aggregation of peak spending days.
- Intra-month time series of credit usage.
- User-editable rules.
- Streaming narrative.
- Persistence of “completed actions”.

---

## Metrics (suggested for v2)

- Daily cache hit rate.
- Average endpoint latency (with and without cache).
- Engagement (scroll-into-view) per subsection.
