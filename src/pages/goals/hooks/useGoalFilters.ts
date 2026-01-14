import { useMemo, useState } from 'react';
import { Goal } from '@/services/goalService';

export function useGoalFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filterGoals = useMemo(
    () => (goals: Goal[]) => {
      return goals.filter((goal) => {
        const matchesSearch =
          goal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
        return matchesSearch && matchesStatus;
      });
    },
    [searchTerm, filterStatus],
  );

  const hasActiveFilters = useMemo(
    () => searchTerm !== '' || filterStatus !== 'all',
    [searchTerm, filterStatus],
  );

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    filterGoals,
    hasActiveFilters,
  };
}
