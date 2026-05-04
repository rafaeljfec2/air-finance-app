import type { IndebtednessMetrics } from '@/types/indebtedness';

import {
  PROGRESS_BAR_COLORS,
  STATUS_BG_COLORS,
  STATUS_COLORS,
  STATUS_LABELS,
  SUGGESTION_CONFIG,
} from './indebtednessCard.constants';
import type { Suggestion } from './indebtednessCard.types';

export function getCreditUtilizationColor(status: string): string {
  return (
    STATUS_COLORS.credit[status as keyof typeof STATUS_COLORS.credit] ??
    'text-gray-600 dark:text-gray-400'
  );
}

export function getCreditUtilizationBgColor(status: string): string {
  return (
    STATUS_BG_COLORS.credit[status as keyof typeof STATUS_BG_COLORS.credit] ??
    'bg-gray-100 dark:bg-gray-900/20'
  );
}

export function getLiquidityColor(status: string): string {
  return (
    STATUS_COLORS.liquidity[status as keyof typeof STATUS_COLORS.liquidity] ??
    'text-gray-600 dark:text-gray-400'
  );
}

export function getLiquidityBgColor(status: string): string {
  return (
    STATUS_BG_COLORS.liquidity[status as keyof typeof STATUS_BG_COLORS.liquidity] ??
    'bg-gray-100 dark:bg-gray-900/20'
  );
}

export function getCreditUtilizationLabel(status: string): string {
  return STATUS_LABELS.credit[status as keyof typeof STATUS_LABELS.credit] ?? 'Desconhecido';
}

export function getLiquidityLabel(status: string): string {
  return STATUS_LABELS.liquidity[status as keyof typeof STATUS_LABELS.liquidity] ?? 'Desconhecido';
}

export function getProgressBarColor(status: string): string {
  return PROGRESS_BAR_COLORS[status as keyof typeof PROGRESS_BAR_COLORS] ?? 'bg-gray-500';
}

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

export function getSuggestionConfig(type: Suggestion['type']) {
  return SUGGESTION_CONFIG[type];
}

export function generateSuggestions(data: IndebtednessMetrics): Suggestion[] {
  const suggestions: Suggestion[] = [];

  const creditPercentage = data.creditUtilization.percentage;
  if (creditPercentage < 30) {
    suggestions.push({
      type: 'success',
      message:
        'Excelente! Seu uso de crédito está em um nível saudável. Continue mantendo abaixo de 30% para melhorar sua pontuação de crédito.',
      priority: 1,
    });
  } else if (creditPercentage < 70) {
    suggestions.push({
      type: 'info',
      message:
        'Bom controle do uso de crédito. Tente manter o uso abaixo de 70% para evitar comprometer sua capacidade de pagamento.',
      priority: 2,
    });
  } else if (creditPercentage < 90) {
    suggestions.push({
      type: 'warning',
      message:
        'Atenção: Seu uso de crédito está alto. Considere reduzir o uso do cartão de crédito e priorizar pagamentos para evitar estouro do limite.',
      priority: 3,
    });
  } else {
    suggestions.push({
      type: 'error',
      message:
        'Crítico: Risco de estouro do limite. Priorize pagamentos imediatos e evite novos gastos no cartão até reduzir o uso.',
      priority: 4,
    });
  }

  if (data.liquidity.status === 'positive' && data.liquidity.ratio > 1) {
    suggestions.push({
      type: 'success',
      message:
        'Ótimo! Você tem recursos suficientes para cobrir suas obrigações. Considere investir o excedente disponível.',
      priority: 1,
    });
  } else if (data.liquidity.status === 'negative') {
    suggestions.push({
      type: 'warning',
      message:
        'Atenção: Suas obrigações superam seu disponível. Revise seus gastos e considere reduzir despesas não essenciais.',
      priority: 3,
    });
  } else if (data.liquidity.status === 'critical') {
    suggestions.push({
      type: 'error',
      message:
        'Alerta: Situação crítica de liquidez. Considere renegociar dívidas, aumentar receitas ou buscar ajuda financeira.',
      priority: 4,
    });
  }

  const debtToRevenue = data.debtToRevenue.percentage;
  if (debtToRevenue < 50) {
    suggestions.push({
      type: 'success',
      message:
        'Endividamento controlado em relação às receitas. Continue mantendo esse equilíbrio.',
      priority: 1,
    });
  } else if (debtToRevenue < 100) {
    suggestions.push({
      type: 'warning',
      message:
        'Atenção: Considere um plano para reduzir as dívidas. Suas dívidas estão próximas de superar sua receita mensal.',
      priority: 3,
    });
  } else {
    suggestions.push({
      type: 'error',
      message:
        'Crítico: Suas dívidas superam sua receita mensal. Busque ajuda financeira e elabore um plano de pagamento urgente.',
      priority: 4,
    });
  }

  if (data.accountBalances.net < 0) {
    suggestions.push({
      type: 'warning',
      message:
        'Seu saldo líquido está negativo. Priorize aumentar receitas ou reduzir despesas para equilibrar as contas.',
      priority: 2,
    });
  } else if (data.accountBalances.negative > 0) {
    suggestions.push({
      type: 'info',
      message:
        'Você possui saldos negativos em algumas contas. Considere quitar essas dívidas para melhorar sua saúde financeira.',
      priority: 2,
    });
  }

  const sortedSuggestions = [...suggestions].sort((a, b) => b.priority - a.priority);
  return sortedSuggestions.slice(0, 3);
}
