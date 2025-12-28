import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip } from '@/components/ui/tooltip';
import { useIndebtedness } from '@/hooks/useIndebtedness';
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
import type { IndebtednessMetrics } from '@/types/indebtedness';

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
      message: 'Excelente! Seu uso de crédito está em um nível saudável. Continue mantendo abaixo de 30% para melhorar sua pontuação de crédito.',
      priority: 1,
    });
  } else if (data.creditUtilization.percentage < 70) {
    suggestions.push({
      type: 'info',
      message: 'Bom controle do uso de crédito. Tente manter o uso abaixo de 70% para evitar comprometer sua capacidade de pagamento.',
      priority: 2,
    });
  } else if (data.creditUtilization.percentage < 90) {
    suggestions.push({
      type: 'warning',
      message: 'Atenção: Seu uso de crédito está alto. Considere reduzir o uso do cartão de crédito e priorizar pagamentos para evitar estouro do limite.',
      priority: 3,
    });
  } else {
    suggestions.push({
      type: 'error',
      message: 'Crítico: Risco de estouro do limite. Priorize pagamentos imediatos e evite novos gastos no cartão até reduzir o uso.',
      priority: 4,
    });
  }

  // Liquidity Suggestions
  if (data.liquidity.status === 'positive' && data.liquidity.ratio > 1) {
    suggestions.push({
      type: 'success',
      message: 'Ótimo! Você tem recursos suficientes para cobrir suas obrigações. Considere investir o excedente disponível.',
      priority: 1,
    });
  } else if (data.liquidity.status === 'negative') {
    suggestions.push({
      type: 'warning',
      message: 'Atenção: Suas obrigações superam seu disponível. Revise seus gastos e considere reduzir despesas não essenciais.',
      priority: 3,
    });
  } else if (data.liquidity.status === 'critical') {
    suggestions.push({
      type: 'error',
      message: 'Alerta: Situação crítica de liquidez. Considere renegociar dívidas, aumentar receitas ou buscar ajuda financeira.',
      priority: 4,
    });
  }

  // Debt to Revenue Suggestions
  if (data.debtToRevenue.percentage < 50) {
    suggestions.push({
      type: 'success',
      message: 'Endividamento controlado em relação às receitas. Continue mantendo esse equilíbrio.',
      priority: 1,
    });
  } else if (data.debtToRevenue.percentage < 100) {
    suggestions.push({
      type: 'warning',
      message: 'Atenção: Considere um plano para reduzir as dívidas. Suas dívidas estão próximas de superar sua receita mensal.',
      priority: 3,
    });
  } else {
    suggestions.push({
      type: 'error',
      message: 'Crítico: Suas dívidas superam sua receita mensal. Busque ajuda financeira e elabore um plano de pagamento urgente.',
      priority: 4,
    });
  }

  // Account Balances Suggestions
  if (data.accountBalances.net < 0) {
    suggestions.push({
      type: 'warning',
      message: 'Seu saldo líquido está negativo. Priorize aumentar receitas ou reduzir despesas para equilibrar as contas.',
      priority: 2,
    });
  } else if (data.accountBalances.negative > 0) {
    suggestions.push({
      type: 'info',
      message: 'Você possui saldos negativos em algumas contas. Considere quitar essas dívidas para melhorar sua saúde financeira.',
      priority: 2,
    });
  }

  // Sort by priority (higher priority = more urgent)
  return suggestions.sort((a, b) => b.priority - a.priority).slice(0, 3);
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
        <div className="p-6">
          <div className="flex items-center justify-center h-32">
            <Spinner size="lg" className="text-primary-500" />
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
        <div className="p-6">
          <div className="flex items-center gap-3 text-sm text-red-500">
            <AlertTriangle className="h-5 w-5" />
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
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-6">
          Nível de Endividamento
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Uso de Crédito */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${creditUtilizationBgColor}`}>
                  <CreditCard className={`h-5 w-5 ${creditUtilizationColor}`} />
                </div>
                <span className="text-sm font-medium text-text dark:text-text-dark">
                  Uso de Crédito
                </span>
                <Tooltip
                  content="Percentual do seu limite de cartão que está sendo utilizado. Idealmente, mantenha abaixo de 30% para melhorar sua pontuação de crédito."
                >
                  <HelpCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 cursor-help" />
                </Tooltip>
              </div>
              <span className={`text-xs font-semibold ${creditUtilizationColor}`}>
                {getCreditUtilizationLabel(data.creditUtilization.status)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Quanto do seu limite de cartão está sendo usado
            </p>
            <div className="space-y-1">
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
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Percentual</span>
                  <span className={`text-sm font-bold ${creditUtilizationColor}`}>
                    {formatPercentage(data.creditUtilization.percentage)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      data.creditUtilization.status === 'low'
                        ? 'bg-green-500'
                        : data.creditUtilization.status === 'moderate'
                          ? 'bg-yellow-500'
                          : data.creditUtilization.status === 'high'
                            ? 'bg-orange-500'
                            : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(data.creditUtilization.percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Liquidez */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-lg ${
                    data.liquidity.status === 'positive'
                      ? 'bg-green-100 dark:bg-green-900/20'
                      : data.liquidity.status === 'negative'
                        ? 'bg-yellow-100 dark:bg-yellow-900/20'
                        : 'bg-red-100 dark:bg-red-900/20'
                  }`}
                >
                  {data.liquidity.status === 'positive' ? (
                    <TrendingUp className={`h-5 w-5 ${liquidityColor}`} />
                  ) : (
                    <TrendingDown className={`h-5 w-5 ${liquidityColor}`} />
                  )}
                </div>
                <span className="text-sm font-medium text-text dark:text-text-dark">Liquidez</span>
                <Tooltip
                  content="Indica quanto dinheiro você tem disponível após descontar todas as obrigações (contas a pagar e faturas). Um valor positivo significa que você consegue pagar suas contas."
                >
                  <HelpCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 cursor-help" />
                </Tooltip>
              </div>
              <span className={`text-xs font-semibold ${liquidityColor}`}>
                {getLiquidityLabel(data.liquidity.status)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Quanto você tem disponível para pagar suas obrigações
            </p>
            <div className="space-y-1">
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
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Índice acima de 1x significa que você tem mais recursos que obrigações
              </p>
            </div>
          </div>
        </div>

        {/* Endividamento Total e Endividamento/Receitas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-border dark:border-border-dark">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                <DollarSign className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-text dark:text-text-dark">
                Endividamento Total
              </span>
              <Tooltip
                content="Soma de todas as suas dívidas: saldos negativos de contas, faturas de cartão em aberto e contas a pagar pendentes."
              >
                <HelpCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 cursor-help" />
              </Tooltip>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Total de todas as suas dívidas
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {formatCurrency(data.totalDebt)}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="text-sm font-medium text-text dark:text-text-dark">
                Endividamento/Receitas
              </span>
              <Tooltip
                content="Indica quantos meses de receita você precisaria para quitar todas as dívidas. Valores acima de 100% indicam que as dívidas superam a receita mensal."
              >
                <HelpCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 cursor-help" />
              </Tooltip>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Comparação entre dívidas e receitas mensais
            </p>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatPercentage(data.debtToRevenue.percentage)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Receitas mensais: {formatCurrency(data.debtToRevenue.monthlyRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* Saldos de Contas */}
        <div className="mt-6 pt-6 border-t border-border dark:border-border-dark">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm font-medium text-text dark:text-text-dark">
              Saldos de Contas
            </span>
            <Tooltip
              content="Resumo dos saldos de todas as suas contas. Positivos são recursos disponíveis, negativos são dívidas ou saldos devedores."
            >
              <HelpCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 cursor-help" />
            </Tooltip>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            Resumo dos saldos de todas as suas contas
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Positivos</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(data.accountBalances.positive)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Negativos</p>
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(data.accountBalances.negative)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Líquido</p>
              <p
                className={`text-lg font-semibold ${
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
          <div className="mt-6 pt-6 border-t border-border dark:border-border-dark">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
              <span className="text-sm font-semibold text-text dark:text-text-dark">
                Recomendações
              </span>
            </div>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 ${
                    suggestion.type === 'success'
                      ? 'border-green-500'
                      : suggestion.type === 'warning'
                        ? 'border-yellow-500'
                        : suggestion.type === 'error'
                          ? 'border-red-500'
                          : 'border-blue-500'
                  }`}
                >
                  <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                  <p
                    className={`text-sm flex-1 ${getSuggestionColor(suggestion.type)}`}
                  >
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
