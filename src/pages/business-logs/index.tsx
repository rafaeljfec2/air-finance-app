import { Loading } from '@/components/Loading';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import { formatDateToLocalISO } from '@/utils/date';
import { History } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { FilterCard } from './components/FilterCard';
import { LogCard } from './components/LogCard';
import { Pagination } from './components/Pagination';
import { useBusinessLogs } from './hooks/useBusinessLogs';
import { filterLogsBySearchTerm } from './utils';

export function BusinessLogsPage() {
  const { activeCompany } = useCompanyStore();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntityType, setFilterEntityType] = useState<string>('all');
  const [filterOperation, setFilterOperation] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>(
    formatDateToLocalISO(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
  );
  const [endDate, setEndDate] = useState<string>(formatDateToLocalISO(new Date()));
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  // Fetch logs
  const { logs, meta, isLoading, error, loadLogs } = useBusinessLogs({
    companyId: activeCompany?.id,
    filters: {
      entityType: filterEntityType,
      operation: filterOperation,
      startDate,
      endDate,
      currentPage,
    },
  });

  // Filter logs by search term
  const filteredLogs = useMemo(() => filterLogsBySearchTerm(logs, searchTerm), [logs, searchTerm]);

  // Handlers
  const toggleExpand = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const handlePreviousPage = () => {
    setCurrentPage((p) => Math.max(1, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(meta.totalPages, p + 1));
  };

  const renderLogsContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return <ErrorState error={error} onRetry={loadLogs} />;
    }

    if (filteredLogs.length === 0) {
      return <EmptyState />;
    }

    return (
      <>
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <LogCard
              key={log.id}
              log={log}
              isExpanded={expandedLogs.has(log.id)}
              onToggleExpand={() => toggleExpand(log.id)}
            />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          filteredItems={filteredLogs.length}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
        />
      </>
    );
  };

  if (!activeCompany) {
    return (
      <ViewDefault>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">
            Selecione uma empresa para visualizar os logs
          </p>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <History className="h-8 w-8 text-primary-400" />
              <h1 className="text-2xl font-bold text-text dark:text-text-dark">
                Histórico de Operações
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Registro de todas as operações realizadas no sistema
            </p>
          </div>
        </div>

        {/* Filtros */}
        <FilterCard
          startDate={startDate}
          endDate={endDate}
          searchTerm={searchTerm}
          filterEntityType={filterEntityType}
          filterOperation={filterOperation}
          onStartDateChange={(date: Date | undefined) =>
            setStartDate(date ? formatDateToLocalISO(date) : '')
          }
          onEndDateChange={(date: Date | undefined) =>
            setEndDate(date ? formatDateToLocalISO(date) : '')
          }
          onSearchTermChange={setSearchTerm}
          onEntityTypeChange={setFilterEntityType}
          onOperationChange={setFilterOperation}
          onSearch={loadLogs}
        />

        {/* Lista de Logs */}
        {renderLogsContent()}
      </div>
    </ViewDefault>
  );
}
