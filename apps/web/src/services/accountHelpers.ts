import type { Account } from './accountService';

/**
 * Helper functions para acessar campos de Account
 * Suporta tanto estrutura nova (subdocumentos) quanto legada (flat)
 */

// === BANK DETAILS ===

export function getInstitution(account: Account): string {
  return account.bankDetails?.institution ?? account.institution ?? '';
}

export function getBankCode(account: Account): string | undefined {
  return account.bankDetails?.bankCode ?? account.bankCode ?? undefined;
}

export function getAgency(account: Account): string | undefined {
  return account.bankDetails?.agency ?? account.agency ?? undefined;
}

export function getAccountNumber(account: Account): string | undefined {
  return account.bankDetails?.accountNumber ?? account.accountNumber ?? undefined;
}

export function getPixKey(account: Account): string | undefined {
  return account.bankDetails?.pixKey ?? account.pixKey ?? undefined;
}

// === BALANCE ===

export function getInitialBalance(account: Account): number {
  if (typeof account.balance === 'object' && account.balance !== null) {
    return account.balance.initial ?? 0;
  }
  return account.initialBalance ?? 0;
}

export function getInitialBalanceDate(account: Account): string | null {
  if (typeof account.balance === 'object' && account.balance !== null) {
    return account.balance.date ?? null;
  }
  return account.initialBalanceDate ?? null;
}

export function getUseInitialBalanceInExtract(account: Account): boolean {
  if (typeof account.balance === 'object' && account.balance !== null) {
    return account.balance.useInExtract ?? true;
  }
  return account.useInitialBalanceInExtract ?? true;
}

export function getUseInitialBalanceInCashFlow(account: Account): boolean {
  if (typeof account.balance === 'object' && account.balance !== null) {
    return account.balance.useInCashFlow ?? true;
  }
  return account.useInitialBalanceInCashFlow ?? true;
}

// === CREDIT CARD ===

export function getCreditLimit(account: Account): number | undefined {
  return account.creditCard?.limit ?? account.creditLimit ?? undefined;
}

export function getClosingDay(account: Account): number | undefined {
  return account.creditCard?.closingDay ?? undefined;
}

export function getDueDay(account: Account): number | undefined {
  return account.creditCard?.dueDay ?? undefined;
}

// === INTEGRATION ===

export function hasBankingIntegration(account: Account): boolean {
  return account.integration?.enabled ?? account.hasBankingIntegration ?? false;
}

export function getBankingTenantId(account: Account): string | undefined {
  return account.integration?.tenantId ?? account.bankingTenantId ?? undefined;
}

// === SYNC ===

export function isSyncEnabled(account: Account): boolean {
  return account.integration?.sync?.enabled ?? false;
}

export function getSyncCronExpression(account: Account): string | undefined {
  return account.integration?.sync?.cronExpression ?? undefined;
}

export function getLastSyncAt(account: Account): string | undefined {
  return account.integration?.sync?.lastSyncAt ?? undefined;
}

export function isAutoImportToCashFlow(account: Account): boolean {
  return account.integration?.sync?.autoImportToCashFlow ?? false;
}

// === OPEN FINANCE ===

export function getOpeniItemId(account: Account): string | undefined {
  return account.integration?.openFinance?.itemId ?? account.openiItemId ?? undefined;
}

export function getOpeniAccountId(account: Account): string | undefined {
  return account.integration?.openFinance?.accountId ?? undefined;
}

export function getOpeniConnectorId(account: Account): string | undefined {
  return account.integration?.openFinance?.connectorId ?? account.openiConnectorId ?? undefined;
}

export function getOpeniItemStatus(account: Account): string | undefined {
  return account.integration?.openFinance?.status ?? account.openiItemStatus ?? undefined;
}

export function getOpeniAuthUrl(account: Account): string | undefined {
  return account.integration?.openFinance?.auth?.url ?? account.openiAuthUrl ?? undefined;
}

export function getOpeniAuthExpiresAt(account: Account): string | undefined {
  return (
    account.integration?.openFinance?.auth?.expiresAt ?? account.openiAuthExpiresAt ?? undefined
  );
}

// === COMPUTED VALUES ===

export function getDisplayName(account: Account): string {
  const institution = getInstitution(account);
  return institution ? `${account.name} - ${institution}` : account.name;
}

export function isOpenFinanceAccount(account: Account): boolean {
  return Boolean(getOpeniItemId(account));
}

export function hasActiveOpenFinanceConnection(account: Account): boolean {
  const status = getOpeniItemStatus(account);
  return status === 'CONNECTED' || status === 'SYNCED' || status === 'SYNCING';
}
