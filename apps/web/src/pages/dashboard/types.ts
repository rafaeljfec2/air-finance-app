export type CapacityState = 'excellent' | 'good' | 'attention' | 'critical' | 'inconclusive';

export type PillarId = 'liquidity' | 'flow' | 'structure' | 'credit' | 'resilience' | 'wealth';

export interface PillarInfluencers {
  readonly improves: readonly string[];
  readonly worsens: readonly string[];
}

export interface FinancialHealthPillar {
  readonly id: PillarId;
  readonly name: string;
  readonly question: string;
  /** Human horizon for this pillar (short / this period / long). */
  readonly horizonLabel: string;
  readonly primaryLabel: string;
  readonly primaryValue: number | null;
  readonly primaryFormatted: string | null;
  readonly state: CapacityState;
  readonly interpretation: string;
  readonly influencers: PillarInfluencers;
  readonly connections: readonly string[];
  readonly summarySentence: string;
  readonly hasGap: boolean;
  /** Human limitation / inclusion note for L2–L3 (never internal IDs or jargon). */
  readonly exploreHint: string | null;
}

export interface FinancialHealthCheckup {
  readonly surfaceQuestion: string;
  readonly pillars: readonly FinancialHealthPillar[];
  readonly closingSynthesis: string;
  readonly hasCriticalBase: boolean;
}

export const PILLAR_ORDER: readonly PillarId[] = [
  'liquidity',
  'flow',
  'structure',
  'credit',
  'resilience',
  'wealth',
] as const;

export const CAPACITY_STATE_LABEL: Record<CapacityState, string> = {
  excellent: 'Excelente',
  good: 'Boa',
  attention: 'Atenção',
  critical: 'Crítica',
  inconclusive: 'Inconclusivo',
};
