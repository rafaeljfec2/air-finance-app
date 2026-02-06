import { TrendingUp, TrendingDown, CreditCard } from 'lucide-react';

interface BillSummaryProps {
  readonly dueDate: string;
  readonly status: 'OPEN' | 'CLOSED' | 'PAID';
  readonly total: number;
  readonly totalNational?: number;
  readonly totalInternational?: number;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export function BillSummary({
  total,
  totalNational = 0,
  totalInternational = 0,
  status,
}: Readonly<BillSummaryProps>) {
  const nationalAmount = totalNational > 0 ? totalNational : total;
  const internationalAmount = totalInternational;
  const isEstimated = status === 'OPEN';

  return (
    <div className="px-4 pt-3 lg:px-6 lg:pt-4">
      {isEstimated && (
        <p className="text-[10px] text-text-muted dark:text-text-muted-dark mb-2">
          Valor estimado — a fatura ainda não foi fechada pelo banco e pode variar no período.
        </p>
      )}
      <div className="grid grid-cols-3 gap-2 py-3 lg:gap-3 lg:py-4">
        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-3 lg:p-4">
          <div className="flex items-center gap-1.5 lg:gap-2 mb-1.5 lg:mb-2">
            <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
              <TrendingUp className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-primary-500" />
            </div>
            <span className="text-[10px] lg:text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
              Nacional
            </span>
          </div>
          <p className="text-sm lg:text-lg font-bold text-primary-500 truncate">
            {formatCurrency(nationalAmount)}
          </p>
        </div>

        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-3 lg:p-4">
          <div className="flex items-center gap-1.5 lg:gap-2 mb-1.5 lg:mb-2">
            <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
              <TrendingDown className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-blue-500" />
            </div>
            <span className="text-[10px] lg:text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
              Internac.
            </span>
          </div>
          <p className="text-sm lg:text-lg font-bold text-blue-500 truncate">
            {formatCurrency(internationalAmount)}
          </p>
        </div>

        <div className="bg-card dark:bg-card-dark rounded-xl border border-border dark:border-border-dark p-3 lg:p-4">
          <div className="flex items-center gap-1.5 lg:gap-2 mb-1.5 lg:mb-2">
            <div className="w-5 h-5 lg:w-6 lg:h-6 rounded-full bg-red-500/20 flex items-center justify-center">
              <CreditCard className="h-3 w-3 lg:h-3.5 lg:w-3.5 text-red-500" />
            </div>
            <span className="text-[10px] lg:text-xs font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
              Total
            </span>
          </div>
          <p className="text-sm lg:text-lg font-bold text-red-500 truncate">
            {formatCurrency(total)}
          </p>
        </div>
      </div>
    </div>
  );
}
