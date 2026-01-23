import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BillNavigationProps {
  month: string;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  creditCardColor?: string;
}

export function BillNavigation({
  month,
  onPreviousMonth,
  onNextMonth,
  canGoPrevious,
  canGoNext,
  creditCardColor,
}: Readonly<BillNavigationProps>) {
  const formatMonth = (monthStr: string) => {
    const [year, monthNum] = monthStr.split('-').map(Number);
    const date = new Date(year, monthNum - 1, 1);
    return format(date, "MMMM 'de' yyyy", { locale: ptBR });
  };

  const cardColor = creditCardColor ?? '#8A05BE';

  return (
    <div
      className="relative overflow-hidden border-b border-black/10 dark:border-white/10"
      style={{
        background: `linear-gradient(135deg, ${cardColor} 0%, ${cardColor}dd 100%)`,
      }}
    >
      {/* Overlay para melhorar legibilidade */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />

      <div className="relative px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onPreviousMonth}
            disabled={!canGoPrevious}
            className="text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-xl transition-all backdrop-blur-sm bg-white/15 hover:bg-white/25 active:scale-95 disabled:active:scale-100"
            aria-label="Mês anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex-1 flex items-center justify-center gap-2 px-4">
            <Calendar className="h-4 w-4 text-white/90 shrink-0" />
            <h2 className="text-base font-bold text-white text-center capitalize tracking-wide">
              Fatura de {formatMonth(month)}
            </h2>
          </div>

          <button
            onClick={onNextMonth}
            disabled={!canGoNext}
            className="text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed p-2.5 rounded-xl transition-all backdrop-blur-sm bg-white/15 hover:bg-white/25 active:scale-95 disabled:active:scale-100"
            aria-label="Próximo mês"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
