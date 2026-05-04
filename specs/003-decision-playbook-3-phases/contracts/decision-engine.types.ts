/**
 * Cross-boundary contract: Decision Playbook (3 phases).
 *
 * Adds `theme_phase` to DecisionEngineOutput from spec 001 and defines the
 * frontend playbook catalog shape (PT-BR copy lives at
 * `apps/web/src/pages/decision/playbooks/`).
 *
 * Spec: specs/003-decision-playbook-3-phases/spec.md v0.1
 *
 * Backend reference (already implemented):
 *   back-end-financeiro-nestjs/src/decision-engine/domain/theme-phase.resolver.ts
 *   back-end-financeiro-nestjs/src/decision-engine/dto/decision-engine-response.dto.ts
 *
 * Frontend reference (already implemented):
 *   apps/web/src/pages/decision/playbooks/types.ts
 *   apps/web/src/pages/decision/playbooks/index.ts
 *   apps/web/src/pages/decision/components/DecisionPlaybookCard.tsx
 */

/* ----------------------------------------------------------------------- */
/* Wire-level addition to DecisionEngineOutput                              */
/* ----------------------------------------------------------------------- */

export type ThemePhase = 'red' | 'yellow' | 'green';

/**
 * Delta added to `DecisionEngineOutput` defined in
 * specs/001-financial-decision-engine/contracts/decision-engine.types.ts.
 *
 * `null` when `primary_issue` is `data_incomplete`.
 * Always `'green'` when `primary_issue` is `healthy`.
 * Otherwise derived from the level of the KPI driver of the active theme
 * (see data-model.md §2). Optional/nullable on the wire for backward compatibility.
 */
export interface DecisionEngineOutputThemePhaseDelta {
  readonly theme_phase: ThemePhase | null;
}

/* ----------------------------------------------------------------------- */
/* Frontend catalog (PT-BR copy)                                            */
/* ----------------------------------------------------------------------- */

export type PlaybookSlug =
  | 'liquidity_risk'
  | 'debt_pressure'
  | 'credit_overuse'
  | 'high_commitment'
  | 'low_surplus'
  | 'low_savings'
  | 'high_fixed_cost'
  | 'healthy'
  | 'data_incomplete';

export interface PhaseContent {
  readonly headline: string;
  readonly objective: string;
  /** 3 to 5 short PT-BR action sentences (validated in playbooks.test.ts). */
  readonly actions: readonly string[];
}

export interface Playbook {
  readonly slug: PlaybookSlug;
  readonly title: string;
  readonly explanation: string;
  readonly phases: {
    readonly red: PhaseContent;
    readonly yellow: PhaseContent;
    readonly green: PhaseContent;
  };
  readonly rule: string;
  readonly expectedImpact: string;
}

/**
 * Public API of the frontend catalog. Implementation lives at
 * `apps/web/src/pages/decision/playbooks/index.ts`.
 *
 * Unknown slug falls back to the `healthy` playbook (safe default).
 */
export type GetPlaybook = (slug: string) => Playbook;
