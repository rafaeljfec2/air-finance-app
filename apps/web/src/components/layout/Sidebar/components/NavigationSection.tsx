import {
  NavigationSection as NavigationSectionType,
  NavigationItem as NavigationItemType,
  NavigationGroupItem,
} from '@/types/navigation';
import { NavigationGroup } from './NavigationGroup';
import { NavigationItem } from './NavigationItem';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar';
import { PanelLeftClose, PanelLeft } from 'lucide-react';

interface NavigationSectionProps {
  readonly section: NavigationSectionType;
  readonly index: number;
  readonly isCollapsed: boolean;
  readonly openMenu: string | null;
  readonly onMenuToggle: (itemName: string) => void;
}

function isGroupItem(item: NavigationItemType): item is NavigationGroupItem {
  return 'children' in item && Array.isArray(item.children);
}

export function NavigationSection({
  section,
  index,
  isCollapsed,
  openMenu,
  onMenuToggle,
}: Readonly<NavigationSectionProps>) {
  const { toggleCollapse } = useSidebarStore();
  const isFirstSection = index === 0;

  return (
    <div key={section.section} className={cn('mb-2', index !== 0 && 'mt-6')}>
      {isCollapsed ? (
        isFirstSection && (
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-full p-2 mb-1 rounded-md text-text-muted dark:text-text-muted-dark hover:bg-background dark:hover:bg-background-dark hover:text-text dark:hover:text-text-dark transition-colors"
            aria-label="Expandir menu"
            title="Expandir menu"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        )
      ) : (
        <div className="flex items-center justify-between mb-1.5 pl-2.5 pr-1">
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-600 tracking-wider uppercase">
            {section.section}
          </span>
          {isFirstSection && (
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center p-1 rounded-md text-text-muted dark:text-text-muted-dark hover:bg-background dark:hover:bg-background-dark hover:text-text dark:hover:text-text-dark transition-colors"
              aria-label="Recolher menu"
              title="Recolher menu"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
      {section.items.map((item) => {
        if (isGroupItem(item)) {
          return (
            <NavigationGroup
              key={item.name}
              item={item}
              isCollapsed={isCollapsed}
              isOpen={openMenu === item.name}
              onToggle={() => onMenuToggle(item.name)}
            />
          );
        }
        return <NavigationItem key={item.name} item={item} isCollapsed={isCollapsed} />;
      })}
    </div>
  );
}
