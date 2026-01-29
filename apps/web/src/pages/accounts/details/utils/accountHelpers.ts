import { Banknote, Wallet, Landmark, type LucideIcon } from 'lucide-react';
import type { Account } from '@/services/accountService';

export const DEFAULT_ACCOUNT_COLOR = '#8A05BE';

interface BankTheme {
  readonly primary: string;
  readonly gradient: string;
}

const BANK_THEMES: Record<string, BankTheme> = {
  '001': { primary: '#003D73', gradient: 'linear-gradient(135deg, #003D73 0%, #FFCC00 100%)' },
  '033': { primary: '#EC0000', gradient: 'linear-gradient(135deg, #EC0000 0%, #CC0000 100%)' },
  '077': { primary: '#FF7A00', gradient: 'linear-gradient(135deg, #FF7A00 0%, #FF5500 100%)' },
  '104': { primary: '#005CA9', gradient: 'linear-gradient(135deg, #005CA9 0%, #F37021 100%)' },
  '208': { primary: '#001E50', gradient: 'linear-gradient(135deg, #001E50 0%, #003380 100%)' },
  '212': { primary: '#00A86B', gradient: 'linear-gradient(135deg, #00A86B 0%, #008855 100%)' },
  '237': { primary: '#CC092F', gradient: 'linear-gradient(135deg, #CC092F 0%, #A00725 100%)' },
  '260': { primary: '#8A05BE', gradient: 'linear-gradient(135deg, #8A05BE 0%, #6B0494 100%)' },
  '140': { primary: '#8A05BE', gradient: 'linear-gradient(135deg, #8A05BE 0%, #6B0494 100%)' },
  '341': { primary: '#EC7000', gradient: 'linear-gradient(135deg, #FF6600 0%, #EC7000 100%)' },
  '623': { primary: '#004C99', gradient: 'linear-gradient(135deg, #004C99 0%, #FF6600 100%)' },
};

const INSTITUTION_TO_CODE: Record<string, string> = {
  'banco do brasil': '001',
  bb: '001',
  bradesco: '237',
  itau: '341',
  itaú: '341',
  'itau unibanco': '341',
  'itaú unibanco': '341',
  santander: '033',
  caixa: '104',
  'caixa economica': '104',
  'caixa econômica': '104',
  nubank: '260',
  'nu pagamentos': '260',
  inter: '077',
  'banco inter': '077',
  original: '212',
  'banco original': '212',
  pan: '623',
  'banco pan': '623',
  btg: '208',
  'btg pactual': '208',
};

function normalizeInstitution(institution: string): string {
  return institution
    .toLowerCase()
    .normalize('NFD')
    .replaceAll(/[\u0300-\u036f]/g, '')
    .trim();
}

function getBankCodeFromAccount(account: Account): string | null {
  const bankCode = account.bankDetails?.bankCode ?? account.bankCode;
  if (bankCode) return bankCode;

  const institution = account.bankDetails?.institution ?? account.institution;
  if (institution) {
    const normalized = normalizeInstitution(institution);
    return INSTITUTION_TO_CODE[normalized] ?? null;
  }

  return null;
}

export const getBankTheme = (account: Account): BankTheme | null => {
  const bankCode = getBankCodeFromAccount(account);
  if (bankCode && BANK_THEMES[bankCode]) {
    return BANK_THEMES[bankCode];
  }
  return null;
};

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
  const theme = getBankTheme(account);
  if (theme) {
    return theme.primary;
  }
  return account.color ?? DEFAULT_ACCOUNT_COLOR;
};

export const getAccountGradient = (account: Account): string => {
  const theme = getBankTheme(account);
  if (theme) {
    return theme.gradient;
  }
  const color = account.color ?? DEFAULT_ACCOUNT_COLOR;
  return `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`;
};

export const getAccountBankCode = (account: Account): string | undefined => {
  return getBankCodeFromAccount(account) ?? undefined;
};

export const getAccountInstitution = (account: Account): string | undefined => {
  return account.bankDetails?.institution ?? account.institution ?? undefined;
};
