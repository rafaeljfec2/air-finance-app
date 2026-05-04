const KPI_PLAIN_PT: Readonly<Record<string, string>> = {
  debt_service_to_income: 'Compromisso com dívidas',
  income_committed_pct: 'Renda comprometida',
  monthly_cash_flow: 'Sobra no mês',
  savings_rate: 'Poupança',
  credit_utilization_index: 'Uso do crédito',
  surplus_capacity: 'Folga no orçamento',
  fixed_vs_variable_split: 'Peso das contas fixas',
  checking_runway_days: 'Reserva de caixa',
  data_quality: 'Qualidade dos dados',
};

function phraseForReason(id: string): string {
  const key = id.trim().toLowerCase();
  const mapped = KPI_PLAIN_PT[key];
  if (mapped !== undefined) {
    return mapped;
  }
  return id.replaceAll('_', ' ');
}

export function formatActionReasonsPlain(reasons: readonly string[]): string {
  if (reasons.length === 0) {
    return '';
  }
  return reasons.slice(0, 3).map(phraseForReason).join(' · ');
}
