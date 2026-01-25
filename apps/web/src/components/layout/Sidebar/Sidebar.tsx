import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar';
import { useFilteredNavigation } from './hooks/useFilteredNavigation';
import { useOpenMenu } from './hooks/useOpenMenu';
import { SidebarOverlay } from './components/SidebarOverlay';
import { SidebarHeader } from './components/SidebarHeader';
import { NavigationSection } from './components/NavigationSection';
import { SidebarFooter } from './components/SidebarFooter';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isHeaderVisible?: boolean;
}

export function Sidebar({
  isOpen = false,
  onClose,
  isHeaderVisible = true,
}: Readonly<SidebarProps>) {
  const { isCollapsed } = useSidebarStore();
  const filteredNavigation = useFilteredNavigation();
  const { openMenu, toggleMenu } = useOpenMenu(filteredNavigation);

  return (
    <>
      <SidebarOverlay isOpen={isOpen} onClose={onClose ?? (() => {})} />
      <div
        className={cn(
          'fixed z-50 left-0 h-full bg-card dark:bg-card-dark border-r border-border dark:border-border-dark',
          'transition-all duration-300 ease-in-out transform',
          // Mobile: respect safe areas top and bottom
          'inset-safe-y lg:inset-y-0',
          isCollapsed ? 'w-16' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:static lg:translate-x-0 lg:z-0',
        )}
        aria-label="Menu lateral"
      >
        <div className="flex flex-col h-full overflow-hidden">
        <SidebarHeader onClose={onClose} isHeaderVisible={isHeaderVisible} />
        <nav className="flex-1 min-h-0 space-y-1 px-2 py-4 overflow-y-auto pb-24 lg:pb-4 sidebar-scroll">
          {filteredNavigation.map((group, idx) => (
            <NavigationSection
              key={group.section}
              section={group}
              index={idx}
              isCollapsed={isCollapsed}
              openMenu={openMenu}
              onMenuToggle={toggleMenu}
            />
          ))}
        </nav>
        <div className="flex-shrink-0 lg:pb-0 pb-20">
          <SidebarFooter />
        </div>
      </div>
      </div>
    </>
  );
}
