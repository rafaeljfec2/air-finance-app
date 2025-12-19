import { Loading } from '@/components/Loading';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import type { InstallmentTransaction } from '@/services/transactionService';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle } from 'lucide-react';

interface InstallmentsModalProps {
  open: boolean;
  onClose: () => void;
  installments: InstallmentTransaction[];
  accountId: string;
  periodEnd?: string | null;
  onConfirm: (installments: InstallmentTransaction[]) => Promise<void>;
  isCreating?: boolean;
}

export function InstallmentsModal({
  open,
  onClose,
  installments,
  accountId: _accountId, // Unused but kept for API compatibility
  periodEnd,
  onConfirm,
  isCreating = false,
}: Readonly<InstallmentsModalProps>) {
  const handleConfirm = async () => {
    await onConfirm(installments);
  };

  if (installments.length === 0) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Transações Parceladas Detectadas"
      className="max-w-3xl"
    >
      <div className="space-y-4 p-6">
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
              Foram detectadas {installments.length} transação(ões) parcelada(s) no extrato.
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-300 mb-2">
              As parcelas serão criadas a partir do mês de fechamento do extrato
              {periodEnd
                ? ` (${format(new Date(periodEnd), "MMMM 'de' yyyy", { locale: ptBR })})`
                : ''}
              . Deseja criar automaticamente as parcelas futuras para essas transações?
            </p>
            {periodEnd && (
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                💡 As parcelas começarão em{' '}
                {format(new Date(periodEnd), "01/MM/yyyy", { locale: ptBR })} (primeiro dia do mês
                de fechamento)
              </p>
            )}
          </div>
        </div>

        <div className="max-h-[50vh] overflow-y-auto border border-border dark:border-border-dark rounded-lg">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-background dark:bg-background-dark border-b border-border dark:border-border-dark z-10">
              <tr>
                <th className="px-4 py-3 text-left text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-4 py-3 text-right text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-wider w-32">
                  Valor
                </th>
                <th className="px-4 py-3 text-center text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-wider w-36">
                  Parcela
                </th>
                <th className="px-4 py-3 text-center text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-wider w-28">
                  Data Extrato
                </th>
                <th className="px-4 py-3 text-center text-gray-400 dark:text-gray-500 font-medium text-xs uppercase tracking-wider w-32">
                  Parcelas a Criar
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 dark:divide-border-dark/60 bg-background dark:bg-background-dark">
              {installments.map((tx) => {
                const installmentInfo = tx.installmentInfo;
                const remaining = installmentInfo.total - installmentInfo.current;
                const isExpense = tx.amount < 0;
                const formattedDate = tx.date
                  ? format(new Date(tx.date), 'dd/MM/yyyy', { locale: ptBR })
                  : 'N/A';

                return (
                  <tr
                    key={tx.fitId || `${tx.date}-${tx.description}-${tx.amount}`}
                    className="hover:bg-card dark:hover:bg-card-dark transition-colors"
                  >
                    <td className="px-4 py-3 text-left text-text dark:text-text-dark">
                      <div className="break-words">{tx.description}</div>
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold whitespace-nowrap ${
                        isExpense
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}
                    >
                      {isExpense ? '-' : '+'}R${' '}
                      {Math.abs(tx.amount).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                          {installmentInfo.current}/{installmentInfo.total}
                        </span>
                        {remaining > 0 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {remaining} restante{remaining > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-text dark:text-text-dark font-medium whitespace-nowrap">
                      {formattedDate}
                    </td>
                    <td className="px-4 py-3 text-center text-text dark:text-text-dark">
                      {remaining > 0 ? (
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-medium">
                            {installmentInfo.current}/{installmentInfo.total} até{' '}
                            {installmentInfo.total}/{installmentInfo.total}
                          </span>
                          {periodEnd && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              A partir de{' '}
                              {format(new Date(periodEnd), 'MM/yyyy', { locale: ptBR })}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Completa
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-border-dark">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isCreating}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isCreating}
            className="bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isCreating ? (
              <>
                <Loading size="small" />
                Criando parcelas...
              </>
            ) : (
              'Criar Parcelas Futuras'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
