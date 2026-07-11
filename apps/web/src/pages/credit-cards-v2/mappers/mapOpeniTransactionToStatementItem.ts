import type { OpeniCreditCardTransactionsPayload } from '@/services/openiService';

export type StatementTransactionStatus = 'PENDING' | 'POSTED' | string;
export type StatementTransactionType = 'DEBIT' | 'CREDIT' | string;

export interface StatementTransactionItem {
  readonly id: string;
  readonly date: string;
  readonly description: string;
  readonly amount: number;
  readonly type: StatementTransactionType;
  readonly status: StatementTransactionStatus;
  readonly installment?: string;
  readonly billId: string | null;
}

type OpeniTransaction = OpeniCreditCardTransactionsPayload['transactions'][number];

function formatInstallment(
  installmentNumber: number | null,
  installmentTotal: number | null,
): string | undefined {
  if (installmentNumber === null || installmentTotal === null) {
    return undefined;
  }
  return `${installmentNumber}/${installmentTotal}`;
}

function resolveDescription(description: string, descriptionRaw: string): string {
  const primary = description.trim();
  if (primary.length > 0) {
    return primary;
  }
  const raw = descriptionRaw.trim();
  if (raw.length > 0) {
    return raw;
  }
  return 'Sem descrição';
}

export function mapOpeniTransactionToStatementItem(
  transaction: OpeniTransaction,
): StatementTransactionItem {
  return {
    id: transaction.id,
    date: transaction.transactionAt,
    description: resolveDescription(transaction.description, transaction.descriptionRaw),
    amount: transaction.amount,
    type: transaction.type,
    status: transaction.status,
    installment: formatInstallment(transaction.installmentNumber, transaction.installmentTotal),
    billId: transaction.billId,
  };
}

export function mapOpeniTransactionsToStatementItems(
  transactions: ReadonlyArray<OpeniTransaction>,
): StatementTransactionItem[] {
  return transactions
    .map(mapOpeniTransactionToStatementItem)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
