# Feature: Refactor KPI `debt_service_to_income` (cash-flow semantics, not stock)

Replace the decision engine KPI `debt_service_to_income`, which today computes **debt stock ÷ monthly income** with misleading semantics, with a KPI that reflects **monthly debt service ÷ monthly income**, aligned with the "healthy limit 25%" copy shown to users and with the number `CompletePlanNumbersCard` already displays.

**Context:** during E2E validation of `/decision`, a user with `committedPct = 11%` (installments/income) was classified as `Critical — Your debts are consuming your income`. The cause is that `debt_service_to_income` today computes `(negative_balances + open_invoices + pending_payables) / monthly_income`, which is debt stock over income flow — it easily exceeds 80% without the user being in real cash-flow risk. That produces a message inconsistent with the numbers shown in "Your complete plan".

**Assumed prerequisites:**

- Decision engine, composer, and ladder from specs/001, /002, and /003.
- `InstallmentsSnapshotService` (specs/004) already provides `totalMonthly` for active installments.
- `IndebtednessService` continues exposing the stock ratio for other screens (Financial Health, Dashboard) — the refactor is **internal to the decision engine**.

---

## Product decisions (v1) — closed

| Theme | Decision |
| --- | --- |
| Rollout strategy | **Direct replace** (clean break). Do not keep both KPIs in parallel. |
| New KPI numerator | `Σ active monthly installments + estimated monthly revolving interest + monthly overdraft cost` |
| Revolving interest estimate (when no data) | **15% per month** on overdue balance (market average / BACEN reference) |
| Overdraft (numerator) | Treat average negative balance as proportional monthly cost. If a specific known charge exists, use it; otherwise use absolute balance as cost (1 month of use) |
| Denominator | `monthlyRevenue` (dashboard summary income for the reference month) |
| Thresholds | `warn ≥ 25%` (aligned with app copy), `alert ≥ 40%` |
| Missing data | If income is 0 or unknown → KPI absent (no guess). If revolving unknown → estimate via 15% on overdue balance. If overdraft unknown → ignore. |
| Old KPI | **Removed**. Stock ratio remains available via `IndebtednessService.calculateDebtToRevenue` outside the decision engine. |
| LLM cache | Bump `agentVersion` of `complete-plan-narrative` to invalidate old caches with wrong classification. |
| User communication | Do not send "we updated your classification" notification — change is silent and tends to improve (not worsen) status. |

---

## User Stories

- **US-1 — Consistency between status and numbers**
  As a non-expert user, I want "Critical" status only when the numbers on my screen truly justify it, without internal contradiction.

- **US-2 — Sensitivity to real installments**
  As a user with controlled debt (installments at 11% of income, no open invoice), I want the system to recognize I am doing well instead of alarming me over historical account balances.

- **US-3 — Sensitivity to real debt service**
  As a user with a large revolving invoice + installments + heavy overdraft every month, I want the engine to understand my cash flow is compressed and classify me as `red`/`yellow`.

---

## Acceptance criteria

1. Given a user with `monthly installments = R$ 2,943` and `income = R$ 27,000`, with no revolving or overdraft, KPI `debt_service_to_income` returns ~11% and level `ok`. `primary_issue` is no longer `debt_pressure` and status is no longer `Critical`.
2. Given a user with `installments = R$ 1,500` + `revolving invoice = R$ 8,000` + `income = R$ 10,000`, KPI returns ~27% (installments + 15% × 8,000 = 1,500 + 1,200 = 2,700) and level `warn`. `primary_issue` remains or becomes `debt_pressure` as appropriate.
3. Given a user with income 0 or missing, KPI returns `undefined` (data_incomplete) and the engine reacts per existing incomplete-data rules.
4. Old `AgentInsight` caches are invalidated via `agentVersion` bump, so narratives generated for the old KPI are not returned.
5. Endpoint `GET /indebtedness/debt-to-revenue` still returns the stock ratio (no regression for other screens).
6. Frontend requires no mandatory contract change — `decision-engine-response` still exposes `debt_service_to_income` (same name, new semantics). `CompletePlanNumbersCard` only adds a caption clarifying "including installments + revolving interest + overdraft".
7. Real `nest start` boots without errors (boot smoke test).
8. Old specs that mocked `debt_service_to_income` with stock values are updated to reflect cash-flow semantics.

---

## Out of scope (v1)

- Do not create a new KPI `total_debt_to_monthly_income` in the engine (information remains via `IndebtednessService` for consumers that need it).
- Do not change copy "Your debts are consuming your income" — it becomes correct in cases where it appears.
- Do not review other KPIs (`income_committed_pct`, `credit_utilization_index`) — scope limited to `debt_service_to_income`.
- Do not add new UI showing numerator breakdown (installments + interest + overdraft).
- Do not invalidate `evaluate-auto` cache (none today).

---

## Quality gates

- `yarn lint` ✅
- `yarn test` ✅ (all new and old specs green)
- `yarn build` ✅ (Swagger plugin OK)
- Real `nest start` boots without errors (lesson from spec/004)
- Manual E2E validation: dev user moves from `Critical` to `OK`/`Attention` without inconsistency between status and displayed numbers
- `connexto-integration-bank` running for invoice sync (required for revolving scenario test)
