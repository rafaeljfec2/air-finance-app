import { Banknote, CreditCard, Landmark, Wallet } from 'lucide-react';

export const accountTypes = [
  { value: 'checking', label: 'Conta Corrente', icon: Banknote, iconName: 'Banknote' },
  { value: 'savings', label: 'Poupança', icon: Wallet, iconName: 'Wallet' },
  { value: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard, iconName: 'CreditCard' },
  { value: 'digital_wallet', label: 'Carteira Digital', icon: Wallet, iconName: 'Wallet' },
  { value: 'investment', label: 'Investimento', icon: Landmark, iconName: 'Landmark' },
] as const;

export type AccountType = (typeof accountTypes)[number]['value'];
