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
            <table className="w-full text-[11px]">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left text-gray-400 w-[45%]">Descrição</th>
                  <th className="px-2 py-1.5 text-right text-gray-400 w-[30%]">Valor</th>
                  <th className="px-2 py-1.5 text-center text-gray-400 w-[25%]">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 dark:divide-border-dark/50">
                {Array.from({ length: itemsPerPage }).map((_, idx) => {
                  const p = paginatedPayables[idx];
                  const key = p ? p.id : `payable-placeholder-${idx}`;
                  return p ? (
                    <tr key={key}>
                      <td className="px-2 py-1.5 text-left text-text dark:text-text-dark truncate">
                        {p.description}
                      </td>
                      <td className="px-2 py-1.5 text-right font-medium whitespace-nowrap">
                        R$ {p.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <BadgeStatus status={p.status === 'PAID' ? 'success' : 'danger'}>
                          {p.status === 'PAID' ? 'Pago' : 'Pendente'}
                        </BadgeStatus>
                      </td>
                    </tr>
                  ) : (
                    <tr key={key}>
                      <td className="px-2 py-1.5" colSpan={3}>
                        &nbsp;
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-2">
                <button
                  type="button"
                  className="px-2 py-1 rounded border text-xs font-medium bg-background dark:bg-background-dark border-border dark:border-border-dark disabled:opacity-50"
                  onClick={handlePrev}
                  disabled={safePage === 1}
                >
                  Anterior
                </button>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Página {safePage} de {totalPages}
                </span>
                <button
                  type="button"
                  className="px-2 py-1 rounded border text-xs font-medium bg-background dark:bg-background-dark border-border dark:border-border-dark disabled:opacity-50"
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
