import {
  ArrowRightLeft,
  CreditCard,
  Files,
  Flag,
  Import,
  Plus,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface QuickAction {
  label: string;
  icon: LucideIcon;
  href: string;
  color: string;
  className?: string;
  onClick?: () => void;
}

export const createQuickActions = (
  onNewTransactionClick: () => void,
): QuickAction[] => [
  {
    label: 'Novo Lançamento',
    icon: Plus,
    href: '#',
    onClick: onNewTransactionClick,
    color: 'bg-primary-500',
    className:
      'col-span-2 bg-primary-50 dark:bg-primary-900/10 border-primary-100 dark:border-primary-900/20',
  },
  { label: 'Contas', icon: CreditCard, href: '/accounts', color: 'bg-purple-500' },
  { label: 'Extrato', icon: Import, href: '/import-ofx', color: 'bg-green-500' },
  { label: 'Metas', icon: Flag, href: '/goals', color: 'bg-amber-500' },
  {
    label: 'Fluxo de Caixa',
    icon: ArrowRightLeft,
    href: '/transactions',
    color: 'bg-orange-500',
  },
  { label: 'Relatórios', icon: Files, href: '/reports', color: 'bg-blue-500' },
];
