import { BadgeStatus, CardContainer, CardHeader, CardTotal } from '@/components/budget';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { Receivable } from '@/types/budget';
import { AnimatePresence, motion } from 'framer-motion';
import { Maximize2, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface ReceivablesCardProps {
  receivables: Receivable[];
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onExpand: () => void;
}

export function ReceivablesCard({
  receivables,
  isLoading,
  currentPage,
  itemsPerPage,
  onPageChange,
  onExpand,
}: Readonly<ReceivablesCardProps>) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const totalPages = Math.ceil(receivables.length / itemsPerPage) || 1;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedReceivables = receivables.slice(startIndex, startIndex + itemsPerPage);

  const totalValue = receivables.reduce((acc, r) => acc + r.value, 0);

  const handlePrev = () => {
    onPageChange(Math.max(1, safePage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages, safePage + 1));
  };

  return (
    <CardContainer color="amber" className={isCollapsed ? "min-h-0" : "min-h-[250px]"}>
      <CardHeader
        icon={<TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
        title="Contas a Receber"
        tooltip="Lista de todas as receitas previstas e recebidas para este mês."
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
      <CardTotal value={totalValue} color="amber" label="Total Receber" />
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2 flex flex-col justify-between min-h-[180px]">
              {isLoading ? (
                <div className="flex flex-1 items-center justify-center">
                  <Spinner size="md" className="text-amber-500" />
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto -mx-2">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border dark:border-border-dark">
                          <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 w-[50%]">DESCRIÇÃO</th>
                          <th className="px-3 py-2 text-center font-medium text-gray-500 dark:text-gray-400 w-[20%]">STATUS</th>
                          <th className="px-3 py-2 text-right font-medium text-gray-500 dark:text-gray-400 w-[30%]">VALOR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/30 dark:divide-border-dark/30">
                        {Array.from({ length: itemsPerPage }).map((_, idx) => {
                          const r = paginatedReceivables[idx];
                          const key = r ? r.id : `receivable-placeholder-${idx}`;
                          return r ? (
                            <tr key={key} className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                              <td className="px-3 py-1 text-text dark:text-text-dark font-medium truncate max-w-[140px]">
                                {r.description}
                              </td>
                              <td className="px-3 py-1 text-center">
                                <BadgeStatus status={r.status === 'RECEIVED' ? 'success' : 'warning'}>
                                  {r.status === 'RECEIVED' ? 'Recebido' : 'Pendente'}
                                </BadgeStatus>
                              </td>
                              <td className="px-3 py-1 text-right font-semibold text-text dark:text-text-dark whitespace-nowrap">
                                R$ {r.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </td>
                            </tr>
                          ) : (
                            <tr key={key}>
                              <td className="px-3 py-1" colSpan={3}>
                                &nbsp;
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/50 dark:border-border-dark/50">
                      <button
                        type="button"
                        className="p-1 px-3 rounded-md text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
                        onClick={handlePrev}
                        disabled={safePage === 1}
                      >
                        Anterior
                      </button>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                        {safePage} / {totalPages}
                      </span>
                      <button
                        type="button"
                        className="p-1 px-3 rounded-md text-xs font-medium text-text dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 transition-colors"
                        onClick={handleNext}
                        disabled={safePage === totalPages}
                      >
                        Próxima
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CardContainer>
  );
}
