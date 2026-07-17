import type { Account } from '@/services/accountService';

export function isOpenFinanceConnectedAccount(account: Account | null | undefined): boolean {
  if (!account) {
    return false;
  }

  const hasLink = Boolean(account.openiItemId) || account.hasBankingIntegration === true;
  if (!hasLink) {
    return false;
  }

  return account.openiItemStatus !== 'ERROR';
}
