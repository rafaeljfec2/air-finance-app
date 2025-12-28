import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useIndebtedness } from '@/hooks/useIndebtedness';
import { formatCurrency } from '@/utils/formatters';
import { AlertTriangle, CreditCard, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

interface IndebtednessCardProps {
  companyId: string;
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
      return 'Positivo';
    case 'negative':
      return 'Negativo';
    case 'critical':
      return 'Crítico';
    default:
      return 'Desconhecido';
  }
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
              </div>
              <span className={`text-xs font-semibold ${creditUtilizationColor}`}>
                {getCreditUtilizationLabel(data.creditUtilization.status)}
              </span>
            </div>
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
                    {data.creditUtilization.percentage.toFixed(1)}%
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
              </div>
              <span className={`text-xs font-semibold ${liquidityColor}`}>
                {getLiquidityLabel(data.liquidity.status)}
              </span>
            </div>
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
            </div>
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
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {data.debtToRevenue.percentage.toFixed(1)}%
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
          </div>
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
      </div>
    </Card>
  );
}
