import { useMemo, useState } from 'react';
import { User } from '@/services/userService';
import { useViewMode } from '@/hooks/useViewMode';

/**
 * Hook to manage user filtering and search
 */
export const useUserFilters = (users: User[] | undefined) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useViewMode('users-view-mode');

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === 'all' || user.role === filterRole;
      const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, filterRole, filterStatus]);

  const hasActiveFilters = searchTerm !== '' || filterRole !== 'all' || filterStatus !== 'all';

  return {
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    filterStatus,
    setFilterStatus,
    viewMode,
    setViewMode,
    filteredUsers,
    hasActiveFilters,
  };
};
