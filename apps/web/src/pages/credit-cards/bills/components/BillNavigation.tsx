import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BillNavigationProps {
  month: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export function BillNavigation({
  month,
  onPreviousMonth,
  onNextMonth,
  canGoPrevious,
  canGoNext,
}: Readonly<BillNavigationProps>) {
  const formatMonth = (monthStr: string) => {
    const [year, monthNum] = monthStr.split('-').map(Number);
    const date = new Date(year, monthNum - 1, 1);
    return format(date, "MMMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <div className="bg-card dark:bg-card-dark border-b border-border dark:border-border-dark px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onPreviousMonth}
          disabled={!canGoPrevious}
          className="text-text dark:text-text-dark hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed p-1 transition-opacity"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h2 className="text-sm font-semibold text-text dark:text-text-dark text-center capitalize">
          Fatura de {formatMonth(month)}
        </h2>

        <button
          onClick={onNextMonth}
          disabled={!canGoNext}
          className="text-text dark:text-text-dark hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed p-1 transition-opacity"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
