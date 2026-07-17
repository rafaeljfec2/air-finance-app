import type { CompletePlanResponse } from '@/services/completePlanService';

export interface PeriodReadingProjectionMilestone {
  readonly id: 'today' | 'd30' | 'd60' | 'd90';
  readonly label: string;
  readonly committedPct: number;
  readonly totalCommitted: number;
}

export function buildPeriodReadingProjectionMilestones(input: {
  readonly todayCommittedPct: number;
  readonly todayTotalCommitted: number;
  readonly projection: CompletePlanResponse['projection'];
}): readonly PeriodReadingProjectionMilestone[] {
  return [
    {
      id: 'today',
      label: 'Hoje',
      committedPct: input.todayCommittedPct,
      totalCommitted: input.todayTotalCommitted,
    },
    {
      id: 'd30',
      label: '30 dias',
      committedPct: input.projection.in30Days.committedPct,
      totalCommitted: input.projection.in30Days.totalCommitted,
    },
    {
      id: 'd60',
      label: '60 dias',
      committedPct: input.projection.in60Days.committedPct,
      totalCommitted: input.projection.in60Days.totalCommitted,
    },
    {
      id: 'd90',
      label: '90 dias',
      committedPct: input.projection.in90Days.committedPct,
      totalCommitted: input.projection.in90Days.totalCommitted,
    },
  ];
}
