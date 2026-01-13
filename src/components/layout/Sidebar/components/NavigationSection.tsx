import {
  NavigationSection as NavigationSectionType,
  NavigationItem as NavigationItemType,
  NavigationGroupItem,
} from '@/types/navigation';
import { NavigationGroup } from './NavigationGroup';
import { NavigationItem } from './NavigationItem';
import { cn } from '@/lib/utils';

interface NavigationSectionProps {
  section: NavigationSectionType;
  index: number;
  isCollapsed: boolean;
  openMenu: string | null;
  onMenuToggle: (itemName: string) => void;
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
  return (
    <div key={section.section} className={cn('mb-2', index !== 0 && 'mt-6')}>
      {!isCollapsed && (
        <div className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase mb-1 pl-2">
          {section.section}
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
