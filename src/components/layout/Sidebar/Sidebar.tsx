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
}

export function Sidebar({ isOpen = false, onClose }: Readonly<SidebarProps>) {
  const { isCollapsed } = useSidebarStore();
  const filteredNavigation = useFilteredNavigation();
  const { openMenu, toggleMenu } = useOpenMenu(filteredNavigation);

  return (
    <>
      <SidebarOverlay isOpen={isOpen} onClose={onClose ?? (() => {})} />
      <div
        className={cn(
          'fixed z-50 inset-y-0 left-0 h-full bg-card dark:bg-card-dark border-r border-border dark:border-border-dark',
          'transition-all duration-300 ease-in-out transform',
          isCollapsed ? 'w-16' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:static lg:translate-x-0 lg:z-0',
        )}
        aria-label="Menu lateral"
      >
        {onClose && <SidebarHeader onClose={onClose} />}
        <div className="flex flex-col h-full pt-2">
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
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
          <SidebarFooter />
        </div>
      </div>
    </>
  );
}
