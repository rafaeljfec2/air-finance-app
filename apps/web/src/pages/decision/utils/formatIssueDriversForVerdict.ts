import type { DecisionEngineEvaluateResponse } from '@/services/decisionEngineService';

import { formatBrl, formatPercent } from '../components/complete-plan/format';
import { kpiPlainLabelPt } from '../kpiPlainLabels';

const RATIO_KPIS = new Set<string>([
  'savings_rate',
  'income_committed_pct',
  'credit_utilization_index',
  'fixed_vs_variable_split',
  'debt_service_to_income',
  'surplus_capacity',
]);

export function formatKpiValueForVerdict(
  kpiId: string,
  value: number | null | undefined,
): string | null {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }
  if (kpiId === 'checking_runway_days') {
    return `${Math.round(value)} dias`;
  }
  if (RATIO_KPIS.has(kpiId) && Math.abs(value) <= 1.0001) {
    return formatPercent(value);
  }
  if (kpiId === 'monthly_cash_flow') {
    return formatBrl(value);
  }
  return `${value}`;
}

export interface IssueDriverWire {
  readonly kpi_id: string;
  readonly level: DecisionEngineEvaluateResponse['issue_drivers'][number]['level'];
  readonly value?: number | null;
}

export function summarizeIssueDriversForVerdict(drivers: readonly IssueDriverWire[]): string {
  if (drivers.length === 0) {
    return '';
  }
  const parts = drivers.map((d) => {
    const name = kpiPlainLabelPt(d.kpi_id);
    const val = formatKpiValueForVerdict(d.kpi_id, d.value);
    return val !== null ? `${name}: ${val}` : name;
  });
  return parts.join(' · ');
}
