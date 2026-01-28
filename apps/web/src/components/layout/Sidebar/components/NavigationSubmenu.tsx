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
        'ml-7 mt-0.5 space-y-0.5 overflow-hidden transition-all duration-300 ease-in-out',
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
      )}
    >
      <div className="py-0.5">
        {items.map((child) => {
          const isActive = location.pathname === child.href;
          return (
            <Link
              key={child.name}
              to={child.href}
              className={cn(
                'group flex items-center px-2.5 py-1.5 text-[12px] font-normal rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-700 dark:hover:text-gray-300',
              )}
            >
              <child.icon className="h-4 w-4 mr-2 opacity-70" />
              {child.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
