import { BadgeStatus } from '@/components/budget';
import { EditableValueCell } from '@/components/budget/EditableValueCell';
import {
  EmptyState,
  GroupContainer,
  GroupHeader,
  SectionLoader,
  TotalFooter,
} from '@/components/budget/shared';
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

function sortByDueDate(a: Payable, b: Payable): number {
  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
}

function calculateTotal(items: Payable[]): number {
  return items.reduce((sum, item) => sum + item.value, 0);
}

export function PayablesSection({ payables, isLoading }: PayablesSectionProps) {
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

    creditCards.sort(sortByDueDate);
    recurring.sort(sortByDueDate);

    return {
      creditCardPayables: creditCards,
      recurringPayables: recurring,
      total: calculateTotal(payables),
    };
  }, [payables]);

  if (isLoading) {
    return <SectionLoader color="rose" />;
  }

  if (payables.length === 0) {
    return <EmptyState message="Nenhuma conta a pagar neste período." />;
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
          <GroupHeader
            title="Contas Recorrentes"
            count={recurringPayables.length}
            total={calculateTotal(recurringPayables)}
            color="rose"
          />
          <GroupContainer color="rose">{renderTable(recurringPayables)}</GroupContainer>
        </div>
      )}

      {creditCardPayables.length > 0 && (
        <div>
          <GroupHeader
            title="Faturas de Cartão"
            count={creditCardPayables.length}
            total={calculateTotal(creditCardPayables)}
            color="violet"
          />
          <GroupContainer color="violet">{renderTable(creditCardPayables)}</GroupContainer>
        </div>
      )}

      <TotalFooter total={total} color="rose" />
    </div>
  );
}
