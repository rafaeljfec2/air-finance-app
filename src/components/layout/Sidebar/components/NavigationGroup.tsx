import { NavigationGroupItem, NavigationItem } from '@/types/navigation';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { NavigationSubmenu } from './NavigationSubmenu';
import { NavigationItem as NavigationItemComponent } from './NavigationItem';

interface NavigationGroupProps {
  item: NavigationItem;
  isCollapsed: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

function isGroupItem(item: NavigationItem): item is NavigationGroupItem {
  return 'children' in item && Array.isArray(item.children);
}

export function NavigationGroup({
  item,
  isCollapsed,
  isOpen,
  onToggle,
}: Readonly<NavigationGroupProps>) {
  const location = useLocation();

  if (!isGroupItem(item)) {
    return <NavigationItemComponent item={item} isCollapsed={isCollapsed} />;
  }

  const isAnyChildActive = item.children.some((child) => location.pathname === child.href);

  return (
    <div>
      <button
        onClick={onToggle}
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
            <ChevronDown
              className={cn('h-4 w-4 ml-auto transition-transform', isOpen ? 'rotate-180' : '')}
            />
          </>
        )}
      </button>
      {!isCollapsed && <NavigationSubmenu children={item.children} isOpen={isOpen} />}
    </div>
  );
}
