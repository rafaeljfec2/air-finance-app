import { useMemo, useState } from 'react';
import { OpenAILog } from '@/services/openaiService';

export function useOpenAILogFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error'>('all');

  const filterLogs = useMemo(
    () => (logs: OpenAILog[]) => {
      return logs.filter((log) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          log.aiModel.toLowerCase().includes(searchLower) ||
          log.promptOrDescription.toLowerCase().includes(searchLower) ||
          (log.response && log.response.toLowerCase().includes(searchLower)) ||
          (log.errorMessage && log.errorMessage.toLowerCase().includes(searchLower));

        const matchesStatus = statusFilter === 'all' || log.status === statusFilter;

        return matchesSearch && matchesStatus;
      });
    },
    [searchTerm, statusFilter],
  );

  const hasActiveFilters = useMemo(
    () => searchTerm !== '' || statusFilter !== 'all',
    [searchTerm, statusFilter],
  );

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filterLogs,
    hasActiveFilters,
  };
}
