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
  Pencil,
  Plus,
  RefreshCcw,
  Save,
  Settings,
  Tag,
  User,
  Wallet,
} from 'lucide-react';

export const navigation: NavigationSection[] = [
  {
    section: '📊 Análise e Planejamento',
    items: [
      { name: 'Home', href: '/home', icon: Home },
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      {
        name: 'Saúde Financeira',
        href: '/financial-health',
        icon: LineChart,
      },
      { name: 'Meu Orçamento', href: '/budget', icon: Wallet },
      /*{ name: 'Classificação Inteligente', href: '/ai/classification', icon: ChartBar },
       { name: 'Meu Planner', href: '/planner', icon: Calendar }, */
      { name: 'Relatórios', href: '/reports', icon: ChartBar },
    ],
  },
  {
    section: '💰 Gestão Financeira',
    items: [
      {
        name: 'Financeiro',
        icon: ArrowRightLeft,
        children: [
          { name: 'Nova Transação', href: '/transactions/new', icon: Plus },
          { name: 'Fluxo de Caixa', href: '/transactions', icon: ArrowRightLeft },
          { name: 'Extrato Bancário', href: '/import-ofx', icon: Import },
          /* { name: 'Contas a Pagar', href: '/payables', icon: ArrowDown },
          { name: 'Contas a Receber', href: '/receivables', icon: ArrowUp }, 
          { name: 'Fechamento Mensal', href: '/monthly-closing', icon: Calendar },
          { name: 'Resultado Anual', href: '/annual-result', icon: ChartBar }, */
        ],
      },
    ],
  },
  {
    section: '🧾 Administração',
    items: [
      {
        name: 'Cadastros',
        icon: Save,
        children: [
          { name: 'Empresas', href: '/companies', icon: Building2 },
          { name: 'Contas', href: '/accounts', icon: Banknote },
          { name: 'Cartões de Crédito', href: '/credit-cards', icon: CreditCard },
          { name: 'Categorias', href: '/categories', icon: Tag },
          /* { name: 'Dependentes', href: '/dependents', icon: Users }, */
          { name: 'Metas', href: '/goals', icon: Flag },
          { name: 'Recorrências', href: '/recurring-transactions', icon: RefreshCcw },
          { name: 'Usuários', href: '/users', icon: User },
          /* { name: 'Fontes de Receitas', href: '/income-sources', icon: DollarSign }, */
        ],
      },
      {
        name: 'Configurações',
        icon: Settings,
        children: [
          { name: 'Perfil do Usuário', href: '/profile', icon: User },
          { name: 'Preferências', href: '/settings/preferences', icon: Pencil },
          { name: 'Notificações', href: '/settings/notifications', icon: Bell },
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
          { name: 'Assinatura', href: '/settings/subscription', icon: CreditCard },
        ],
      },
    ],
  },
];
