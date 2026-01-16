import { useSortable } from '@/hooks/useSortable';
import { User } from '@/services/userService';

export function useUserSorting() {
  const { sortConfig, handleSort, sortData } = useSortable<
    'name' | 'email' | 'role' | 'status' | 'plan' | 'createdAt'
  >();

  const sortUsers = (users: User[]): User[] => {
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
        default:
          return (user as unknown as Record<string, unknown>)[field];
      }
    }) as unknown as User[];
  };

  return {
    sortConfig,
    handleSort,
    sortUsers,
  };
}
