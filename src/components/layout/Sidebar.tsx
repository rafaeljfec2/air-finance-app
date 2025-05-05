import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarIcon,
  ChartBarIcon,
  ArrowsRightLeftIcon,
  WalletIcon,
  SparklesIcon,
  Cog6ToothIcon,
  TagIcon,
  BanknotesIcon,
  UserGroupIcon,
  CreditCardIcon,
  FlagIcon,
  CurrencyDollarIcon,
  BuildingOfficeIcon,
  UserIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ArrowDownIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar';
import { useState } from 'react';

const navigation = [
  {
    section: '📊 Análise e Planejamento',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
      { name: 'Meu Planner', href: '/planner', icon: CalendarIcon },
      { name: 'Relatórios', href: '/reports', icon: ChartBarIcon },
    ],
  },
  {
    section: '💰 Gestão Financeira',
    items: [
      {
        name: 'Financeiro',
        icon: ArrowsRightLeftIcon,
        children: [
          { name: 'Fluxo de Caixa', href: '/transactions', icon: ArrowsRightLeftIcon },
          { name: 'Relatórios', href: '/reports', icon: ChartBarIcon },
        ],
      },
      { name: 'Budget', href: '/budget', icon: WalletIcon },
    ],
  },
  {
    section: '🧠 Automação e Inteligência',
    items: [{ name: 'Classificação IA', href: '/ai/classification', icon: SparklesIcon }],
  },
  {
    section: '🧾 Administração',
    items: [
      {
        name: 'Cadastros',
        icon: Cog6ToothIcon,
        children: [
          { name: 'Empresas', href: '/companies', icon: BuildingOfficeIcon },
          { name: 'Contas Bancárias', href: '/accounts', icon: BanknotesIcon },
          { name: 'Categorias', href: '/categories', icon: TagIcon },
          { name: 'Dependentes', href: '/dependents', icon: UserGroupIcon },
          { name: 'Cartões de Crédito', href: '/credit-cards', icon: CreditCardIcon },
          { name: 'Metas', href: '/goals', icon: FlagIcon },
          { name: 'Fontes de Receitas', href: '/income-sources', icon: CurrencyDollarIcon },
          { name: 'Usuários', href: '/users', icon: UserIcon },
        ],
      },
      {
        name: 'Configurações',
        icon: Cog6ToothIcon,
        children: [
          { name: 'Usuário', href: '/profile', icon: UserIcon },
          { name: 'Preferências', href: '/settings/preferences', icon: Cog6ToothIcon },
          { name: 'Notificações', href: '/settings/notifications', icon: Cog6ToothIcon },
        ],
      },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const location = useLocation();
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  console.log('Sidebar render - isOpen:', isOpen);

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity lg:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sidebar */}
      <div
        className={cn(
          'fixed z-50 inset-y-0 left-0 h-full bg-card dark:bg-card-dark border-r border-border dark:border-border-dark',
          'transition-all duration-300 ease-in-out transform',
          isCollapsed ? 'w-16' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:static lg:translate-x-0 lg:z-0',
        )}
        role="navigation"
        aria-label="Menu lateral"
      >
        {/* Close button mobile */}
        <button
          className="absolute top-4 right-4 lg:hidden p-2 rounded-md text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="flex flex-col h-full pt-2">
          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map((group, idx) => (
              <div key={group.section} className={cn('mb-2', idx !== 0 && 'mt-6')}>
                {!isCollapsed && (
                  <div className="text-[11px] font-semibold text-gray-500 tracking-widest uppercase mb-1 pl-2">
                    {group.section}
                  </div>
                )}
                {group.items.map((item) => {
                  if (item.children) {
                    const isOpen = openMenu === item.name;
                    const isAnyChildActive = item.children.some(
                      (child) => location.pathname === child.href,
                    );
                    return (
                      <div key={item.name}>
                        <button
                          onClick={() => setOpenMenu(isOpen ? null : item.name)}
                          className={cn(
                            'group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors w-full',
                            isAnyChildActive
                              ? 'bg-primary-500/10 text-primary-500'
                              : 'text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark',
                            isCollapsed ? 'justify-center' : 'justify-start',
                          )}
                        >
                          <item.icon
                            className={cn(
                              'flex-shrink-0 h-6 w-6',
                              isAnyChildActive
                                ? 'text-primary-500'
                                : 'text-text dark:text-text-dark group-hover:text-primary-500',
                            )}
                            aria-hidden="true"
                          />
                          {!isCollapsed && (
                            <>
                              <span className="ml-3 flex-1 text-left">{item.name}</span>
                              <ArrowDownIcon
                                className={cn(
                                  'h-4 w-4 ml-auto transition-transform',
                                  isOpen ? 'rotate-180' : '',
                                )}
                              />
                            </>
                          )}
                        </button>
                        {/* Submenu */}
                        {!isCollapsed && isOpen && (
                          <div className="ml-8 mt-1 space-y-1">
                            {item.children.map((child) => {
                              const isActive = location.pathname === child.href;
                              return (
                                <Link
                                  key={child.name}
                                  to={child.href}
                                  className={cn(
                                    'group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors',
                                    isActive
                                      ? 'bg-primary-500/10 text-primary-500'
                                      : 'text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark',
                                  )}
                                >
                                  <child.icon className="h-5 w-5 mr-2" />
                                  {child.name}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }
                  // Menu simples
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors',
                        isActive
                          ? 'bg-primary-500/10 text-primary-500'
                          : 'text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark',
                        isCollapsed ? 'justify-center' : 'justify-start',
                      )}
                    >
                      <item.icon
                        className={cn(
                          'flex-shrink-0 h-6 w-6',
                          isActive
                            ? 'text-primary-500'
                            : 'text-text dark:text-text-dark group-hover:text-primary-500',
                        )}
                        aria-hidden="true"
                      />
                      {!isCollapsed && <span className="ml-3">{item.name}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Toggle button */}
          <div className="p-4 border-t border-border dark:border-border-dark">
            <button
              onClick={toggleCollapse}
              className={cn(
                'flex items-center justify-center w-full p-2 text-sm font-medium rounded-md',
                'text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark',
                'transition-colors duration-200',
              )}
            >
              {isCollapsed ? (
                <ChevronDoubleRightIcon className="h-5 w-5" />
              ) : (
                <>
                  <ChevronDoubleLeftIcon className="h-5 w-5" />
                  <span className="ml-2">Recolher</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
