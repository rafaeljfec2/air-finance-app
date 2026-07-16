import type { FinancialArchetype } from '@/types/decisionDashboard';

export interface FesStubState {
  readonly archetype: FinancialArchetype;
  readonly readyForNext: boolean;
  readonly isFirstAccess: boolean;
}

/** Wave 1 stub: Financial Evolution System is not persisted yet. */
export function resolveFesStub(): FesStubState {
  return {
    archetype: 'survivor',
    readyForNext: false,
    isFirstAccess: false,
  };
}
