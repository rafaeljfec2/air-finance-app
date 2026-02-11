import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MonthlySummaryBarProps {
  readonly income: number;
  readonly expenses: number;
  readonly incomePercentage: number;
  readonly expensesPercentage: number;
  readonly marginLabel: string;
  readonly total: number;
  readonly isLoading: boolean;
  readonly isPrivacyModeEnabled: boolean;
}

export function MonthlySummaryBar({
  income,
  expenses,
  incomePercentage,
  expensesPercentage,
  marginLabel,
  total,
  isLoading,
  isPrivacyModeEnabled,
}: Readonly<MonthlySummaryBarProps>) {
  const currentMonthYear = format(new Date(), 'MMM/yyyy', { locale: ptBR });

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
      return 'R$ \u2022\u2022\u2022';
    }
    if (isLoading) {
      return 'Carregando...';
    }
    return `${prefix}${formatCurrency(value)}`;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
      {!isPrivacyModeEnabled && !isLoading && marginLabel && (
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-1.5">{marginLabel}</p>
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
        <span>
          {'Sa\u00EDdas: '}
          {formatValue(expenses, '-')}
        </span>
      </div>
    </div>
  );
}
