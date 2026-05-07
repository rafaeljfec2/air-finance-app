import { PRIMARY_ISSUE_SLUGS, type PrimaryIssueSlug } from '@/types/decisionEngine';

function isPrimaryIssueSlug(value: string): value is PrimaryIssueSlug {
  return (PRIMARY_ISSUE_SLUGS as readonly string[]).includes(value);
}

export function isTechnicalOrderingRationale(rationale: string): boolean {
  const t = rationale.trim();
  if (t === '') {
    return false;
  }
  if (/FR-\d/i.test(t)) {
    return true;
  }
  if (/KPIs?\s+considerados/i.test(t)) {
    return true;
  }
  if (
    /\b(fixed_vs_variable_split|debt_service_to_income|income_committed_pct|credit_utilization_index)\b/.test(
      t,
    )
  ) {
    return true;
  }
  return false;
}

const TECHNICAL_SUMMARY_PT: Readonly<Partial<Record<PrimaryIssueSlug, string>>> = {
  data_incomplete:
    'Com os dados que temos hoje, o foco é completar informações para a leitura ficar segura.',
  liquidity_risk:
    'O motor destacou risco de caixa: prioridade para o que mantém você líquido no dia a dia.',
  debt_pressure: 'O motor destacou pressão de dívidas sobre a renda.',
  credit_overuse: 'O motor destacou uso intenso de linhas de crédito.',
  high_commitment: 'O motor destacou muita renda já comprometida antes do mês fechar.',
  low_surplus: 'O motor destacou pouca margem depois do essencial.',
  low_savings: 'O motor destacou pouca capacidade de poupar neste cenário.',
  high_fixed_cost:
    'Grande parte do mês vai para despesas fixas — muitas são compromissos longos (casa, carro, contratos). Isso reduz a margem para ajustes rápidos, mesmo quando parcelas de cartão estão sob controle.',
  healthy: 'Leitura geral estável neste período.',
};

export function displayOrderingRationaleForUser(rationale: string, primaryIssue: string): string {
  const raw = rationale.trim();
  if (raw === '') {
    return '';
  }
  if (!isTechnicalOrderingRationale(raw)) {
    return raw;
  }
  const key = primaryIssue.trim().toLowerCase();
  if (isPrimaryIssueSlug(key)) {
    const mapped = TECHNICAL_SUMMARY_PT[key];
    if (mapped !== undefined) {
      return mapped;
    }
  }
  return 'O app priorizou o tema que mais precisa de atenção neste mês, combinando vários sinais das suas finanças.';
}
