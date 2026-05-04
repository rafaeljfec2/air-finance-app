import { creditOverusePlaybook } from './creditOveruse';
import { dataIncompletePlaybook } from './dataIncomplete';
import { debtPressurePlaybook } from './debtPressure';
import { healthyPlaybook } from './healthy';
import { highCommitmentPlaybook } from './highCommitment';
import { highFixedCostPlaybook } from './highFixedCost';
import { liquidityRiskPlaybook } from './liquidityRisk';
import { lowSavingsPlaybook } from './lowSavings';
import { lowSurplusPlaybook } from './lowSurplus';
import type { Playbook, PlaybookSlug } from './types';

const PLAYBOOK_REGISTRY: Record<PlaybookSlug, Playbook> = {
  liquidity_risk: liquidityRiskPlaybook,
  debt_pressure: debtPressurePlaybook,
  credit_overuse: creditOverusePlaybook,
  high_commitment: highCommitmentPlaybook,
  low_surplus: lowSurplusPlaybook,
  low_savings: lowSavingsPlaybook,
  high_fixed_cost: highFixedCostPlaybook,
  healthy: healthyPlaybook,
  data_incomplete: dataIncompletePlaybook,
};

export function getPlaybook(slug: string): Playbook {
  if (slug in PLAYBOOK_REGISTRY) {
    return PLAYBOOK_REGISTRY[slug as PlaybookSlug];
  }
  return PLAYBOOK_REGISTRY.healthy;
}

export const ALL_PLAYBOOKS: readonly Playbook[] = Object.values(PLAYBOOK_REGISTRY);

export type { Playbook, PhaseContent, PlaybookSlug, ThemePhase } from './types';
