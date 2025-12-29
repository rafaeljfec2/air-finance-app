import { BadgeStatus, CardContainer, CardHeader, CardTotal } from '@/components/budget';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { Payable } from '@/types/budget';
import { Maximize2, TrendingDown } from 'lucide-react';

interface PayablesCardProps {
  payables: Payable[];
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onExpand: () => void;
}

export function PayablesCard({
  payables,
  isLoading,
  currentPage,
  itemsPerPage,
  onPageChange,
  onExpand,
}: Readonly<PayablesCardProps>) {
  const totalPages = Math.ceil(payables.length / itemsPerPage) || 1;
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedPayables = payables.slice(startIndex, startIndex + itemsPerPage);

  const totalValue = payables.reduce((acc, p) => acc + p.value, 0);

  const handlePrev = () => {
    onPageChange(Math.max(1, safePage - 1));
  };

  const handleNext = () => {
    onPageChange(Math.min(totalPages, safePage + 1));
  };

  return (
    <CardContainer color="rose" className="min-h-[420px]">
      <CardHeader icon={<TrendingDown size={24} />} title="Contas a Pagar">
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
      <CardTotal value={totalValue} color="rose" label="Total Pagar" />
      <div className="mt-3 flex flex-col justify-between min-h-[320px]">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner size="md" className="text-rose-500" />
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
                    const p = paginatedPayables[idx];
                    const key = p ? p.id : `payable-placeholder-${idx}`;
                    return p ? (
                      <tr key={key} className="group hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-3 py-2.5 text-text dark:text-text-dark font-medium truncate max-w-[140px]">
                          {p.description}
                        </td>
                        <td className="px-3 py-2.5 text-center">
                          <BadgeStatus status={p.status === 'PAID' ? 'success' : 'danger'}>
                            {p.status === 'PAID' ? 'Pago' : 'Pendente'}
                          </BadgeStatus>
                        </td>
                        <td className="px-3 py-2.5 text-right font-semibold text-text dark:text-text-dark whitespace-nowrap">
                          R$ {p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ) : (
                      <tr key={key}>
                        <td className="px-3 py-2.5" colSpan={3}>
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
    </CardContainer>
  );
}
