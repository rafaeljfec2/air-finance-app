# Data Model — Decision playbook 3 phases

> Shared types (frontend) + KPI driver per slug (backend). No database persistence in this version.

---

## 1. Contract types (backend ↔ frontend)

### `ThemePhase`

```ts
type ThemePhase = 'red' | 'yellow' | 'green';
```

Appears in the HTTP contract as string (enum) **or** `null`. Meanings:

- `'red'` — user is in a critical situation for this theme; phase goal is **stop getting worse**.
- `'yellow'` — user is adjusting; goal is **organize and regain balance**.
- `'green'` — user is healthy on this theme; goal is **maintain** control.
- `null` — no applicable phase (`primary_issue = data_incomplete`).

### Addition to `DecisionEngineOutput`

```ts
interface DecisionEngineOutput {
  // ... existing fields (status, primary_issue, ordering_rationale, actions, ruleEngineVersion)
  theme_phase: ThemePhase | null;
}
```

On backend HTTP DTO (`DecisionEngineResponseDto`) the field is exposed as:

```ts
@ApiProperty({
  enum: ['red', 'yellow', 'green'],
  nullable: true,
})
readonly theme_phase!: ThemePhase | null;
```

On frontend (Zod) it is **optional + nullable** for backward compatibility with clients before deploy:

```ts
theme_phase: z.enum(['red', 'yellow', 'green']).nullable().optional()
```

---

## 2. Mapping `primary_issue` → driver KPI

| `primary_issue` | Driver KPI | Fallback |
| --- | --- | --- |
| `liquidity_risk` | `monthly_cash_flow` | worst level among `checking_runway_days` and `monthly_cash_flow` |
| `debt_pressure` | `debt_service_to_income` | worst level among step KPIs (that step only) |
| `credit_overuse` | `credit_utilization_index` | worst level among step KPIs (that step only) |
| `high_commitment` | `income_committed_pct` | worst level among step KPIs (that step only) |
| `low_surplus` | `surplus_capacity` | worst level among step KPIs (that step only) |
| `low_savings` | `savings_rate` | worst level among step KPIs (that step only) |
| `high_fixed_cost` | `fixed_vs_variable_split` | worst level among step KPIs (that step only) |
| `healthy` | (n/a) | always `green` |
| `data_incomplete` | (n/a) | always `null` |

### Level → phase mapping

```text
alert        → red
warn         → yellow
ok | absent  → green
```

(`healthy` and `data_incomplete` ignore this table.)

---

## 3. Catalog types (frontend)

```ts
type PlaybookSlug =
  | 'liquidity_risk'
  | 'debt_pressure'
  | 'credit_overuse'
  | 'high_commitment'
  | 'low_surplus'
  | 'low_savings'
  | 'high_fixed_cost'
  | 'healthy'
  | 'data_incomplete';

interface PhaseContent {
  readonly headline: string;        // e.g. "Stop getting worse"
  readonly objective: string;       // one sentence explaining phase focus
  readonly actions: readonly string[]; // 3–5 short imperative sentences
}

interface Playbook {
  readonly slug: PlaybookSlug;
  readonly title: string;           // e.g. "Almost all your income is already spoken for"
  readonly explanation: string;     // 1–2 plain sentences explaining the problem
  readonly phases: {
    readonly red: PhaseContent;
    readonly yellow: PhaseContent;
    readonly green: PhaseContent;
  };
  readonly rule: string;            // e.g. "Never commit more than 25% of income to installments"
  readonly expectedImpact: string;  // one positive-tone sentence
}
```

Public module API:

```ts
function getPlaybook(slug: string): Playbook;
const ALL_PLAYBOOKS: readonly Playbook[];
```

`getPlaybook` for unknown slug returns the `healthy` playbook (safe fallback).

---

## 4. Playbook validation rules (`playbooks.test.ts`)

| Rule | Fails when |
| --- | --- |
| **Coverage** | any of the 9 slugs in `PlaybookSlug` has no entry in `ALL_PLAYBOOKS` |
| **Required fields** | `title`, `explanation`, `rule`, or `expectedImpact` empty after `trim()` |
| **3 to 5 actions per phase** | `phases.red.actions.length`, `phases.yellow.actions.length`, or `phases.green.actions.length` outside `[3, 5]` |
| **Headline and objective** | `phase.headline` or `phase.objective` empty after `trim()` |
| **Plain language** | any text contains (case-insensitive) a substring from the forbidden list in `playbooks.test.ts` |
| **Fallback** | `getPlaybook('unknown_slug_xyz')` does not return `healthy` |

---

## 5. Persistence

**No database persistence** in this version. Playbook is **static in code** (frontend). The only backend “computed output” is `theme_phase`, derived at evaluation time from existing KPIs.

If in a future version the catalog moves to Mongo:

- Suggested collection: `decision_playbooks`.
- Document equivalent to `Playbook` above, with `slug` (unique index).
- Versioning via `version: number` + `publishedAt: Date`.
- In-memory backend cache to avoid read per request.

(Out of v1 scope.)
