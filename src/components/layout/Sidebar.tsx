import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  ArrowsRightLeftIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  SparklesIcon,
  WalletIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Budget', href: '/budget', icon: WalletIcon },
  {
    name: 'Financeiro',
    icon: WalletIcon,
    children: [
      { name: 'Transações', href: '/transactions', icon: ArrowsRightLeftIcon },
      { name: 'Extrato', href: '/statement', icon: DocumentTextIcon },
      { name: 'Relatórios', href: '/reports', icon: ChartBarIcon },
      { name: 'Importar OFX', href: '/import-ofx', icon: DocumentTextIcon },
    ],
  },
  { name: 'Classificação IA', href: '/ai/classification', icon: SparklesIcon },
  { name: 'Configurações', href: '/settings', icon: Cog6ToothIcon },
];

export function Sidebar() {
  const location = useLocation();
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <div
      className={cn(
        'h-full bg-card dark:bg-card-dark border-r border-border dark:border-border-dark',
        'transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
            if (item.children) {
              // Menu com submenus
              const isOpen = openMenu === item.name;
              // Destacar se algum filho está ativo
              const isAnyChildActive = item.children.some(
                (child) => location.pathname === child.href,
              );
              return (
                <div key={item.name}>
                  <button
                    onClick={() => setOpenMenu(isOpen ? null : item.name)}
                    className={cn(
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors w-full',
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
                              'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
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
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
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
        </nav>

        {/* Toggle button */}
        <div className="p-4">
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
  );
}
