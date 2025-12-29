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
import React, { useMemo } from 'react';

interface IndebtednessCardProps {
  companyId: string;
}

interface Suggestion {
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  priority: number;
}

interface MetricHeaderProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly tooltipContent: string;
  readonly status?: string;
  readonly statusColor?: string;
}

interface MetricValueRowProps {
  readonly label: string;
  readonly value: string;
}

// ==================== Color & Status Utilities ====================

const STATUS_COLORS = {
  credit: {
    low: 'text-green-600 dark:text-green-400',
    moderate: 'text-yellow-600 dark:text-yellow-400',
    high: 'text-orange-600 dark:text-orange-400',
    critical: 'text-red-600 dark:text-red-400',
  },
  liquidity: {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-yellow-600 dark:text-yellow-400',
    critical: 'text-red-600 dark:text-red-400',
  },
} as const;

const STATUS_BG_COLORS = {
  credit: {
    low: 'bg-green-100 dark:bg-green-900/20',
    moderate: 'bg-yellow-100 dark:bg-yellow-900/20',
    high: 'bg-orange-100 dark:bg-orange-900/20',
    critical: 'bg-red-100 dark:bg-red-900/20',
  },
  liquidity: {
    positive: 'bg-green-100 dark:bg-green-900/20',
    negative: 'bg-yellow-100 dark:bg-yellow-900/20',
    critical: 'bg-red-100 dark:bg-red-900/20',
  },
} as const;

const STATUS_LABELS = {
  credit: {
    low: 'Baixo',
    moderate: 'Moderado',
    high: 'Alto',
    critical: 'Crítico',
  },
  liquidity: {
    positive: 'Saudável',
    negative: 'Atenção',
    critical: 'Crítico',
  },
} as const;

const PROGRESS_BAR_COLORS = {
  low: 'bg-green-500',
  moderate: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
} as const;

const SUGGESTION_CONFIG = {
  success: {
    icon: '✅',
    color: 'text-green-600 dark:text-green-400',
    border: 'border-green-500',
  },
  warning: {
    icon: '⚠️',
    color: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-500',
  },
  error: {
    icon: '🚨',
    color: 'text-red-600 dark:text-red-400',
    border: 'border-red-500',
  },
  info: {
    icon: '💡',
    color: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500',
  },
} as const;

// ==================== Helper Functions ====================

function getCreditUtilizationColor(status: string): string {
  return (
    STATUS_COLORS.credit[status as keyof typeof STATUS_COLORS.credit] ??
    'text-gray-600 dark:text-gray-400'
  );
}

function getCreditUtilizationBgColor(status: string): string {
  return (
    STATUS_BG_COLORS.credit[status as keyof typeof STATUS_BG_COLORS.credit] ??
    'bg-gray-100 dark:bg-gray-900/20'
  );
}

function getLiquidityColor(status: string): string {
  return (
    STATUS_COLORS.liquidity[status as keyof typeof STATUS_COLORS.liquidity] ??
    'text-gray-600 dark:text-gray-400'
  );
}

function getLiquidityBgColor(status: string): string {
  return (
    STATUS_BG_COLORS.liquidity[status as keyof typeof STATUS_BG_COLORS.liquidity] ??
    'bg-gray-100 dark:bg-gray-900/20'
  );
}

function getCreditUtilizationLabel(status: string): string {
  return STATUS_LABELS.credit[status as keyof typeof STATUS_LABELS.credit] ?? 'Desconhecido';
}

function getLiquidityLabel(status: string): string {
  return STATUS_LABELS.liquidity[status as keyof typeof STATUS_LABELS.liquidity] ?? 'Desconhecido';
}

function getProgressBarColor(status: string): string {
  return PROGRESS_BAR_COLORS[status as keyof typeof PROGRESS_BAR_COLORS] ?? 'bg-gray-500';
}

function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
}

function getSuggestionConfig(type: Suggestion['type']) {
  return SUGGESTION_CONFIG[type];
}

/**
 * Generates contextual suggestions based on indebtedness metrics
 */
function generateSuggestions(data: IndebtednessMetrics): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Credit Utilization Suggestions
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

// ==================== Sub-components ====================

function MetricHeader({
  icon,
  label,
  tooltipContent,
  status,
  statusColor,
}: Readonly<MetricHeaderProps>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-sm font-medium text-text dark:text-text-dark">{label}</span>
        <Tooltip content={tooltipContent}>
          <HelpCircle className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 cursor-help" />
        </Tooltip>
      </div>
      {status && statusColor && (
        <span className={`text-xs font-semibold ${statusColor}`}>{status}</span>
      )}
    </div>
  );
}

function MetricValueRow({ label, value }: Readonly<MetricValueRowProps>) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-semibold text-text dark:text-text-dark">{value}</span>
    </div>
  );
}

interface CreditUtilizationSectionProps {
  readonly data: IndebtednessMetrics['creditUtilization'];
}

function CreditUtilizationSection({ data }: Readonly<CreditUtilizationSectionProps>) {
  const statusColor = getCreditUtilizationColor(data.status);
  const bgColor = getCreditUtilizationBgColor(data.status);
  const statusLabel = getCreditUtilizationLabel(data.status);

  return (
    <div className="space-y-1.5">
      <MetricHeader
        icon={
          <div className={`p-1.5 rounded-lg ${bgColor}`}>
            <CreditCard className={`h-4 w-4 ${statusColor}`} />
          </div>
        }
        label="Uso de Crédito"
        tooltipContent="Percentual do seu limite de cartão que está sendo utilizado. Idealmente, mantenha abaixo de 30% para melhorar sua pontuação de crédito."
        status={statusLabel}
        statusColor={statusColor}
      />
      <div className="space-y-0.5">
        <MetricValueRow label="Utilizado" value={formatCurrency(data.used)} />
        <MetricValueRow label="Disponível" value={formatCurrency(data.available)} />
        <MetricValueRow label="Limite Total" value={formatCurrency(data.total)} />
        <div className="mt-1.5">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">Percentual</span>
            <span className={`text-sm font-bold ${statusColor}`}>
              {formatPercentage(data.percentage)}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all ${getProgressBarColor(data.status)}`}
              style={{ width: `${Math.min(data.percentage, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface LiquiditySectionProps {
  readonly data: IndebtednessMetrics['liquidity'];
}

function LiquiditySection({ data }: Readonly<LiquiditySectionProps>) {
  const statusColor = getLiquidityColor(data.status);
  const bgColor = getLiquidityBgColor(data.status);
  const statusLabel = getLiquidityLabel(data.status);

  return (
    <div className="space-y-1.5">
      <MetricHeader
        icon={
          <div className={`p-1.5 rounded-lg ${bgColor}`}>
            {data.status === 'positive' ? (
              <TrendingUp className={`h-4 w-4 ${statusColor}`} />
            ) : (
              <TrendingDown className={`h-4 w-4 ${statusColor}`} />
            )}
          </div>
        }
        label="Liquidez"
        tooltipContent="Indica quanto dinheiro você tem disponível após descontar todas as obrigações (contas a pagar e faturas). Um valor positivo significa que você consegue pagar suas contas."
        status={statusLabel}
        statusColor={statusColor}
      />
      <div className="space-y-0.5">
        <MetricValueRow label="Disponível" value={formatCurrency(data.available)} />
        <MetricValueRow label="Obrigações" value={formatCurrency(data.obligations)} />
        <MetricValueRow label="Índice" value={`${data.ratio.toFixed(2)}x`} />
      </div>
    </div>
  );
}

interface DebtSummarySectionProps {
  readonly totalDebt: number;
  readonly debtToRevenue: IndebtednessMetrics['debtToRevenue'];
}

function DebtSummarySection({ totalDebt, debtToRevenue }: Readonly<DebtSummarySectionProps>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="relative">
        {/* Vertical separator for desktop */}
        <div className="hidden md:block absolute right-0 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-700" />
        <MetricHeader
          icon={
            <div className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/20">
              <DollarSign className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          }
          label="Endividamento Total"
          tooltipContent="Soma de todas as suas dívidas: saldos negativos de contas, faturas de cartão em aberto e contas a pagar pendentes."
        />
        <p className="text-xl font-bold text-red-600 dark:text-red-400 mt-1">
          {formatCurrency(totalDebt)}
        </p>
      </div>

      <div>
        <MetricHeader
          icon={
            <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
          }
          label="Endividamento/Receitas"
          tooltipContent="Indica quantos meses de receita você precisaria para quitar todas as dívidas. Valores acima de 100% indicam que as dívidas superam a receita mensal."
        />
        <div className="mt-1">
          <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
            {formatPercentage(debtToRevenue.percentage)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Receitas: {formatCurrency(debtToRevenue.monthlyRevenue)}
          </p>
        </div>
      </div>
    </div>
  );
}

interface AccountBalancesSectionProps {
  readonly balances: IndebtednessMetrics['accountBalances'];
}

function AccountBalancesSection({ balances }: Readonly<AccountBalancesSectionProps>) {
  const netColor =
    balances.net >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';

  return (
    <div>
      <MetricHeader
        icon={
          <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        }
        label="Saldos de Contas"
        tooltipContent="Resumo dos saldos de todas as suas contas. Positivos são recursos disponíveis, negativos são dívidas ou saldos devedores."
      />
      <div className="grid grid-cols-3 gap-3 mt-2">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Positivos</p>
          <p className="text-base font-semibold text-green-600 dark:text-green-400">
            {formatCurrency(balances.positive)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Negativos</p>
          <p className="text-base font-semibold text-red-600 dark:text-red-400">
            {formatCurrency(balances.negative)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Líquido</p>
          <p className={`text-base font-semibold ${netColor}`}>{formatCurrency(balances.net)}</p>
        </div>
      </div>
    </div>
  );
}

interface SuggestionsSectionProps {
  readonly suggestions: Suggestion[];
}

function SuggestionsSection({ suggestions }: Readonly<SuggestionsSectionProps>) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="mt-2">
      <div className="flex items-center gap-1.5 mb-2">
        <Lightbulb className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
        <span className="text-sm font-semibold text-text dark:text-text-dark">Recomendações</span>
      </div>
      <div className="space-y-2">
        {suggestions.map((suggestion) => {
          const config = getSuggestionConfig(suggestion.type);
          return (
            <div
              key={`${suggestion.type}-${suggestion.message.substring(0, 20)}`}
              className={`flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border-l-4 ${config.border}`}
            >
              <span className="text-base flex-shrink-0">{config.icon}</span>
              <p className={`text-xs flex-1 ${config.color}`}>{suggestion.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== Main Component ====================

export function IndebtednessCard({ companyId }: Readonly<IndebtednessCardProps>) {
  const { data, isLoading, error } = useIndebtedness(companyId);

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
    <Card className="bg-white dark:bg-card-dark border-none shadow-md overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                 <AlertTriangle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              Análise de Saúde Financeira
            </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-background-dark rounded-xl p-3 border border-gray-100 dark:border-border-dark">
             <CreditUtilizationSection data={data.creditUtilization} />
          </div>
          <div className="bg-gray-50 dark:bg-background-dark rounded-xl p-3 border border-gray-100 dark:border-border-dark">
             <LiquiditySection data={data.liquidity} />
          </div>
        </div>

        <div className="bg-white dark:bg-background-dark rounded-xl border border-gray-100 dark:border-border-dark p-1">
             <DebtSummarySection totalDebt={data.totalDebt} debtToRevenue={data.debtToRevenue} />
        </div>

        <div className="bg-gray-50 dark:bg-background-dark rounded-xl p-3 border border-gray-100 dark:border-border-dark">
             <AccountBalancesSection balances={data.accountBalances} />
        </div>

        {suggestions.length > 0 && (
             <SuggestionsSection suggestions={suggestions} />
        )}
      </div>
    </Card>
  );
}
