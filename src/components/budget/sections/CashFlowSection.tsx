import { CardEmpty, CardStat } from '@/components/budget';
import { Spinner } from '@/components/ui/spinner';
import type { CashFlow } from '@/types/budget';

interface CashFlowSectionProps {
  cashFlow: CashFlow | null;
  isLoading: boolean;
}

export function CashFlowSection({ cashFlow, isLoading }: Readonly<CashFlowSectionProps>) {
  return (
    <div className="space-y-3">
      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner size="lg" className="text-emerald-500" />
        </div>
      )}
      {!isLoading && cashFlow && (
        <>
          <CardStat label="Entradas" value={cashFlow.totalIncome} positive />
          <CardStat label="Saídas" value={cashFlow.totalExpense} negative />
          <div className="border-t border-border dark:border-border-dark my-3" />
          <CardStat
            label="Saldo Final"
            value={cashFlow.finalBalance}
            highlight={cashFlow.finalBalance >= 0}
          />
        </>
      )}
      {!isLoading && !cashFlow && <CardEmpty />}
    </div>
  );
}
