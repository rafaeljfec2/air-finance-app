import { Banknote, Wallet, Landmark, type LucideIcon } from 'lucide-react';
import type { Account } from '@/services/accountService';

export const DEFAULT_ACCOUNT_COLOR = '#8A05BE';

export const getAccountIcon = (iconName?: string): LucideIcon => {
  switch (iconName) {
    case 'Wallet':
      return Wallet;
    case 'Landmark':
      return Landmark;
    case 'Banknote':
    default:
      return Banknote;
  }
};

export const getAccountSource = (account: Account): string => {
  if (account.integration?.enabled) {
    return 'Open Finance';
  }
  return 'Manual';
};

export const getAccountDetails = (account: Account): string => {
  const agency = account.bankDetails?.agency ?? account.agency;
  const accountNumber = account.bankDetails?.accountNumber ?? account.accountNumber;

  if (agency && accountNumber) {
    return `Ag ${agency} • Conta ${accountNumber}`;
  }

  return '';
};

export const getAccountBalance = (account: Account): number => {
  return account.currentBalance ?? account.initialBalance ?? 0;
};

export const getAccountColor = (account: Account): string => {
  return account.color ?? DEFAULT_ACCOUNT_COLOR;
};
