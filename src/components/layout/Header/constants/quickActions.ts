import { ArrowRightLeft, ChartBar, Import, LucideIcon, Plus } from 'lucide-react';

export interface QuickAction {
  icon: LucideIcon;
  href: string;
  title: string;
}

export const quickActions: QuickAction[] = [
  {
    icon: Plus,
    href: '/transactions/new',
    title: 'Nova Transação',
  },
  {
    icon: ArrowRightLeft,
    href: '/transactions',
    title: 'Fluxo de Caixa',
  },
  {
    icon: Import,
    href: '/import-ofx',
    title: 'Importar Extrato',
  },
  {
    icon: ChartBar,
    href: '/reports',
    title: 'Relatórios',
  },
];
