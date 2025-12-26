import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useDashboardSummary } from '@/hooks/useDashboard';
import type { DashboardFilters } from '@/types/dashboard';
import { formatCurrency } from '@/utils/formatters';
import {
    Clock,
    PieChart,
    TrendingDown,
    TrendingUp,
    Wallet,
} from 'lucide-react';

interface SummaryCardsRowProps {
  companyId: string;
  filters: DashboardFilters;
}

function formatChangeLabel(pct: number | null): { text: string; className: string } {
  if (pct === null) {
    return { text: 'Sem comparação com período anterior', className: 'text-gray-500' };
  }

  const rounded = Number.isFinite(pct) ? pct.toFixed(1) : '0.0';
  const sign = pct >= 0 ? '+' : '';
  const isPositive = pct >= 0;
  return {
    text: `${sign}${rounded}% vs mês anterior`,
    className: isPositive ? 'text-green-500' : 'text-red-500',
  };
}

export function SummaryCardsRow({ companyId, filters }: Readonly<SummaryCardsRowProps>) {
  const { data, isLoading, error } = useDashboardSummary(companyId, filters);

  if (!companyId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </Card>
        <Card className="bg-white dark:bg-gray-800 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            <div className="h-7 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-gray-800 p-6 col-span-3">
          <div className="flex items-center gap-3 text-sm text-red-500">
            <Spinner size="sm" className="text-red-500" />
            <span>Erro ao carregar resumo financeiro do dashboard.</span>
          </div>
        </Card>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const balanceChange = formatChangeLabel(data.balanceChangePct);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Saldo Total */}
      <Card className="bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Total</p>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
              {formatCurrency(data.balance)}
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
            <Wallet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <TrendingUp
            className={`h-4 w-4 mr-1 ${
              data.balanceChangePct !== null && data.balanceChangePct < 0
                ? 'text-red-500 rotate-180'
                : 'text-green-500'
            }`}
          />
          <span className={balanceChange.className}>{balanceChange.text}</span>
        </div>
      </Card>

      {/* Receitas */}
      <Card className="bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Receitas</p>
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
              {formatCurrency(data.income)}
            </p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <Clock className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-gray-500">Última atualização: agora</span>
        </div>
      </Card>

      {/* Despesas */}
      <Card className="bg-white dark:bg-gray-800 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Despesas</p>
            <p className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-1">
              {formatCurrency(data.expenses)}
            </p>
          </div>
          <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
            <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <PieChart className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-gray-500">Ver distribuição</span>
        </div>
      </Card>
    </div>
  );
}
