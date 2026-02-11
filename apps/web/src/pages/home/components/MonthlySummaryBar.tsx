import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthlySummaryBarProps {
  readonly income: number;
  readonly expenses: number;
  readonly incomePercentage: number;
  readonly expensesPercentage: number;
  readonly expensesCoverageRatio: number;
  readonly total: number;
  readonly isLoading: boolean;
  readonly isPrivacyModeEnabled: boolean;
}

function buildInsightText(income: number, expenses: number, expensesCoverageRatio: number): string {
  if (income === 0 && expenses === 0) {
    return '';
  }

  if (income > expenses) {
    const surplusRatio = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
    return `Receitas superaram despesas em ${surplusRatio}%`;
  }

  if (expenses > income) {
    return `Despesas consomem ${expensesCoverageRatio}% das receitas`;
  }

  return 'Receitas e despesas equilibradas no período';
}

export function MonthlySummaryBar({
  income,
  expenses,
  incomePercentage,
  expensesPercentage,
  expensesCoverageRatio,
  total,
  isLoading,
  isPrivacyModeEnabled,
}: Readonly<MonthlySummaryBarProps>) {
  const currentMonthYear = format(new Date(), 'MMM/yyyy', { locale: ptBR });

  const insightText = buildInsightText(income, expenses, expensesCoverageRatio);

  const renderProgressBar = () => {
    if (isLoading) {
      return <div className="h-full bg-gray-300 dark:bg-gray-600 animate-pulse w-full"></div>;
    }

    if (total === 0) {
      return <div className="h-full bg-gray-300 dark:bg-gray-600 w-full"></div>;
    }

    return (
      <>
        {income > 0 && (
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${incomePercentage}%` }}
            aria-label={`Receitas: ${incomePercentage.toFixed(1)}%`}
          ></div>
        )}
        {expenses > 0 && (
          <div
            className="h-full bg-red-500"
            style={{ width: `${expensesPercentage}%` }}
            aria-label={`Despesas: ${expensesPercentage.toFixed(1)}%`}
          ></div>
        )}
      </>
    );
  };

  const formatValue = (value: number, prefix: string) => {
    if (isPrivacyModeEnabled) {
      return 'R$ •••';
    }
    if (isLoading) {
      return 'Carregando...';
    }
    return `${prefix}${formatCurrency(value)}`;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
      {!isPrivacyModeEnabled && !isLoading && insightText && (
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1.5">{insightText}</p>
      )}
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-600 dark:text-gray-300">Receitas vs Despesas</span>
        <span className="font-medium text-gray-900 dark:text-white">{currentMonthYear}</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
        {renderProgressBar()}
      </div>
      <div className="flex justify-between text-[10px] mt-1.5 text-gray-500">
        <span>Entradas: {formatValue(income, '+')}</span>
        <span>Saídas: {formatValue(expenses, '-')}</span>
      </div>
    </div>
  );
}
