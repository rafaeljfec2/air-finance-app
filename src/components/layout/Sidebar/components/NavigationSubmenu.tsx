import { NavigationLinkItem } from '@/types/navigation';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

interface NavigationSubmenuProps {
  items: NavigationLinkItem[];
  isOpen: boolean;
}

export function NavigationSubmenu({ items, isOpen }: Readonly<NavigationSubmenuProps>) {
  const location = useLocation();

  return (
    <div
      className={cn(
        'ml-8 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out',
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
      )}
    >
      <div className="py-1">
        {items.map((child) => {
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
    </div>
  );
}
