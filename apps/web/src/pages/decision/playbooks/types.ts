export type ThemePhase = 'red' | 'yellow' | 'green';

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
