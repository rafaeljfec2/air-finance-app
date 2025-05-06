declare const __APP_VERSION__: string;
import { navigation } from '@/constants/natigation';
import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/stores/sidebar';
import { NavigationGroupItem, NavigationItem } from '@/types/navigation';
import {
  ArrowDownIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function isGroupItem(item: NavigationItem): item is NavigationGroupItem {
  return 'children' in item && Array.isArray(item.children);
}

export function Sidebar({ isOpen = false, onClose }: Readonly<SidebarProps>) {
  const location = useLocation();
  const { isCollapsed, toggleCollapse } = useSidebarStore();
  const [openMenu, setOpenMenu] = useState<string | null>(() => {
    // Encontra o menu pai do item ativo
    for (const group of navigation) {
      for (const item of group.items) {
        if ('children' in item && item.children) {
          const isAnyChildActive = item.children.some((child) => location.pathname === child.href);
          if (isAnyChildActive) {
            return item.name;
          }
        }
      }
    }
    return null;
  });

  const handleMenuClick = (itemName: string) => {
    // Se o menu clicado já está aberto, fecha ele
    if (openMenu === itemName) {
      setOpenMenu(null);
      return;
    }
    // Se clicou em outro menu, fecha o anterior e abre o novo
    setOpenMenu(itemName);
  };

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity lg:hidden',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Sidebar */}
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
        {/* Close button mobile */}
        <button
          className="absolute top-4 right-4 lg:hidden p-2 rounded-md text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="flex flex-col h-full pt-2">
          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
            {navigation.map((group, idx) => (
              <div key={group.section} className={cn('mb-2', idx !== 0 && 'mt-6')}>
                {!isCollapsed && (
                  <div className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase mb-1 pl-2">
                    {group.section}
                  </div>
                )}
                {group.items.map((item) => {
                  if (isGroupItem(item)) {
                    const isOpen = openMenu === item.name;
                    const isAnyChildActive = item.children.some(
                      (child) => location.pathname === child.href,
                    );
                    return (
                      <div key={item.name}>
                        <button
                          onClick={() => handleMenuClick(item.name)}
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
                              <ArrowDownIcon
                                className={cn(
                                  'h-4 w-4 ml-auto transition-transform',
                                  isOpen ? 'rotate-180' : '',
                                )}
                              />
                            </>
                          )}
                        </button>
                        {/* Submenu */}
                        {!isCollapsed && (
                          <div
                            className={cn(
                              'ml-8 mt-1 space-y-1 overflow-hidden transition-all duration-300 ease-in-out',
                              isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
                            )}
                          >
                            <div className="py-1">
                              {item.children.map((child) => {
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
                        )}
                      </div>
                    );
                  } else {
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
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
                })}
              </div>
            ))}
          </nav>
          {/* Footer com versão do sistema */}
          <div className="w-full py-2 border-t border-border dark:border-border-dark text-center text-xs text-gray-500 dark:text-gray-400 select-none">
            v{__APP_VERSION__}
          </div>
          {/* Toggle button */}
          <div className="p-4 border-t border-border dark:border-border-dark">
            <button
              onClick={toggleCollapse}
              className={cn(
                'flex items-center justify-center w-full p-2 text-sm font-medium rounded-md',
                'text-text dark:text-text-dark hover:bg-background dark:hover:bg-background-dark',
                'transition-colors duration-200',
              )}
            >
              {isCollapsed ? (
                <ChevronDoubleRightIcon className="h-5 w-5" />
              ) : (
                <>
                  <ChevronDoubleLeftIcon className="h-5 w-5" />
                  <span className="ml-2">Recolher</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
