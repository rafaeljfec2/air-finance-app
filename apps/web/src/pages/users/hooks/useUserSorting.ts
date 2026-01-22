import { useCallback } from 'react';
import { useSortable } from '@/hooks/useSortable';
import { User } from '@/services/userService';

export function useUserSorting() {
  const { sortConfig, handleSort, sortData } = useSortable<
    'name' | 'email' | 'role' | 'status' | 'plan' | 'createdAt' | 'emailVerified' | 'onboardingCompleted'
  >({
    initialField: 'createdAt',
    initialDirection: 'desc',
  });

  const sortUsers = useCallback(
    (users: User[]): User[] => {
      // If no sort config, apply default sort by createdAt desc
      if (!sortConfig) {
        return [...users].sort((a, b) => {
          const aDate = new Date(a.createdAt).getTime();
          const bDate = new Date(b.createdAt).getTime();
          return bDate - aDate; // Descending order (newest first)
        });
      }

      return sortData(users as unknown as Record<string, unknown>[], (item, field) => {
        const user = item as unknown as User;
        switch (field) {
          case 'name':
            return user.name;
          case 'email':
            return user.email;
          case 'role':
            return user.role;
          case 'status':
            return user.status;
          case 'plan':
            return user.plan;
          case 'createdAt':
            return new Date(user.createdAt);
          case 'emailVerified':
            return user.emailVerified === true ? 1 : user.emailVerified === false ? 0 : -1;
          case 'onboardingCompleted':
            return user.onboardingCompleted === true ? 1 : user.onboardingCompleted === false ? 0 : -1;
          default:
            return (user as unknown as Record<string, unknown>)[field];
        }
      }) as unknown as User[];
    },
    [sortConfig, sortData],
  );

  return {
    sortConfig,
    handleSort,
    sortUsers,
  };
}
