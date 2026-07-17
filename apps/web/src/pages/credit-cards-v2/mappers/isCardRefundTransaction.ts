import type { Transaction } from '@/services/transactionService';

const BILL_PAYMENT_REGEX = /pagamento/i;

/** Bill payments settle the previous statement (e.g. "PAGAMENTO RECEBIDO"). */
export function isBillPaymentDescription(description: string): boolean {
  return BILL_PAYMENT_REGEX.test(description);
}

/**
 * Card refunds are revenue entries on a credit-card account that are not bill
 * payments. Matches the backend / Open Finance rule.
 */
export function isCardRefundTransaction(
  transaction: Transaction,
  creditCardAccountIds: ReadonlySet<string>,
): boolean {
  if (transaction.launchType !== 'revenue') {
    return false;
  }
  if (!creditCardAccountIds.has(transaction.accountId)) {
    return false;
  }
  return !isBillPaymentDescription(transaction.description);
}
