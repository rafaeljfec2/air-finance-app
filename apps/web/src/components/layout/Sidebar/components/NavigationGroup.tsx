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
          'group flex items-center px-2.5 py-1.5 text-[13px] font-normal rounded-lg transition-colors w-full',
          isAnyChildActive
            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200',
          isCollapsed ? 'justify-center' : 'justify-start',
        )}
      >
        <item.icon
          className={cn(
            'flex-shrink-0 h-[18px] w-[18px]',
            isAnyChildActive
              ? 'text-primary-500'
              : 'text-gray-500 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300',
          )}
          aria-hidden="true"
        />
        {!isCollapsed && (
          <>
            <span className="ml-2.5 flex-1 text-left">{item.name}</span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 ml-auto transition-transform text-gray-400',
                isOpen ? 'rotate-180' : '',
              )}
            />
          </>
        )}
      </button>
      {!isCollapsed && <NavigationSubmenu items={item.children} isOpen={isOpen} />}
    </div>
  );
}
