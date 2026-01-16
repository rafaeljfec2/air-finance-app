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
}
