import { navigation } from '@/constants/navigation';
import { useAuthStore } from '@/stores/auth';
import { NavigationGroupItem, NavigationItem, NavigationSection } from '@/types/navigation';
import { UserRole } from '@/types/user';

/**
 * Filters navigation items based on user roles
 */
function filterItemByRole(item: NavigationItem, userRole: UserRole | undefined): boolean {
  if (!item.roles) return true;
  return !!userRole && item.roles.includes(userRole);
}

/**
 * Filters navigation groups and items based on user roles
 */
export function useFilteredNavigation(): NavigationSection[] {
  const user = useAuthStore((state) => state.user);
  const userRole = user?.role;

  return navigation
    .map((group) => ({
      ...group,
      items: group.items
        .filter((item) => filterItemByRole(item, userRole))
        .map((item) => {
          if ('children' in item && item.children) {
            return {
              ...item,
              children: item.children.filter((child) => filterItemByRole(child, userRole)),
            } as NavigationGroupItem;
          }
          return item;
        })
        .filter((item) => {
          // Remove groups that became empty after filtering children
          if ('children' in item && item.children && item.children.length === 0) {
            return false;
          }
          return true;
        }),
    }))
    .filter((group) => group.items.length > 0);
}
