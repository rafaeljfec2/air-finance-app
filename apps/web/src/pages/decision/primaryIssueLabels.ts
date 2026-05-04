const PRIMARY_ISSUE_LABELS_PT: Readonly<Record<string, string>> = {
  data_incomplete: 'Dados incompletos',
  healthy: 'Situação saudável',
  liquidity_risk: 'Risco de liquidez',
  debt_pressure: 'Pressão da dívida',
  credit_overuse: 'Uso excessivo de crédito',
  high_commitment: 'Renda muito comprometida',
  low_surplus: 'Pouca sobra prevista',
  low_savings: 'Poupança baixa',
  high_fixed_cost: 'Custos fixos altos',
};

function humanizeSlug(slug: string): string {
  return slug.replaceAll('_', ' ');
}

export function formatPrimaryIssueLabel(slug: string): string {
  const trimmed = slug.trim();
  if (trimmed === '') {
    return 'Sem foco definido';
  }
  const mapped = PRIMARY_ISSUE_LABELS_PT[trimmed.toLowerCase()];
  if (mapped !== undefined) {
    return mapped;
  }
  return humanizeSlug(trimmed);
}
