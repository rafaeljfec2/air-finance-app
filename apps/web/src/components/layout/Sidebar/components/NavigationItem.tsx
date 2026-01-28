import { NavigationLinkItem } from '@/types/navigation';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface NavigationItemProps {
  item: NavigationLinkItem;
  isCollapsed: boolean;
}

export function NavigationItem({ item, isCollapsed }: Readonly<NavigationItemProps>) {
  const location = useLocation();
  const isActive = location.pathname === item.href;

  return (
    <Link
      to={item.href}
      className={cn(
        'group flex items-center px-2.5 py-1.5 text-[13px] font-normal rounded-lg transition-colors',
        isActive
          ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200',
        isCollapsed ? 'justify-center' : 'justify-start',
      )}
    >
      <item.icon
        className={cn(
          'flex-shrink-0 h-[18px] w-[18px]',
          isActive
            ? 'text-primary-500'
            : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300',
        )}
        aria-hidden="true"
      />
      {!isCollapsed && <span className="ml-2.5">{item.name}</span>}
    </Link>
  );
}
