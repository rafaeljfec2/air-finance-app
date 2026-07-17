import {
  getAccountNumber,
  getClosingDay,
  getDueDay,
  getOpeniAccountId,
  getOpeniItemId,
  getOpeniItemStatus,
  isOpenFinanceAccount,
} from '@/services/accountHelpers';
import type { Account } from '@/services/accountService';

export interface OpenFinanceCreditCard {
  readonly id: string;
  readonly openiCardId: string;
  readonly itemId: string;
  readonly name: string;
  readonly digits?: string;
  readonly status?: string;
  readonly color: string;
  readonly closingDay?: number;
  readonly dueDay?: number;
}

function resolveDigits(account: Account): string | undefined {
  const accountNumber = getAccountNumber(account)?.trim();
  if (!accountNumber) {
    return undefined;
  }
  if (accountNumber.length <= 4) {
    return accountNumber;
  }
  return accountNumber.slice(-4);
}

export function mapAccountToOpenFinanceCreditCard(account: Account): OpenFinanceCreditCard | null {
  if (account.type !== 'credit_card' || !isOpenFinanceAccount(account)) {
    return null;
  }

  const itemId = getOpeniItemId(account);
  const openiCardId = getOpeniAccountId(account);
  if (!itemId || !openiCardId) {
    return null;
  }

  return {
    id: account.id,
    openiCardId,
    itemId,
    name: account.name,
    digits: resolveDigits(account),
    status: getOpeniItemStatus(account) ?? undefined,
    color: account.color ?? '#8A05BE',
    closingDay: getClosingDay(account),
    dueDay: getDueDay(account),
  };
}

export function mapAccountsToOpenFinanceCreditCards(
  accounts: ReadonlyArray<Account> | undefined,
): OpenFinanceCreditCard[] {
  if (!accounts) {
    return [];
  }
  return accounts
    .map(mapAccountToOpenFinanceCreditCard)
    .filter((card): card is OpenFinanceCreditCard => card !== null);
}
