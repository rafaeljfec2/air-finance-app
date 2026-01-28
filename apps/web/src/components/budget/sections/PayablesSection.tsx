import { BadgeStatus } from '@/components/budget';
import { EditableValueCell } from '@/components/budget/EditableValueCell';
import { Spinner } from '@/components/ui/spinner';
import type { Payable } from '@/types/budget';
import { formatDate } from '@/utils/date';
import { useMemo } from 'react';
import { useEditableValue } from '../hooks/useEditableValue';

interface PayablesSectionProps {
  readonly payables: Payable[];
  readonly isLoading: boolean;
}

const CREDIT_CARD_KEYWORDS = ['nubank', 'itau', 'visa', 'mastercard', 'elo', 'amex', 'hipercard'];

function isCreditCardPayable(description: string): boolean {
  const lowerDesc = description.toLowerCase();
  return CREDIT_CARD_KEYWORDS.some((keyword) => lowerDesc.includes(keyword));
}

export function PayablesSection({ payables, isLoading }: Readonly<PayablesSectionProps>) {
  const {
    editingId,
    editingValue,
    inputRef,
    isUpdating,
    startEditing,
    saveValue,
    handleKeyDown,
    handleValueChange,
  } = useEditableValue();

  const { creditCardPayables, recurringPayables, total } = useMemo(() => {
    const creditCards: Payable[] = [];
    const recurring: Payable[] = [];

    payables.forEach((p) => {
      if (isCreditCardPayable(p.description)) {
        creditCards.push(p);
      } else {
        recurring.push(p);
      }
    });

    const sortByDate = (a: Payable, b: Payable) =>
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

    creditCards.sort(sortByDate);
    recurring.sort(sortByDate);

    return {
      creditCardPayables: creditCards,
      recurringPayables: recurring,
      total: payables.reduce((sum, p) => sum + p.value, 0),
    };
  }, [payables]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" className="text-rose-500" />
      </div>
    );
  }

  if (payables.length === 0) {
    return (
      <p className="px-3 py-4 text-center text-gray-500 dark:text-gray-400">
        Nenhuma conta a pagar neste período.
      </p>
    );
  }

  const renderTable = (items: Payable[]) => (
    <table className="w-full text-xs">
      <thead>
        <tr>
          <th className="px-2 py-1.5 text-left text-gray-400 w-[15%]">Vencimento</th>
          <th className="px-2 py-1.5 text-left text-gray-400 w-[35%]">Descrição</th>
          <th className="px-2 py-1.5 text-center text-gray-400 w-[25%]">Status</th>
          <th className="px-2 py-1.5 text-right text-gray-400 w-[25%]">Valor</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
        {items.map((p) => (
          <tr key={p.id}>
            <td className="px-2 py-1.5 text-left text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {formatDate(p.dueDate)}
            </td>
            <td className="px-2 py-1.5 text-left text-text dark:text-text-dark truncate max-w-[200px]">
              {p.description}
            </td>
            <td className="px-2 py-1.5 text-center">
              <BadgeStatus status={p.status === 'PAID' ? 'success' : 'danger'}>
                {p.status === 'PAID' ? 'Pago' : 'Pendente'}
              </BadgeStatus>
            </td>
            <td className="px-2 py-1.5 text-right font-medium whitespace-nowrap text-white dark:text-white">
              <EditableValueCell
                value={p.value}
                isEditing={editingId === p.id}
                editingValue={editingValue}
                inputRef={inputRef}
                isUpdating={isUpdating}
                onDoubleClick={() => startEditing(p.id, p.value)}
                onValueChange={handleValueChange}
                onBlur={() => {
                  setTimeout(() => {
                    if (editingId === p.id) {
                      saveValue(p.id);
                    }
                  }, 200);
                }}
                onKeyDown={(e) => {
                  e.stopPropagation();
                  handleKeyDown(e, p.id);
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="space-y-6">
      {recurringPayables.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-rose-500" />
            <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-400">
              Contas Recorrentes ({recurringPayables.length})
            </h4>
            <span className="text-xs text-gray-500 ml-auto">
              Total: R${' '}
              {recurringPayables
                .reduce((acc, p) => acc + p.value, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 overflow-hidden">
            {renderTable(recurringPayables)}
          </div>
        </div>
      )}

      {creditCardPayables.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="h-2 w-2 rounded-full bg-violet-500" />
            <h4 className="text-sm font-semibold text-violet-600 dark:text-violet-400">
              Faturas de Cartão ({creditCardPayables.length})
            </h4>
            <span className="text-xs text-gray-500 ml-auto">
              Total: R${' '}
              {creditCardPayables
                .reduce((acc, p) => acc + p.value, 0)
                .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 overflow-hidden">
            {renderTable(creditCardPayables)}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t-2 border-border dark:border-border-dark">
        <span className="font-semibold text-text dark:text-text-dark">Total Geral</span>
        <span className="font-bold text-lg text-rose-600 dark:text-rose-400">
          R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
