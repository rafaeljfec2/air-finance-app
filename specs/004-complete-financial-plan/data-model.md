# Data Model — Complete Financial Plan

## Tipos do backend (`src/decision-engine/complete-plan/domain/complete-plan.types.ts`)

```ts
export type InstallmentPriority = 'high' | 'medium' | 'low';
export type InstallmentAccountType = 'credit_card' | 'other';

export interface ActiveInstallmentSummary {
  description: string;
  monthlyValue: number;
  remaining: number;
  endDate: string;          // YYYY-MM-DD
  accountId: string;
  accountType: InstallmentAccountType;
  categoryId?: string | null;
  priority: InstallmentPriority;
}

export interface NumbersSummary {
  netIncome: number;
  totalCommitted: number;
  committedPct: number;     // 0..1
  healthyTargetPct: number; // 0.25 (V1)
  reductionNeeded: number;  // 0 if already healthy
}

export interface ProjectionStep {
  totalCommitted: number;
  committedPct: number;     // 0..1
  installmentsEnding: number;
}

export interface ProjectionSummary {
  in30Days: ProjectionStep;
  in60Days: ProjectionStep;
  in90Days: ProjectionStep;
  ifNoChange: string;
}

export interface CategoryBreakdown {
  name: string;
  amount: number;
  share: number;            // 0..1
}

export interface BehaviorSummary {
  topCategories: CategoryBreakdown[];
  peakDaysOfMonth: number[] | null;
  creditUtilizationTrend: null; // V1
}

export interface PersonalRule {
  id: string;
  text: string;
  rationale: string;
}

export interface InstallmentsStrategy {
  items: ActiveInstallmentSummary[];
  suggestion: string;
}

export interface CompletePlanOutput {
  status: 'healthy' | 'attention' | 'critical';
  primary_issue: PrimaryIssueSlug;
  theme_phase: 'red' | 'yellow' | 'green' | null;
  diagnosis: string;
  numbers: NumbersSummary;
  projection: ProjectionSummary;
  installmentsStrategy: InstallmentsStrategy;
  behavior: BehaviorSummary;
  personalRules: PersonalRule[];
  simpleRule: string;
  expectedOutcome: string;
  llmCached: boolean;
  ruleEngineVersion?: string;
}
```

## Persistência — `AgentInsight`

Reutiliza schema existente. Documento criado pelo `LLMNarrativeService`:

| Campo | Valor |
| --- | --- |
| `agentId` | `complete-plan-narrative` |
| `agentVersion` | `1.0.0` |
| `companyId` | id da empresa |
| `userId` | id do usuário que disparou |
| `targetId` | mesma da empresa (chave de leitura) |
| `triggerType` | `on_demand` |
| `contextHash` | sha256 do payload reduzido (24 chars) |
| `output` | `{ diagnosis, expectedOutcome }` |
| `status` | `success` |
| `expiresAt` | now + 7 dias |

TTL aplicado via index `expireAfterSeconds: 0` já existente no schema.

## Schema runtime (frontend, Zod)

Definido em `src/services/completePlanService.ts` espelhando 1:1 o DTO. Aceita:

- `theme_phase` `null` (caso `data_incomplete`).
- `categoryId` opcional/`null`.
- `peakDaysOfMonth` `null`.
- `creditUtilizationTrend` sempre `null`.
