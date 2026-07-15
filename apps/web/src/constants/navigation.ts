import {
  ArrowRightLeft,
  Banknote,
  Building2,
  ChartBar,
  CreditCard,
  Flag,
  Home,
  Import,
  LayoutDashboard,
  Link2,
  Scale,
  Plus,
  RefreshCcw,
  Send,
  Tag,
  User,
  Wallet,
} from 'lucide-react';

import { NavigationSection } from '@/types/navigation';
import { UserRole } from '@/types/user';

export const navigation: NavigationSection[] = [
  {
    section: '📊 Visão Geral',
    items: [
      { name: 'Home', href: '/home', icon: Home },
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      {
        name: 'Leitura do período',
        href: '/decision',
        icon: Scale,
      },
      { name: 'Relatórios', href: '/reports', icon: ChartBar },
    ],
  },
  {
    section: '🎯 Planejamento',
    items: [
      { name: 'Orçamento', href: '/budget', icon: Wallet },
      { name: 'Metas Financeiras', href: '/goals', icon: Flag },
    ],
  },

  {
    section: '💸 Movimentações',
    items: [
      { name: 'Nova Transação', href: '/transactions/new', icon: Plus },
      { name: 'Fluxo de Caixa', href: '/transactions', icon: ArrowRightLeft },
      { name: 'Importar Extrato', href: '/import-ofx', icon: Import },
      { name: 'Pagamentos', href: '/payments', icon: Send },
    ],
  },

  {
    section: '🏦 Contas & Estrutura',
    items: [
      { name: 'Perfis', href: '/companies', icon: Building2 },
      { name: 'Contas Bancárias', href: '/accounts/details', icon: Banknote },
      { name: 'Open Finance', href: '/openfinance', icon: Link2 },
      { name: 'Cartões de Crédito', href: '/credit-cards-v2', icon: CreditCard },
      { name: 'Categorias', href: '/categories', icon: Tag },
      { name: 'Recorrências', href: '/recurring-transactions', icon: RefreshCcw },
    ],
  },

  {
    section: '⚙️ Conta & Preferências',
    items: [{ name: 'Minha Conta', href: '/profile', icon: User }],
  },

  {
    section: '🛡️ Administração',
    items: [
      {
        name: 'Usuários',
        href: '/users',
        icon: User,
      },
      {
        name: 'Logs OpenAI',
        href: '/admin/openai-logs',
        icon: ChartBar,
        roles: [UserRole.GOD],
      },
      {
        name: 'Gerenciar Planos',
        href: '/admin/plans',
        icon: CreditCard,
        roles: [UserRole.GOD],
      },
    ],
  },
];
