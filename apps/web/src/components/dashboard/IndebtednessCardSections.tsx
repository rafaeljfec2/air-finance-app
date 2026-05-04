import {
  AlertTriangle,
  CreditCard,
  DollarSign,
  HelpCircle,
  Lightbulb,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import React from 'react';

import { Tooltip } from '@/components/ui/tooltip';
import type { IndebtednessMetrics } from '@/types/indebtedness';
import { formatCurrency } from '@/utils/formatters';

import type { Suggestion } from './indebtednessCard.types';
import {
  formatPercentage,
  getCreditUtilizationBgColor,
  getCreditUtilizationColor,
  getCreditUtilizationLabel,
  getLiquidityBgColor,
  getLiquidityColor,
  getLiquidityLabel,
  getProgressBarColor,
  getSuggestionConfig,
} from './indebtednessCard.utils';

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

export function CreditUtilizationSection({ data }: Readonly<CreditUtilizationSectionProps>) {
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

export function LiquiditySection({ data }: Readonly<LiquiditySectionProps>) {
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

export function DebtSummarySection({
  totalDebt,
  debtToRevenue,
}: Readonly<DebtSummarySectionProps>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="relative">
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

export function AccountBalancesSection({ balances }: Readonly<AccountBalancesSectionProps>) {
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

export function SuggestionsSection({ suggestions }: Readonly<SuggestionsSectionProps>) {
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
