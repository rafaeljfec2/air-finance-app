import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip } from '@/components/ui/tooltip';
import { useIndebtedness } from '@/hooks/useIndebtedness';
import type { IndebtednessMetrics } from '@/types/indebtedness';
import { formatCurrency } from '@/utils/formatters';
import {
  AlertTriangle,
  CreditCard,
  DollarSign,
  HelpCircle,
  Lightbulb,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useMemo } from 'react';

interface IndebtednessCardProps {
  companyId: string;
}

interface Suggestion {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  priority: number;
}

function getCreditUtilizationColor(status: string): string {
  switch (status) {
    case 'low':
      return 'text-green-600 dark:text-green-400';
    case 'moderate':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'high':
      return 'text-orange-600 dark:text-orange-400';
    case 'critical':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

function getCreditUtilizationBgColor(status: string): string {
  switch (status) {
    case 'low':
      return 'bg-green-100 dark:bg-green-900/20';
    case 'moderate':
      return 'bg-yellow-100 dark:bg-yellow-900/20';
    case 'high':
      return 'bg-orange-100 dark:bg-orange-900/20';
    case 'critical':
      return 'bg-red-100 dark:bg-red-900/20';
    default:
      return 'bg-gray-100 dark:bg-gray-900/20';
  }
}

function getLiquidityColor(status: string): string {
  switch (status) {
    case 'positive':
      return 'text-green-600 dark:text-green-400';
    case 'negative':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'critical':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

function getCreditUtilizationLabel(status: string): string {
  switch (status) {
    case 'low':
      return 'Baixo';
    case 'moderate':
      return 'Moderado';
    case 'high':
      return 'Alto';
    case 'critical':
      return 'Crítico';
    default:
      return 'Desconhecido';
  }
}

function getLiquidityLabel(status: string): string {
  switch (status) {
    case 'positive':
      return 'Saudável';
    case 'negative':
      return 'Atenção';
    case 'critical':
      return 'Crítico';
    default:
      return 'Desconhecido';
  }
}

/**
 * Generates contextual suggestions based on indebtedness metrics
 */
function generateSuggestions(data: IndebtednessMetrics): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Credit Utilization Suggestions
  if (data.creditUtilization.percentage < 30) {
    suggestions.push({
      type: 'success',
      message:
        'Excelente! Seu uso de crédito está em um nível saudável. Continue mantendo abaixo de 30% para melhorar sua pontuação de crédito.',
      priority: 1,
    });
  } else if (data.creditUtilization.percentage < 70) {
    suggestions.push({
      type: 'info',
      message:
        'Bom controle do uso de crédito. Tente manter o uso abaixo de 70% para evitar comprometer sua capacidade de pagamento.',
      priority: 2,
    });
  } else if (data.creditUtilization.percentage < 90) {
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

  // Liquidity Suggestions
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

  // Debt to Revenue Suggestions
  if (data.debtToRevenue.percentage < 50) {
    suggestions.push({
      type: 'success',
      message:
        'Endividamento controlado em relação às receitas. Continue mantendo esse equilíbrio.',
      priority: 1,
    });
  } else if (data.debtToRevenue.percentage < 100) {
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

  // Account Balances Suggestions
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

  // Sort by priority (higher priority = more urgent)
  const sortedSuggestions = [...suggestions].sort((a, b) => b.priority - a.priority);
  return sortedSuggestions.slice(0, 3);
}

function getSuggestionIcon(type: Suggestion['type']) {
  switch (type) {
    case 'success':
      return '✅';
    case 'warning':
      return '⚠️';
    case 'error':
      return '🚨';
    case 'info':
      return '💡';
    default:
      return 'ℹ️';
  }
}

function getSuggestionColor(type: Suggestion['type']): string {
  switch (type) {
    case 'success':
      return 'text-green-600 dark:text-green-400';
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'error':
      return 'text-red-600 dark:text-red-400';
    case 'info':
      return 'text-blue-600 dark:text-blue-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
}

function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

function getProgressBarColor(status: string): string {
  if (status === 'low') {
    return 'bg-green-500';
  }
  if (status === 'moderate') {
    return 'bg-yellow-500';
  }
  if (status === 'high') {
    return 'bg-orange-500';
  }
  return 'bg-red-500';
}

function getLiquidityIcon(status: string): 'positive' | 'negative' {
  return status === 'positive' ? 'positive' : 'negative';
}

function getSuggestionBorderColor(type: Suggestion['type']): string {
  if (type === 'success') {
    return 'border-green-500';
  }
  if (type === 'warning') {
    return 'border-yellow-500';
  }
  if (type === 'error') {
    return 'border-red-500';
  }
  return 'border-blue-500';
}

function getLiquidityBgColor(status: string): string {
  if (status === 'positive') {
    return 'bg-green-100 dark:bg-green-900/20';
  }
  if (status === 'negative') {
    return 'bg-yellow-100 dark:bg-yellow-900/20';
  }
  return 'bg-red-100 dark:bg-red-900/20';
}

export function IndebtednessCard({ companyId }: Readonly<IndebtednessCardProps>) {
  const { data, isLoading, error } = useIndebtedness(companyId);

  const creditUtilizationColor = useMemo(
    () => (data ? getCreditUtilizationColor(data.creditUtilization.status) : ''),
    [data],
  );

  const creditUtilizationBgColor = useMemo(
    () => (data ? getCreditUtilizationBgColor(data.creditUtilization.status) : ''),
    [data],
  );

  const liquidityColor = useMemo(
    () => (data ? getLiquidityColor(data.liquidity.status) : ''),
    [data],
  );

  const suggestions = useMemo(() => (data ? generateSuggestions(data) : []), [data]);

  if (!companyId) {
    return null;
  }

  if (isLoading) {
    return (
      <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
        <div className="p-4">
          <div className="flex items-center justify-center h-24">
            <Spinner size="lg" className="text-primary-500" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
        <div className="p-4">
          <div className="flex items-center gap-2 text-sm text-red-500">
            <AlertTriangle className="h-4 w-4" />
            <span>Erro ao carregar métricas de endividamento.</span>
          </div>
        </div>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
      <div className="p-4">
        <h3 className="text-base font-semibold text-text dark:text-text-dark mb-4">
          Nível de Endividamento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Uso de Crédito */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={`p-1.5 rounded-lg ${creditUtilizationBgColor}`}>
                  <CreditCard className={`h-4 w-4 ${creditUtilizationColor}`} />
                </div>
                <span className="text-sm font-medium text-text dark:text-text-dark">
                  Uso de Crédito
                </span>
                <Tooltip content="Percentual do seu limite de cartão que está sendo utilizado. Idealmente, mantenha abaixo de 30% para melhorar sua pontuação de crédito.">
                  <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 cursor-help" />
                </Tooltip>
              </div>
              <span className={`text-xs font-semibold ${creditUtilizationColor}`}>
                {getCreditUtilizationLabel(data.creditUtilization.status)}
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Utilizado</span>
                <span className="text-sm font-semibold text-text dark:text-text-dark">
                  {formatCurrency(data.creditUtilization.used)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Disponível</span>
                <span className="text-sm font-semibold text-text dark:text-text-dark">
                  {formatCurrency(data.creditUtilization.available)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Limite Total</span>
                <span className="text-sm font-semibold text-text dark:text-text-dark">
                  {formatCurrency(data.creditUtilization.total)}
                </span>
              </div>
              <div className="mt-1.5">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Percentual</span>
                  <span className={`text-sm font-bold ${creditUtilizationColor}`}>
                    {formatPercentage(data.creditUtilization.percentage)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${getProgressBarColor(data.creditUtilization.status)}`}
                    style={{ width: `${Math.min(data.creditUtilization.percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Liquidez */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className={`p-1.5 rounded-lg ${getLiquidityBgColor(data.liquidity.status)}`}>
                  {getLiquidityIcon(data.liquidity.status) === 'positive' ? (
                    <TrendingUp className={`h-4 w-4 ${liquidityColor}`} />
                  ) : (
                    <TrendingDown className={`h-4 w-4 ${liquidityColor}`} />
                  )}
                </div>
                <span className="text-sm font-medium text-text dark:text-text-dark">Liquidez</span>
                <Tooltip content="Indica quanto dinheiro você tem disponível após descontar todas as obrigações (contas a pagar e faturas). Um valor positivo significa que você consegue pagar suas contas.">
                  <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 cursor-help" />
                </Tooltip>
              </div>
              <span className={`text-xs font-semibold ${liquidityColor}`}>
                {getLiquidityLabel(data.liquidity.status)}
              </span>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Disponível</span>
                <span className="text-sm font-semibold text-text dark:text-text-dark">
                  {formatCurrency(data.liquidity.available)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Obrigações</span>
                <span className="text-sm font-semibold text-text dark:text-text-dark">
                  {formatCurrency(data.liquidity.obligations)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">Índice</span>
                <span className={`text-sm font-bold ${liquidityColor}`}>
                  {data.liquidity.ratio.toFixed(2)}x
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Endividamento Total e Endividamento/Receitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-border dark:border-border-dark">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/20">
                <DollarSign className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-text dark:text-text-dark">
                Endividamento Total
              </span>
              <Tooltip content="Soma de todas as suas dívidas: saldos negativos de contas, faturas de cartão em aberto e contas a pagar pendentes.">
                <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 cursor-help" />
              </Tooltip>
            </div>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(data.totalDebt)}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-sm font-medium text-text dark:text-text-dark">
                Endividamento/Receitas
              </span>
              <Tooltip content="Indica quantos meses de receita você precisaria para quitar todas as dívidas. Valores acima de 100% indicam que as dívidas superam a receita mensal.">
                <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 cursor-help" />
              </Tooltip>
            </div>
            <div>
              <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {formatPercentage(data.debtToRevenue.percentage)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Receitas: {formatCurrency(data.debtToRevenue.monthlyRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* Saldos de Contas */}
        <div className="mt-4 pt-4 border-t border-border dark:border-border-dark">
          <div className="flex items-center gap-1.5 mb-2">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-text dark:text-text-dark">
              Saldos de Contas
            </span>
            <Tooltip content="Resumo dos saldos de todas as suas contas. Positivos são recursos disponíveis, negativos são dívidas ou saldos devedores.">
              <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 cursor-help" />
            </Tooltip>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Positivos</p>
              <p className="text-base font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(data.accountBalances.positive)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Negativos</p>
              <p className="text-base font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(data.accountBalances.negative)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Líquido</p>
              <p
                className={`text-base font-semibold ${
                  data.accountBalances.net >= 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {formatCurrency(data.accountBalances.net)}
              </p>
            </div>
          </div>
        </div>

        {/* Recomendações */}
        {suggestions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border dark:border-border-dark">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
              <span className="text-sm font-semibold text-text dark:text-text-dark">
                Recomendações
              </span>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion) => (
                <div
                  key={`${suggestion.type}-${suggestion.message.substring(0, 20)}`}
                  className={`flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 ${getSuggestionBorderColor(suggestion.type)}`}
                >
                  <span className="text-base flex-shrink-0">
                    {getSuggestionIcon(suggestion.type)}
                  </span>
                  <p className={`text-xs flex-1 ${getSuggestionColor(suggestion.type)}`}>
                    {suggestion.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
