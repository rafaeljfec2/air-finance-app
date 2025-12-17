import { BadgeStatus, CardContainer, CardHeader, CardTotal } from '@/components/budget';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { Receivable } from '@/types/budget';
import { Maximize2, TrendingUp } from 'lucide-react';

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
    <CardContainer color="amber" className="min-h-[420px]">
      <CardHeader icon={<TrendingUp size={24} />} title="Contas a Receber">
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
      <div className="mt-3 flex flex-col justify-between min-h-[320px]">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner size="md" className="text-amber-500" />
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
                  const r = paginatedReceivables[idx];
                  const key = r ? r.id : `receivable-placeholder-${idx}`;
                  return r ? (
                    <tr key={key}>
                      <td className="px-2 py-1.5 text-left text-text dark:text-text-dark truncate">
                        {r.description}
                      </td>
                      <td className="px-2 py-1.5 text-right font-medium whitespace-nowrap">
                        R$ {r.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-2 py-1.5 text-center">
                        <BadgeStatus status={r.status === 'RECEIVED' ? 'success' : 'warning'}>
                          {r.status === 'RECEIVED' ? 'Recebido' : 'Pendente'}
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
