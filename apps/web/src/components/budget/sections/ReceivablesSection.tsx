import type React from 'react';
import { useCallback, useMemo } from 'react';

import { BadgeStatus } from '@/components/budget';
import { EditableValueCell } from '@/components/budget/EditableValueCell';
import {
  EmptyState,
  GroupContainer,
  GroupHeader,
  SectionLoader,
  TotalFooter,
} from '@/components/budget/shared';
import type { Receivable } from '@/types/budget';
import { formatDate } from '@/utils/date';
import { isFinishingInstallment } from '@/utils/installment.utils';

import { useReceivableActions } from '../hooks/useReceivableActions';

interface ReceivablesSectionProps {
  readonly receivables: Receivable[];
  readonly isLoading: boolean;
}

interface ReceivableRowProps {
  readonly receivable: Receivable;
  readonly editingId: string | null;
  readonly editingValue: string;
  readonly inputRef: React.RefObject<HTMLInputElement>;
  readonly isUpdating: boolean;
  readonly togglingId: string | null;
  readonly isToggleable: (id: string) => boolean;
  readonly isValueEditable: (id: string) => boolean;
  readonly onStartEditing: (id: string, value: number) => void;
  readonly onValueBlur: (id: string) => void;
  readonly onValueChange: (value: string) => void;
  readonly onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, id: string) => void;
  readonly onToggleStatus: (id: string, status: Receivable['status']) => void;
}

function sortByDueDate(a: Receivable, b: Receivable): number {
  return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
}

function calculateTotal(items: Receivable[]): number {
  return items.reduce((sum, item) => sum + item.value, 0);
}

function ReceivableRow({
  receivable,
  editingId,
  editingValue,
  inputRef,
  isUpdating,
  togglingId,
  isValueEditable,
  isToggleable,
  onStartEditing,
  onValueBlur,
  onValueChange,
  onKeyDown,
  onToggleStatus,
}: ReceivableRowProps) {
  const isReceived = receivable.status === 'RECEIVED';
  const canToggle = isToggleable(receivable.id);
  const canEditValue = isValueEditable(receivable.id);
  const isEditing = editingId === receivable.id;

  const handleBlur = useCallback(() => {
    onValueBlur(receivable.id);
  }, [onValueBlur, receivable.id]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.stopPropagation();
      onKeyDown(e, receivable.id);
    },
    [onKeyDown, receivable.id],
  );

  return (
    <tr>
      <td className="px-2 py-1.5 text-left text-gray-500 dark:text-gray-400 whitespace-nowrap">
        {formatDate(receivable.dueDate)}
      </td>
      <td className="px-2 py-1.5 text-left text-text dark:text-text-dark truncate max-w-[200px]">
        {receivable.description}
      </td>
      <td className="px-2 py-1.5 text-center">
        <BadgeStatus
          status={isReceived ? 'success' : 'warning'}
          onClick={canToggle ? () => onToggleStatus(receivable.id, receivable.status) : undefined}
          disabled={togglingId === receivable.id}
        >
          {isReceived ? 'Recebido' : 'Pendente'}
        </BadgeStatus>
      </td>
      <td className="px-2 py-1.5 text-right font-medium whitespace-nowrap text-white dark:text-white">
        <EditableValueCell
          value={receivable.value}
          isEditing={isEditing}
          canEdit={canEditValue}
          editingValue={editingValue}
          inputRef={inputRef}
          isUpdating={isUpdating}
          onDoubleClick={() => onStartEditing(receivable.id, receivable.value)}
          onValueChange={onValueChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        />
      </td>
    </tr>
  );
}

function ReceivablesTable({
  items,
  ...rowProps
}: { readonly items: Receivable[] } & Omit<ReceivableRowProps, 'receivable'>) {
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
        {items.map((r) => (
          <ReceivableRow key={r.id} receivable={r} {...rowProps} />
        ))}
      </tbody>
    </table>
  );
}

export function ReceivablesSection({ receivables, isLoading }: ReceivablesSectionProps) {
  const {
    editingId,
    editingValue,
    inputRef,
    isUpdating,
    togglingId,
    isToggleable,
    isValueEditable,
    startEditing,
    commitValueOnBlur,
    handleKeyDown,
    handleValueChange,
    toggleStatus,
  } = useReceivableActions();

  const { finishingReceivables, otherReceivables, total } = useMemo(() => {
    const finishing: Receivable[] = [];
    const other: Receivable[] = [];

    receivables.forEach((r) => {
      if (isFinishingInstallment(r.description)) {
        finishing.push(r);
      } else {
        other.push(r);
      }
    });

    finishing.sort(sortByDueDate);
    other.sort(sortByDueDate);

    return {
      finishingReceivables: finishing,
      otherReceivables: other,
      total: calculateTotal(receivables),
    };
  }, [receivables]);

  if (isLoading) {
    return <SectionLoader color="amber" />;
  }

  if (receivables.length === 0) {
    return <EmptyState message="Nenhuma conta a receber neste período." />;
  }

  const tableProps = {
    editingId,
    editingValue,
    inputRef,
    isUpdating,
    togglingId,
    isToggleable,
    isValueEditable,
    onStartEditing: startEditing,
    onValueBlur: commitValueOnBlur,
    onValueChange: handleValueChange,
    onKeyDown: handleKeyDown,
    onToggleStatus: toggleStatus,
  };

  return (
    <div className="space-y-6">
      {finishingReceivables.length > 0 && (
        <div>
          <GroupHeader
            title="Parcelas Finalizando"
            count={finishingReceivables.length}
            total={calculateTotal(finishingReceivables)}
            color="emerald"
          />
          <GroupContainer color="emerald">
            <ReceivablesTable items={finishingReceivables} {...tableProps} />
          </GroupContainer>
        </div>
      )}

      {otherReceivables.length > 0 && (
        <div>
          <GroupHeader
            title="Outras Receitas"
            count={otherReceivables.length}
            total={calculateTotal(otherReceivables)}
            color="amber"
          />
          <GroupContainer color="amber">
            <ReceivablesTable items={otherReceivables} {...tableProps} />
          </GroupContainer>
        </div>
      )}

      <TotalFooter total={total} color="emerald" />
    </div>
  );
}
