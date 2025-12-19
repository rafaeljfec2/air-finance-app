import { BadgeStatus } from '@/components/budget';
import { EditableValueCell } from '@/components/budget/EditableValueCell';
import { Spinner } from '@/components/ui/spinner';
import type { Payable } from '@/types/budget';
import { useEditableValue } from '../hooks/useEditableValue';

interface PayablesSectionProps {
  payables: Payable[];
  isLoading: boolean;
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" className="text-rose-500" />
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr>
          <th className="px-3 py-2 text-left text-gray-400 w-[45%]">Descrição</th>
          <th className="px-3 py-2 text-right text-gray-400 w-[25%]">Valor</th>
          <th className="px-3 py-2 text-center text-gray-400 w-[30%]">Status</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border/60 dark:divide-border-dark/60">
        {payables.map((p) => (
          <tr key={p.id}>
            <td className="px-3 py-2 text-left text-text dark:text-text-dark">
              {p.description}
            </td>
            <td className="px-3 py-2 text-right font-medium whitespace-nowrap">
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
            <td className="px-3 py-2 text-center">
              <BadgeStatus status={p.status === 'PAID' ? 'success' : 'danger'}>
                {p.status === 'PAID' ? 'Pago' : 'Pendente'}
              </BadgeStatus>
            </td>
          </tr>
        ))}
        {payables.length === 0 && (
          <tr>
            <td
              className="px-3 py-4 text-center text-gray-500 dark:text-gray-400"
              colSpan={3}
            >
              Nenhuma conta a pagar neste período.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

