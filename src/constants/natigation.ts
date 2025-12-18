import { NavigationSection } from '@/types/navigation';
import {
  ArrowPathIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  FlagIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import {
  BellIcon,
  ChartBarIcon,
  CreditCardIcon,
  ImportIcon,
  PencilIcon,
  SaveIcon,
  TagIcon,
  UserIcon,
  WalletIcon,
} from 'lucide-react';

export const navigation: NavigationSection[] = [
  {
    section: '📊 Análise e Planejamento',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon },
      { name: 'Orçamento', href: '/budget', icon: WalletIcon },
      /* { name: 'Meu Planner', href: '/planner', icon: CalendarIcon }, 
       { name: 'Relatórios', href: '/reports', icon: ChartBarIcon }, */
    ],
  },
  {
    section: '💰 Gestão Financeira',
    items: [
      {
        name: 'Financeiro',
        icon: ArrowsRightLeftIcon,
        children: [
          { name: 'Novo lançamento', href: '/transactions/new', icon: PlusIcon },
          { name: 'Fluxo de Caixa', href: '/transactions', icon: ArrowsRightLeftIcon },
          { name: 'Importar Ofx', href: '/import-ofx', icon: ImportIcon },
          /* { name: 'Contas a Pagar', href: '/payables', icon: ArrowDownIcon },
          { name: 'Contas a Receber', href: '/receivables', icon: ArrowUpIcon }, 
          { name: 'Fechamento Mensal', href: '/monthly-closing', icon: CalendarIcon },
          { name: 'Resultado Anual', href: '/annual-result', icon: ChartBarIcon }, */
        ],
      },
    ],
  },
  /*{
    section: '🧠 Automação e Inteligência',
    items: [{ name: 'Classificação IA', href: '/ai/classification', icon: SparklesIcon }],
  },*/
  {
    section: '🧾 Administração',
    items: [
      {
        name: 'Cadastros',
        icon: SaveIcon,
        children: [
          { name: 'Empresas', href: '/companies', icon: BuildingOfficeIcon },
          { name: 'Contas Bancárias', href: '/accounts', icon: BanknotesIcon },
          { name: 'Categorias', href: '/categories', icon: TagIcon },
          /* { name: 'Dependentes', href: '/dependents', icon: UserGroupIcon }, */
          { name: 'Cartões de Crédito', href: '/credit-cards', icon: CreditCardIcon },
          { name: 'Metas', href: '/goals', icon: FlagIcon },
          { name: 'Transações Recorrentes', href: '/recurring-transactions', icon: ArrowPathIcon },
          /* { name: 'Fontes de Receitas', href: '/income-sources', icon: CurrencyDollarIcon },
          { name: 'Usuários', href: '/users', icon: UserIcon }, */
        ],
      },
      {
        name: 'Configurações',
        icon: Cog6ToothIcon,
        children: [
          { name: 'Usuário', href: '/profile', icon: UserIcon },
          { name: 'Preferências', href: '/settings/preferences', icon: PencilIcon },
          { name: 'Notificações', href: '/settings/notifications', icon: BellIcon },
        ],
      },
    ],
  },
];
