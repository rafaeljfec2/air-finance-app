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
import type React from 'react';
import { useCallback, useMemo } from 'react';
import { useEditableValue } from '../hooks/useEditableValue';
import { usePayableStatus } from '../hooks/usePayableStatus';

interface PayablesSectionProps {
  readonly payables: Payable[];
  readonly isLoading: boolean;
}

interface PayableRowProps {
  readonly payable: Payable;
  readonly editingId: string | null;
  readonly editingValue: string;
  readonly inputRef: React.RefObject<HTMLInputElement>;
  readonly isUpdating: boolean;
  readonly togglingId: string | null;
  readonly isToggleable: (id: string) => boolean;
  readonly onStartEditing: (id: string, value: number) => void;
  readonly onSaveValue: (id: string) => void;
  readonly onValueChange: (value: string) => void;
  readonly onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: string) => void;
  readonly onToggleStatus: (id: string, status: Payable['status']) => void;
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

function PayableRow({
  payable,
  editingId,
  editingValue,
  inputRef,
  isUpdating,
  togglingId,
  isToggleable,
  onStartEditing,
  onSaveValue,
  onValueChange,
  onKeyDown,
  onToggleStatus,
}: PayableRowProps) {
  const isPaid = payable.status === 'PAID';
  const canToggle = isToggleable(payable.id);
  const isEditing = editingId === payable.id;

  const handleBlur = useCallback(() => {
    setTimeout(() => onSaveValue(payable.id), 200);
  }, [onSaveValue, payable.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();
      onKeyDown(e, payable.id);
    },
    [onKeyDown, payable.id],
  );

  return (
    <tr>
      <td className="px-2 py-1.5 text-left text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {formatDate(payable.dueDate)}
      </td>
      <td className="px-2 py-1.5 text-left text-text dark:text-text-dark truncate max-w-[200px]">
        {payable.description}
      </td>
      <td className="px-2 py-1.5 text-center">
        <BadgeStatus
          status={isPaid ? 'success' : 'danger'}
          onClick={canToggle ? () => onToggleStatus(payable.id, payable.status) : undefined}
          disabled={togglingId === payable.id}
        >
          {isPaid ? 'Pago' : 'Pendente'}
        </BadgeStatus>
      </td>
      <td className="px-2 py-1.5 text-right font-medium whitespace-nowrap text-white dark:text-white">
        <EditableValueCell
          value={payable.value}
          isEditing={isEditing}
          editingValue={editingValue}
          inputRef={inputRef}
          isUpdating={isUpdating}
          onDoubleClick={() => onStartEditing(payable.id, payable.value)}
          onValueChange={onValueChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      </td>
    </tr>
  );
}

function PayablesTable({
  items,
  ...rowProps
}: { readonly items: Payable[] } & Omit<PayableRowProps, 'payable'>) {
  return (
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
          <PayableRow key={p.id} payable={p} {...rowProps} />
        ))}
      </tbody>
    </table>
  );
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

  const { togglingId, isToggleable, toggleStatus } = usePayableStatus();

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

  const tableProps = {
    editingId,
    editingValue,
    inputRef,
    isUpdating,
    togglingId,
    isToggleable,
    onStartEditing: startEditing,
    onSaveValue: saveValue,
    onValueChange: handleValueChange,
    onKeyDown: handleKeyDown,
    onToggleStatus: toggleStatus,
  };

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
          <GroupContainer color="rose">
            <PayablesTable items={recurringPayables} {...tableProps} />
          </GroupContainer>
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
          <GroupContainer color="violet">
            <PayablesTable items={creditCardPayables} {...tableProps} />
          </GroupContainer>
        </div>
      )}

      <TotalFooter total={total} color="rose" />
    </div>
  );
}
