import { BusinessLog, BusinessLogFilters, getBusinessLogs } from '@/services/businessLogService';
import { useCallback, useEffect, useState } from 'react';

interface UseBusinessLogsParams {
  companyId: string | undefined;
  filters: {
    entityType: string;
    operation: string;
    entityId?: string;
    startDate: string;
    endDate: string;
    currentPage: number;
  };
}

interface UseBusinessLogsReturn {
  logs: BusinessLog[];
  meta: { total: number; page: number; limit: number; totalPages: number };
  isLoading: boolean;
  error: string | null;
  loadLogs: () => Promise<void>;
}

export function useBusinessLogs({
  companyId,
  filters,
}: UseBusinessLogsParams): UseBusinessLogsReturn {
  const [logs, setLogs] = useState<BusinessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 50, totalPages: 1 });

  const loadLogs = useCallback(async () => {
    if (!companyId) return;

    setIsLoading(true);
    setError(null);

    try {
      const apiFilters: BusinessLogFilters = {
        entityType: filters.entityType === 'all' ? undefined : filters.entityType,
        entityId: filters.entityId,
        operation:
          filters.operation === 'all'
            ? undefined
            : (filters.operation as 'create' | 'update' | 'delete'),
        startDate: filters.startDate,
        endDate: filters.endDate,
        page: filters.currentPage,
        limit: 50,
      };

      const response = await getBusinessLogs(companyId, apiFilters);
      setLogs(response.data);
      setMeta(response.meta);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar logs';
      setError(errorMessage);
      console.error('Error loading business logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [companyId, filters.entityType, filters.operation, filters.entityId, filters.startDate, filters.endDate, filters.currentPage]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return { logs, meta, isLoading, error, loadLogs };
}

