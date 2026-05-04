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

const PROBLEM_HEADLINE_PT: Readonly<Record<string, string>> = {
  debt_pressure: 'Suas dívidas estão consumindo sua renda.',
  liquidity_risk: 'O caixa pode não aguentar o que vem pela frente.',
  credit_overuse: 'Crédito cheio aumenta o risco do mês fechar no vermelho.',
  high_commitment: 'Quase toda a renda já tem dono antes do mês acabar.',
  low_surplus: 'Sobra pouco para absorver um imprevisto.',
  low_savings: 'Está ficando pouco para o futuro ou para emergências.',
  high_fixed_cost: 'Contas fixas pesadas deixam pouco espaço para manobrar.',
  data_incomplete: 'Sem dados completos, qualquer conselho vira chute.',
  healthy: 'Nada gritando alerta neste mês.',
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

export function problemHeadlineFromPrimaryIssue(slug: string): string {
  const trimmed = slug.trim();
  if (trimmed === '') {
    return 'Precisamos de mais contexto para ser diretos.';
  }
  const mapped = PROBLEM_HEADLINE_PT[trimmed.toLowerCase()];
  if (mapped !== undefined) {
    return mapped;
  }
  return 'Há um ponto de atenção neste mês.';
}
