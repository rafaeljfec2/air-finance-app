import { Wallet, CreditCard, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../utils';

interface CreditCardSummaryProps {
  readonly limitAvailable: number;
  readonly limitTotal: number;
  readonly billTotal: number;
  readonly billStatus?: 'OPEN' | 'CLOSED' | 'PAID';
}

export function CreditCardSummary({
  limitAvailable,
  limitTotal,
  billTotal,
  billStatus,
}: Readonly<CreditCardSummaryProps>) {
  const isEstimated = billStatus === 'OPEN';
  return (
    <div className="grid grid-cols-3 gap-2 px-4 pt-6 pb-2 lg:gap-2 lg:px-6 lg:pt-8 lg:pb-3">
      <div className="bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark p-2.5 lg:p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-green-500/20 flex items-center justify-center">
            <Wallet className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-green-500" />
          </div>
          <span className="text-[9px] lg:text-[10px] font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Disponível
          </span>
        </div>
        <p className="text-sm lg:text-base font-bold text-green-500 truncate">
          {formatCurrency(limitAvailable)}
        </p>
      </div>

      <div className="bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark p-2.5 lg:p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
            <TrendingUp className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-blue-500" />
          </div>
          <span className="text-[9px] lg:text-[10px] font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Limite Total
          </span>
        </div>
        <p className="text-sm lg:text-base font-bold text-blue-500 truncate">
          {formatCurrency(limitTotal)}
        </p>
      </div>

      <div className="bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark p-2.5 lg:p-3">
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-4 h-4 lg:w-5 lg:h-5 rounded-full bg-red-500/20 flex items-center justify-center">
            <CreditCard className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-red-500" />
          </div>
          <span className="text-[9px] lg:text-[10px] font-medium text-text-muted dark:text-text-muted-dark uppercase tracking-wide">
            Fatura
          </span>
        </div>
        <p className="text-sm lg:text-base font-bold text-red-500 truncate">
          {formatCurrency(billTotal)}
        </p>
        {isEstimated && (
          <p className="text-[9px] text-text-muted dark:text-text-muted-dark mt-0.5">
            Valor estimado
          </p>
        )}
      </div>
    </div>
  );
}
