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
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Transações', href: '/transactions', icon: ArrowsRightLeftIcon },
  { name: 'Classificação IA', href: '/ai/classification', icon: SparklesIcon },
  { name: 'Extrato', href: '/statement', icon: DocumentTextIcon },
  { name: 'Relatórios', href: '/reports', icon: ChartBarIcon },
  { name: 'Configurações', href: '/settings', icon: Cog6ToothIcon },
];

export function Sidebar() {
  const location = useLocation();
  const { isCollapsed, toggleCollapse } = useSidebarStore();

  return (
    <div className={cn(
      'h-full bg-card dark:bg-card-dark border-r border-border dark:border-border-dark',
      'transition-all duration-300 ease-in-out',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.map((item) => {
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
                  isCollapsed ? 'justify-center' : 'justify-start'
                )}
              >
                <item.icon
                  className={cn(
                    'flex-shrink-0 h-6 w-6',
                    isActive
                      ? 'text-primary-500'
                      : 'text-text dark:text-text-dark group-hover:text-primary-500'
                  )}
                  aria-hidden="true"
                />
                {!isCollapsed && (
                  <span className="ml-3">{item.name}</span>
                )}
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
              'transition-colors duration-200'
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
