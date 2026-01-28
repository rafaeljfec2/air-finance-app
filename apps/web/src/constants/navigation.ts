import { NavigationSection } from '@/types/navigation';
import { UserRole } from '@/types/user';
import {
  ArrowRightLeft,
  Banknote,
  Bell,
  Building2,
  ChartBar,
  CreditCard,
  Flag,
  Home,
  Import,
  LayoutDashboard,
  LineChart,
  Link2,
  Pencil,
  Plus,
  RefreshCcw,
  Tag,
  User,
  Wallet,
} from 'lucide-react';
export const navigation: NavigationSection[] = [
  {
    section: '📊 Visão Geral',
    items: [
      { name: 'Home', href: '/home', icon: Home },
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      {
        name: 'Saúde Financeira',
        href: '/financial-health',
        icon: LineChart,
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
      { name: 'Importar Extrato (OFX)', href: '/import-ofx', icon: Import },
    ],
  },

  {
    section: '🏦 Contas & Estrutura',
    items: [
      { name: 'Empresas', href: '/companies', icon: Building2 },
      { name: 'Contas Bancárias', href: '/accounts', icon: Banknote },
      { name: 'Open Finance', href: '/openfinance', icon: Link2, roles: [UserRole.GOD] },
      { name: 'Cartões de Crédito', href: '/credit-cards', icon: CreditCard },
      { name: 'Categorias', href: '/categories', icon: Tag },
      { name: 'Recorrências', href: '/recurring-transactions', icon: RefreshCcw },
    ],
  },

  {
    section: '⚙️ Conta & Preferências',
    items: [
      { name: 'Perfil', href: '/profile', icon: User },
      { name: 'Preferências', href: '/settings/preferences', icon: Pencil },
      { name: 'Notificações', href: '/settings/notifications', icon: Bell },
      { name: 'Assinatura', href: '/settings/subscription', icon: CreditCard },
    ],
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
