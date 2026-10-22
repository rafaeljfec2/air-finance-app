# Research — Complete Financial Plan

## Why hybrid (not 100% LLM, not 100% deterministic)?

| Axis | 100% deterministic | 100% LLM | **Hybrid (chosen)** |
| --- | --- | --- | --- |
| Number reliability | High | Risk of numeric hallucination | High — LLM never touches numbers |
| Latency | < 1s | 2–5s | ~1s (cache hit ~150ms) |
| Cost | R$ 0 | R$ per request | R$ only on cache miss (7d TTL) |
| Human / supportive tone | Limited | Excellent | Good — LLM on 2 free-text fields |
| Copy maintenance | Engineers edit code | Model “explains” | Engineers edit deterministic fallback only |

The LLM produces only `diagnosis` and `expectedOutcome` (free text). Everything with numbers, priority, lists, or rules is deterministic.

---

## Cache — why `AgentInsight` and not Redis?

- Schema already exists, TTL via Mongo `expireAfterSeconds`, metrics, and consistent index.
- Same infra as `CreditCardInsightAgent`.
- No new dependency; no extra server.

`contextHash` aggregates:

- `agentVersion` (auto-invalidates on release).
- `primary_issue`, `theme_phase`, `referencePeriod`.
- Discrete buckets (`step=0.05`) for `committedPct`, `proj30Pct`, `proj90Pct`.
- `reductionNeeded` bucket (step=R$ 100).
- Top category names and `peakDays` list.

→ Small input variations do not trigger a new LLM call, keeping narrative stable.

---

## Known data gaps

| Data | V1 state | V2 plan |
| --- | --- | --- |
| Multi-month peak-day history | Missing — current month only | 3-month aggregation + percentile |
| Intra-month limit utilization trend | Missing — `creditUtilizationTrend = null` | Daily card consumption series |
| Installment priority score | Heuristic (share of total) | Consider remaining total cost and implicit interest |
| `installmentsStrategy` suggestion | Static per `primary_issue` | May become short LLM text if ROI is clear |

---

## Why a separate endpoint instead of extending `evaluate-auto`?

- Frontend lazy-load → first `DecisionPage` render stays equally fast.
- LLM narrative cache fully isolated.
- `evaluate-auto` stays a pure/sync cheap endpoint.
- Easier to evolve contracts without breaking existing consumers.

---

## Risk and mitigation

| Risk | Mitigation |
| --- | --- |
| LLM returns invalid JSON | `parseLLMContent` fails soft, triggers deterministic fallback. |
| LLM unavailable / no key | `try/catch` in service, fallback. |
| Uncontrolled cost | Existing rate limit (10/day/company) + 7-day cache per contextHash. |
| LLM text misaligned with reality | Restrictive prompt; numbers forbidden in text. |
| Heavy payload | Installments limited to end ≤ 12 months. |
