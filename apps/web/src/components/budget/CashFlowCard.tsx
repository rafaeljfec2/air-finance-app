import { CardContainer, CardEmpty, CardHeader, CardStat, CardTotal } from '@/components/budget';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { CashFlow } from '@/types/budget';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Maximize2 } from 'lucide-react';
import { useState } from 'react';

interface CashFlowCardProps {
  cashFlow: CashFlow | null;
  isLoading: boolean;
  onExpand: () => void;
}

export function CashFlowCard({ cashFlow, isLoading, onExpand }: Readonly<CashFlowCardProps>) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <CardContainer color="emerald" className={isCollapsed ? 'min-h-0' : ''}>
      <CardHeader
        icon={<Activity className="h-4 w-4 text-primary-600 dark:text-primary-400" />}
        title="Fluxo de Caixa"
        tooltip="Comparativo entre o saldo inicial, previsão de entradas/saídas e o saldo final projetado para o mês."
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
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
        value={cashFlow?.currentBalance ?? 0}
        color={(cashFlow?.currentBalance ?? 0) >= 0 ? 'blue' : 'rose'}
        label="Saldo Final"
      />
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {isLoading && (
              <div className="mt-4 flex justify-center">
                <Spinner size="lg" className="text-emerald-500" />
              </div>
            )}
            {!isLoading && cashFlow && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                <CardStat label="Entradas" value={cashFlow.totalIncome} positive />
                <CardStat label="Saídas" value={cashFlow.totalExpense} negative />
                <CardStat
                  label="Saldo Final"
                  value={cashFlow.currentBalance}
                  blue={cashFlow.currentBalance >= 0}
                  negative={cashFlow.currentBalance < 0}
                />
              </div>
            )}
            {!isLoading && !cashFlow && <CardEmpty />}
          </motion.div>
        )}
      </AnimatePresence>
    </CardContainer>
  );
}
