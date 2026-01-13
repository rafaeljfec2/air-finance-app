import { NavigationSection } from '@/types/navigation';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Finds the parent menu of the active route
 */
function findActiveMenuParent(
  navigation: NavigationSection[],
  currentPath: string,
): string | null {
  for (const group of navigation) {
    for (const item of group.items) {
      if ('children' in item && item.children) {
        const isAnyChildActive = item.children.some((child) => currentPath === child.href);
        if (isAnyChildActive) {
          return item.name;
        }
      }
    }
  }
  return null;
}

/**
 * Hook to manage open menu state
 */
export function useOpenMenu(navigation: NavigationSection[]) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(() =>
    findActiveMenuParent(navigation, location.pathname),
  );

  const toggleMenu = (itemName: string) => {
    setOpenMenu((current) => (current === itemName ? null : itemName));
  };

  return {
    openMenu,
    toggleMenu,
  };
}
