import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { StatementSummary } from '../hooks/types';
import { formatCurrency } from '../utils';

interface AccountStatementHeaderProps {
  readonly month: string;
  readonly onPreviousMonth: () => void;
  readonly onNextMonth: () => void;
  readonly canGoPrevious: boolean;
  readonly canGoNext: boolean;
  readonly summary?: StatementSummary;
}

const formatMonth = (monthStr: string) => {
  const [year, monthNum] = monthStr.split('-').map(Number);
  const date = new Date(year, monthNum - 1, 1);
  return format(date, "MMMM 'De' yyyy", { locale: ptBR });
};

export function AccountStatementHeader({
  month,
  onPreviousMonth,
  onNextMonth,
  canGoPrevious,
  canGoNext,
  summary,
}: AccountStatementHeaderProps) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onPreviousMonth}
          disabled={!canGoPrevious}
          className="text-text dark:text-text-dark hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-xl transition-all bg-card dark:bg-card-dark border border-border dark:border-border-dark hover:bg-background dark:hover:bg-background-dark active:scale-95 disabled:active:scale-100"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex-1 flex items-center justify-center gap-2 px-4">
          <Calendar className="h-4 w-4 text-text-muted dark:text-text-muted-dark shrink-0" />
          <h2 className="text-base font-bold text-text dark:text-text-dark text-center capitalize tracking-wide">
            {formatMonth(month)}
          </h2>
        </div>

        <button
          type="button"
          onClick={onNextMonth}
          disabled={!canGoNext}
          className="text-text dark:text-text-dark hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-xl transition-all bg-card dark:bg-card-dark border border-border dark:border-border-dark hover:bg-background dark:hover:bg-background-dark active:scale-95 disabled:active:scale-100"
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {summary && (
        <div className="flex items-center justify-end mt-2 pt-2 border-t border-border dark:border-border-dark">
          <div className="text-right">
            <p className="text-[10px] font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
              Saldo final
            </p>
            <p
              className={`text-lg font-bold ${summary.endBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}
            >
              {formatCurrency(summary.endBalance)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
