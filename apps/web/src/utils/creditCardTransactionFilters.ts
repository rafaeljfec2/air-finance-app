import type { CreditCardBill } from '@/types/budget';
import { extractInstallment, isFinishingInstallment } from '@/utils/installment.utils';

export type CreditCardBillTransaction = CreditCardBill['transactions'][number];
export type CreditCardGridFilter = 'all' | 'installment' | 'cash' | 'finishing';

const CREDIT_KEYWORDS = [
  'pagamento recebido',
  'recebido',
  'crédito',
  'credit',
  'estorno',
  'reembolso',
  'devolução',
];

const CREDIT_CATEGORIES = [
  'salario',
  'salário',
  'aluguel recebido',
  'rendimento',
  'receita',
  'income',
  'revenue',
];

export function isDebitTransaction(transaction: CreditCardBillTransaction): boolean {
  const description = transaction.description.toLowerCase();
  const category = transaction.category.toLowerCase();

  const hasCreditKeyword = CREDIT_KEYWORDS.some((keyword) => description.includes(keyword));
  const hasCreditCategory = CREDIT_CATEGORIES.some((cat) => category.includes(cat));

  return !hasCreditKeyword && !hasCreditCategory;
}

export function isInstallmentTransaction(transaction: CreditCardBillTransaction): boolean {
  if (!isDebitTransaction(transaction)) {
    return false;
  }

  return (
    transaction.category === 'Parcelado' || extractInstallment(transaction.description) !== null
  );
}

export function isCashDebitTransaction(transaction: CreditCardBillTransaction): boolean {
  return isDebitTransaction(transaction) && !isInstallmentTransaction(transaction);
}

export function matchesCreditCardGridFilter(
  transaction: CreditCardBillTransaction,
  filter: CreditCardGridFilter,
): boolean {
  switch (filter) {
    case 'all':
      return isDebitTransaction(transaction);
    case 'installment':
      return isInstallmentTransaction(transaction);
    case 'cash':
      return isCashDebitTransaction(transaction);
    case 'finishing':
      return isDebitTransaction(transaction) && isFinishingInstallment(transaction.description);
    default:
      return false;
  }
}

export function filterCreditCardTransactions(
  transactions: ReadonlyArray<CreditCardBillTransaction>,
  filter: CreditCardGridFilter,
): CreditCardBillTransaction[] {
  return transactions.filter((transaction) => matchesCreditCardGridFilter(transaction, filter));
}

export function sumCreditCardTransactions(
  transactions: ReadonlyArray<CreditCardBillTransaction>,
): number {
  return transactions.reduce((sum, transaction) => sum + transaction.value, 0);
}

export function calculateCreditCardTotals(transactions: ReadonlyArray<CreditCardBillTransaction>): {
  readonly totalParcelado: number;
  readonly totalVista: number;
  readonly totalFinalizando: number;
} {
  const debitTransactions = transactions.filter(isDebitTransaction);

  return debitTransactions.reduce(
    (totals, transaction) => {
      if (isInstallmentTransaction(transaction)) {
        const installment = extractInstallment(transaction.description);
        const nextTotals = {
          ...totals,
          totalParcelado: totals.totalParcelado + transaction.value,
        };

        if (installment && installment.current === installment.total) {
          return {
            ...nextTotals,
            totalFinalizando: nextTotals.totalFinalizando + transaction.value,
          };
        }

        return nextTotals;
      }

      return {
        ...totals,
        totalVista: totals.totalVista + transaction.value,
      };
    },
    { totalParcelado: 0, totalVista: 0, totalFinalizando: 0 },
  );
}
