import { NavigationSection } from '@/types/navigation';
import {
    ArrowRightLeft,
    Banknote,
    Bell,
    Building2,
    ChartBar,
    CreditCard,
    Flag,
    Import,
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
      { name: 'Dashboard', href: '/dashboard', icon: ChartBar },
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
          { name: 'Novo Lançamento', href: '/transactions/new', icon: Plus },
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
          { name: 'Contas Bancárias', href: '/accounts', icon: Banknote },
          { name: 'Categorias', href: '/categories', icon: Tag },
          /* { name: 'Dependentes', href: '/dependents', icon: Users }, */
          { name: 'Cartões de Crédito', href: '/credit-cards', icon: CreditCard },
          { name: 'Metas', href: '/goals', icon: Flag },
          { name: 'Transações Recorrentes', href: '/recurring-transactions', icon: RefreshCcw },
          /* { name: 'Fontes de Receitas', href: '/income-sources', icon: DollarSign },
          { name: 'Usuários', href: '/users', icon: User }, */
        ],
      },
      {
        name: 'Configurações',
        icon: Settings,
        children: [
          { name: 'Usuário', href: '/profile', icon: User },
          { name: 'Preferências', href: '/settings/preferences', icon: Pencil },
          { name: 'Notificações', href: '/settings/notifications', icon: Bell },
        ],
      },
    ],
  },
];
