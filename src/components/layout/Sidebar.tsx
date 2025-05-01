import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ArrowsRightLeftIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar';

export function Sidebar() {
  const location = useLocation();
  const { isCollapsed, toggleCollapse } = useSidebarStore();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: HomeIcon,
    },
    {
      name: 'Extrato',
      href: '/statement',
      icon: BanknotesIcon,
    },
    {
      name: 'Transações',
      href: '/transactions',
      icon: ArrowsRightLeftIcon,
    },
    {
      name: 'Relatórios',
      href: '/reports',
      icon: ChartPieIcon,
    },
    {
      name: 'Configurações',
      href: '/settings',
      icon: Cog6ToothIcon,
    },
  ];

  return (
    <div
      className={cn(
        'h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-end p-4">
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {navigation.map(item => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                )}
              >
                <item.icon
                  className={cn(
                    'flex-shrink-0 h-6 w-6',
                    isActive
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-300 group-hover:text-gray-500'
                  )}
                />
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
