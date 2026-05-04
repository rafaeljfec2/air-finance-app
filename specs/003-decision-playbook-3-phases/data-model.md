# Data Model — Decision playbook 3 phases

> Tipos compartilhados (frontend) + KPI driver por slug (backend). Sem persistência em banco nesta versão.

---

## 1. Tipos do contrato (backend ↔ frontend)

### `ThemePhase`

```ts
type ThemePhase = 'red' | 'yellow' | 'green';
```

Aparece no contrato HTTP como string (enum) **ou** `null`. Significados:

- `'red'` — usuário está em situação crítica para este tema; objetivo da fase é **parar de piorar**.
- `'yellow'` — usuário está se ajustando; objetivo é **organizar e recuperar equilíbrio**.
- `'green'` — usuário está saudável neste tema; objetivo é **manter** o controle.
- `null` — não há fase aplicável (caso `primary_issue = data_incomplete`).

### Adição ao `DecisionEngineOutput`

```ts
interface DecisionEngineOutput {
  // ... campos existentes (status, primary_issue, ordering_rationale, actions, ruleEngineVersion)
  theme_phase: ThemePhase | null;
}
```

No DTO HTTP do backend (`DecisionEngineResponseDto`) o campo é exposto como:

```ts
@ApiProperty({
  enum: ['red', 'yellow', 'green'],
  nullable: true,
})
readonly theme_phase!: ThemePhase | null;
```

No frontend (Zod) é **opcional + nullable** para backward compatibility com clientes antes do deploy:

```ts
theme_phase: z.enum(['red', 'yellow', 'green']).nullable().optional()
```

---

## 2. Mapeamento `primary_issue` → KPI driver

| `primary_issue` | KPI driver | Fallback |
| --- | --- | --- |
| `liquidity_risk` | `monthly_cash_flow` | pior nível entre `checking_runway_days` e `monthly_cash_flow` |
| `debt_pressure` | `debt_service_to_income` | pior nível dos KPIs do degrau (apenas o próprio) |
| `credit_overuse` | `credit_utilization_index` | pior nível dos KPIs do degrau (apenas o próprio) |
| `high_commitment` | `income_committed_pct` | pior nível dos KPIs do degrau (apenas o próprio) |
| `low_surplus` | `surplus_capacity` | pior nível dos KPIs do degrau (apenas o próprio) |
| `low_savings` | `savings_rate` | pior nível dos KPIs do degrau (apenas o próprio) |
| `high_fixed_cost` | `fixed_vs_variable_split` | pior nível dos KPIs do degrau (apenas o próprio) |
| `healthy` | (n/a) | sempre `green` |
| `data_incomplete` | (n/a) | sempre `null` |

### Mapeamento nível → fase

```text
alert        → red
warn         → yellow
ok | absent  → green
```

(`healthy` e `data_incomplete` ignoram a tabela.)

---

## 3. Tipos do catálogo (frontend)

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
  readonly headline: string;        // ex.: "Pare de piorar"
  readonly objective: string;       // 1 frase explicando o foco da fase
  readonly actions: readonly string[]; // 3 a 5 frases, imperativo curto
}

interface Playbook {
  readonly slug: PlaybookSlug;
  readonly title: string;           // ex.: "Quase toda a renda já tem dono"
  readonly explanation: string;     // 1-2 frases leigas explicando o problema
  readonly phases: {
    readonly red: PhaseContent;
    readonly yellow: PhaseContent;
    readonly green: PhaseContent;
  };
  readonly rule: string;            // ex.: "Nunca comprometer mais de 25% da renda com parcelas"
  readonly expectedImpact: string;  // 1 frase em tom positivo
}
```

API pública do módulo:

```ts
function getPlaybook(slug: string): Playbook;
const ALL_PLAYBOOKS: readonly Playbook[];
```

`getPlaybook` para slug desconhecido devolve o playbook de `healthy` (fallback seguro).

---

## 4. Regras de validação dos playbooks (`playbooks.test.ts`)

| Regra | Falha quando |
| --- | --- |
| **Cobertura** | qualquer um dos 9 slugs em `PlaybookSlug` não tem entrada em `ALL_PLAYBOOKS` |
| **Campos obrigatórios** | `title`, `explanation`, `rule` ou `expectedImpact` vazios após `trim()` |
| **3 a 5 ações por fase** | `phases.red.actions.length`, `phases.yellow.actions.length` ou `phases.green.actions.length` fora de `[3, 5]` |
| **Headline e objective** | `phase.headline` ou `phase.objective` vazios após `trim()` |
| **Linguagem leiga** | qualquer texto contém (case-insensitive) os termos: `KPI`, `índice`, `taxa de`, `rotativo`, `severity`, `snapshot` |
| **Fallback** | `getPlaybook('unknown_slug_xyz')` não devolve `healthy` |

---

## 5. Persistência

**Nenhuma persistência em banco** nesta versão. O playbook é **estático em código** (frontend). A única "saída computada" no backend é o `theme_phase`, derivado em tempo de avaliação a partir dos KPIs já existentes.

Se em uma futura versão o catálogo migrar para Mongo:

- Coleção sugerida: `decision_playbooks`.
- Documento equivalente ao tipo `Playbook` acima, com `slug` (índice único).
- Versionamento via campo `version: number` + `publishedAt: Date`.
- Cache em memória do backend para evitar leitura por request.

(Fora do escopo v1.)
