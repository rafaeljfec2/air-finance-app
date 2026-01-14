import { Spinner } from '@/components/ui/spinner';
import { ViewDefault } from '@/layouts/ViewDefault';
import { OpenAILog, openaiService } from '@/services/openaiService';
import { useEffect, useMemo, useState } from 'react';
import { OpenAILogDetailsModal } from './components/OpenAILogDetailsModal';
import { OpenAILogsEmptyState } from './components/OpenAILogsEmptyState';
import { OpenAILogsErrorState } from './components/OpenAILogsErrorState';
import { OpenAILogsFilters } from './components/OpenAILogsFilters';
import { OpenAILogsHeader } from './components/OpenAILogsHeader';
import { OpenAILogsTable } from './components/OpenAILogsTable';
import { useOpenAILogFilters } from './hooks/useOpenAILogFilters';
import { useOpenAILogSorting } from './hooks/useOpenAILogSorting';

export function OpenAILogsPage() {
  const [logs, setLogs] = useState<OpenAILog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedLog, setSelectedLog] = useState<OpenAILog | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    filterLogs,
    hasActiveFilters,
  } = useOpenAILogFilters();

  const { sortConfig, handleSort, sortLogs } = useOpenAILogSorting();

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await openaiService.getLogs();
        console.log('OpenAI Logs Response:', JSON.stringify(data, null, 2));
        setLogs(data);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Erro desconhecido');
        setError(error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredAndSortedLogs = useMemo(() => {
    const filtered = filterLogs(logs);
    return sortLogs(filtered);
  }, [logs, filterLogs, sortLogs]);

  if (error) {
    return <OpenAILogsErrorState error={error} />;
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <OpenAILogsHeader />

          <OpenAILogsFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner className="text-primary-500" />
            </div>
          ) : filteredAndSortedLogs.length === 0 ? (
            <OpenAILogsEmptyState hasFilters={hasActiveFilters} />
          ) : (
            <OpenAILogsTable
              logs={filteredAndSortedLogs}
              sortConfig={sortConfig}
              onSort={handleSort}
              onViewDetails={setSelectedLog}
            />
          )}
        </div>
      </div>

      <OpenAILogDetailsModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </ViewDefault>
  );
}
