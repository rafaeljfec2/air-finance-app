import { CardContainer, CardHeader, CardTotal } from '@/components/budget';
import { CreditCardBrandIcon } from '@/components/budget/CreditCardBrandIcon';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { CreditCardBill, CreditCard as CreditCardType } from '@/types/budget';
import { AnimatePresence, motion } from 'framer-motion';
import { CreditCard, Maximize2 } from 'lucide-react';
import { useMemo, useState } from 'react';

interface CreditCardsCardProps {
  cards: CreditCardType[];
  isLoading: boolean;
  activeCardId: string;
  activeCardBalance?: number;
  activeBill: CreditCardBill | undefined;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onChangeActiveCard: (cardId: string) => void;
  onExpand: () => void;
}

export function CreditCardsCard({
  cards,
  isLoading,
  activeCardId,
  activeCardBalance,
  activeBill,
  currentPage,
  itemsPerPage,
  onPageChange,
  onChangeActiveCard,
  onExpand,
}: Readonly<CreditCardsCardProps>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Sort transactions: first those that are finishing (fewer remaining installments), then the rest
  const sortedTransactions = useMemo(() => {
    const transactions = activeBill?.transactions ?? [];
    return [...transactions].sort((a, b) => {
      // Extract installment info from description (e.g., "Parcela 3/5" or "3/5")
      const extractInstallment = (desc: string): { current: number; total: number } | null => {
        const regex1 = /parcela\s+(\d+)\/(\d+)/i;
        const regex2 = /(?:^|\s|-)(\d+)\/(\d+)(?:\s|$)/;
        let match = regex1.exec(desc);
        if (!match) {
          match = regex2.exec(desc);
        }
        if (!match) return null;
        const current = Number.parseInt(match[1] ?? '0', 10);
        const total = Number.parseInt(match[2] ?? '0', 10);
        if (current <= 0 || total <= 0 || current > total) return null;
        return { current, total };
      };

      const installmentA = extractInstallment(a.description);
      const installmentB = extractInstallment(b.description);

      // If neither has installment info, keep original order
      if (!installmentA && !installmentB) return 0;

      // Transactions with installments come first
      if (!installmentA) return 1;
      if (!installmentB) return -1;

      // Calculate remaining installments
      const remainingA = installmentA.total - installmentA.current;
      const remainingB = installmentB.total - installmentB.current;

      // First: those with fewer remaining installments (finishing first)
      if (remainingA !== remainingB) {
        return remainingA - remainingB;
      }

      // If same remaining, sort by current installment (higher current first)
      return installmentB.current - installmentA.current;
    });
  }, [activeBill?.transactions]);

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage) || 1;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handlePrev = () => {
    onPageChange(Math.max(1, safePage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages, safePage + 1));
  };

  const totalBillValue = activeBill?.total ?? 0;

  return (
    <CardContainer color="violet" className={isCollapsed ? "min-h-0" : "min-h-[250px]"}>
      <CardHeader
        icon={<CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
        title="Cartões de Crédito"
        tooltip="Gerenciamento de faturas, limites e lançamentos dos seus cartões de crédito."
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
      <CardTotal value={totalBillValue} color="violet" label="Total da Fatura" />
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
          <div className="mt-6 flex justify-center">
            <Spinner size="md" className="text-violet-500" />
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-2 mt-1 overflow-x-auto pb-1 justify-center">
              {cards.map((card) => {
                const isActive = activeCardId === card.id;
                let activeClass = '';
                if (isActive) {
                 if (card.brand === 'nubank') {
                    activeClass = 'bg-[#8A05BE] text-white border-[#8A05BE] shadow-md ring-1 ring-[#8A05BE]/20';
                  } else if (card.brand === 'itau') {
                    activeClass = 'bg-[#FF6900] text-white border-[#FF6900] shadow-md ring-1 ring-[#FF6900]/20';
                  } else {
                    activeClass = 'bg-primary-600 text-white dark:bg-primary-500 shadow-md ring-1 ring-primary-500/20';
                  }
                } else {
                  activeClass =
                    'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700';
                }
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => onChangeActiveCard(card.id)}
                    className={`px-3 py-1.5 rounded-full font-medium transition-all text-xs flex items-center gap-1.5 ${activeClass}`}
                  >
                    <CreditCardBrandIcon brand={card.brand} />
                    {card.name}
                  </button>
                );
              })}
            </div>

            {/* Exibição do Saldo da Conta */}
            {typeof activeCardBalance === 'number' && (
                <div className="flex justify-center items-center gap-2 text-xs mb-2">
                    <span className="text-gray-500 dark:text-gray-400">Saldo da Conta:</span>
                    <span className={`font-semibold ${activeCardBalance < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        R$ {activeCardBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            )}
            
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border dark:border-border-dark">
                    <th className="px-3 py-2 text-left font-medium text-gray-500 dark:text-gray-400 w-[60%]">DESCRIÇÃO</th>
                    <th className="px-3 py-2 text-right font-medium text-gray-500 dark:text-gray-400 w-[40%]">VALOR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30 dark:divide-border-dark/30">
                  {Array.from({ length: itemsPerPage }).map((_, idx) => {
                    const t = paginatedTransactions[idx];
                    const key = t ? t.id : `transaction-placeholder-${idx}`;
                    return t ? (
                      <tr key={key} className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-3 py-1 text-text dark:text-text-dark font-medium truncate max-w-[160px]">
                          {t.description}
                        </td>
                        <td className="px-3 py-1 text-right font-semibold text-text dark:text-text-dark whitespace-nowrap">
                          R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ) : (
                      <tr key={key}>
                        <td className="px-3 py-1" colSpan={2}>
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
