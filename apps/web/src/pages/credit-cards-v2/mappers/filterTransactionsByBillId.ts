import type { OpenFinanceBillView } from './mapOpeniBillsToView';
import type { StatementTransactionItem } from './mapOpeniTransactionToStatementItem';

export function filterTransactionsByBillId(
  transactions: ReadonlyArray<StatementTransactionItem>,
  billId: string | null,
): StatementTransactionItem[] {
  if (!billId) {
    return [...transactions];
  }
  return transactions.filter((tx) => tx.billId === billId);
}

export function formatOpenFinanceBillLabel(bill: OpenFinanceBillView): string {
  const datePart = bill.dueDate.split('T')[0] ?? bill.dueDate;
  const [year, month, day] = datePart.split('-').map(Number);
  const dueLabel = new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return `Fatura · vence ${dueLabel}`;
}
