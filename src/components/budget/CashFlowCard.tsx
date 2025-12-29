import { CardContainer, CardEmpty, CardHeader, CardStat, CardTotal } from '@/components/budget';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { CashFlow } from '@/types/budget';
import { Activity, Maximize2 } from 'lucide-react';

interface CashFlowCardProps {
  cashFlow: CashFlow | null;
  isLoading: boolean;
  onExpand: () => void;
}

export function CashFlowCard({ cashFlow, isLoading, onExpand }: Readonly<CashFlowCardProps>) {
  return (
    <CardContainer color="emerald" className="min-h-[420px]">
      <CardHeader
        icon={<Activity className="h-4 w-4 text-primary-600 dark:text-primary-400" />}
        title="Fluxo de Caixa"
        tooltip="Comparativo entre o saldo inicial, previsão de entradas/saídas e o saldo final projetado para o mês."
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs text-gray-500 hover:text-primary-600 dark:text-gray-300"
          onClick={onExpand}
        >
          <Maximize2 className="w-3 h-3 mr-1" />
          Expandir
        </Button>
      </CardHeader>
      <CardTotal
        value={cashFlow?.finalBalance ?? 0} 
        color={(cashFlow?.finalBalance ?? 0) >= 0 ? 'blue' : 'rose'} 
        label="Saldo Final" 
      />
      {isLoading && (
        <div className="mt-6 flex justify-center">
          <Spinner size="lg" className="text-emerald-500" />
        </div>
      )}
      {!isLoading && cashFlow && (
        <div className="flex flex-col gap-3 mt-3">
          <CardStat label="Entradas" value={cashFlow.totalIncome} positive />
          <CardStat label="Saídas" value={cashFlow.totalExpense} negative />
          <div className="border-t border-border dark:border-border-dark my-2" />
          <CardStat
            label="Saldo Final"
            value={cashFlow.finalBalance}
            blue={cashFlow.finalBalance >= 0}
            negative={cashFlow.finalBalance < 0}
          />
        </div>
      )}
      {!isLoading && !cashFlow && <CardEmpty />}
    </CardContainer>
  );
}
