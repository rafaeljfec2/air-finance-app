import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ComboBox } from '@/components/ui/ComboBox';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/input';
import { ViewDefault } from '@/layouts/ViewDefault';
import { cn } from '@/lib/utils';
import { BusinessLog, BusinessLogFilters, getBusinessLogs } from '@/services/businessLogService';
import { useCompanyStore } from '@/stores/company';
import { formatDateToLocalISO } from '@/utils/date';
import { ChevronDown, ChevronUp, FileText, History, Search, User } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

const operationLabels: Record<string, string> = {
  create: 'Criação',
  update: 'Edição',
  delete: 'Exclusão',
};

const operationColors: Record<string, string> = {
  create: 'bg-green-500/20 text-green-400 border-green-500/30',
  update: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  delete: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const entityTypeLabels: Record<string, string> = {
  Account: 'Conta',
  Transaction: 'Transação',
  Company: 'Empresa',
  Category: 'Categoria',
};

export function BusinessLogsPage() {
  const { activeCompany } = useCompanyStore();
  const [logs, setLogs] = useState<BusinessLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 50, totalPages: 1 });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEntityType, setFilterEntityType] = useState<string>('all');
  const [filterOperation, setFilterOperation] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>(
    formatDateToLocalISO(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
  );
  const [endDate, setEndDate] = useState<string>(formatDateToLocalISO(new Date()));
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  const loadLogs = useCallback(async () => {
    if (!activeCompany?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const filters: BusinessLogFilters = {
        entityType: filterEntityType === 'all' ? undefined : filterEntityType,
        operation:
          filterOperation === 'all'
            ? undefined
            : (filterOperation as 'create' | 'update' | 'delete'),
        startDate,
        endDate,
        page: currentPage,
        limit: 50,
      };

      const response = await getBusinessLogs(activeCompany.id, filters);
      setLogs(response.data);
      setMeta(response.meta);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar logs';
      setError(errorMessage);
      console.error('Error loading business logs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeCompany?.id, filterEntityType, filterOperation, startDate, endDate, currentPage]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const toggleExpand = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  const filteredLogs = useMemo(() => {
    if (!searchTerm) return logs;

    const term = searchTerm.toLowerCase();
    return logs.filter(
      (log) =>
        log.userEmail.toLowerCase().includes(term) ||
        log.entityId.toLowerCase().includes(term) ||
        entityTypeLabels[log.entityType]?.toLowerCase().includes(term) ||
        operationLabels[log.operation]?.toLowerCase().includes(term),
    );
  }, [logs, searchTerm]);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const renderData = (data: unknown, label: string) => {
    if (!data) return null;

    return (
      <div className="mt-2">
        <h4 className="text-sm font-semibold text-text dark:text-text-dark mb-2">{label}:</h4>
        <pre className="bg-background dark:bg-background-dark p-3 rounded-md text-xs overflow-auto max-h-64 border border-border dark:border-border-dark">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    );
  };

  const renderErrorContent = () => (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
      <div className="p-12 text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <Button onClick={loadLogs} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    </Card>
  );

  const renderEmptyContent = () => (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
      <div className="p-12 text-center">
        <History className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
          Nenhum log encontrado
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Não há registros para os filtros selecionados
        </p>
      </div>
    </Card>
  );

  const renderLogsContent = () => {
    if (isLoading) {
      return <Loading />;
    }

    if (error) {
      return renderErrorContent();
    }

    if (filteredLogs.length === 0) {
      return renderEmptyContent();
    }

    return (
      <>
        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const isExpanded = expandedLogs.has(log.id);
            return (
              <Card
                key={log.id}
                className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm hover:border-primary-500/50 transition-colors"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={cn(
                            'px-2 py-1 rounded-md text-xs font-medium border',
                            operationColors[log.operation],
                          )}
                        >
                          {operationLabels[log.operation]}
                        </span>
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                          {entityTypeLabels[log.entityType] || log.entityType}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(log.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>{log.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span className="font-mono text-xs">{log.entityId.slice(0, 8)}...</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(log.id)}
                      className="text-gray-500 dark:text-gray-400"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </Button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border dark:border-border-dark space-y-4">
                      {log.metadata && (
                        <div>
                          <h4 className="text-sm font-semibold text-text dark:text-text-dark mb-2">
                            Metadados:
                          </h4>
                          <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
                            {log.metadata.ip && <p>IP: {log.metadata.ip}</p>}
                            {log.metadata.userAgent && <p>User Agent: {log.metadata.userAgent}</p>}
                          </div>
                        </div>
                      )}

                      {log.operation === 'update' && log.changes && (
                        <div>
                          <h4 className="text-sm font-semibold text-text dark:text-text-dark mb-2">
                            Mudanças:
                          </h4>
                          <pre className="bg-background dark:bg-background-dark p-3 rounded-md text-xs overflow-auto max-h-64 border border-border dark:border-border-dark">
                            {JSON.stringify(log.changes, null, 2)}
                          </pre>
                        </div>
                      )}

                      {renderData(log.dataBefore, 'Dados Antes')}
                      {renderData(log.dataAfter, 'Dados Depois')}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Paginação */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mostrando {filteredLogs.length} de {meta.total} registros
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <span className="flex items-center px-4 text-sm text-text dark:text-text-dark">
                Página {currentPage} de {meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                disabled={currentPage === meta.totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
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
        <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
          <div className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              <div className="grid grid-cols-2 gap-2 sm:col-span-2 lg:col-span-2">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">
                    Data Inicial
                  </span>
                  <DatePicker
                    value={startDate}
                    onChange={(date) => setStartDate(date ? formatDateToLocalISO(date) : '')}
                    placeholder="Data inicial"
                    className="bg-background dark:bg-background-dark"
                  />
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">
                    Data Final
                  </span>
                  <DatePicker
                    value={endDate}
                    onChange={(date) => setEndDate(date ? formatDateToLocalISO(date) : '')}
                    placeholder="Data final"
                    className="bg-background dark:bg-background-dark"
                  />
                </div>
              </div>

              <div className="relative">
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1.5 block">
                  Buscar
                </span>
                <Search className="absolute left-3 top-9 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Email, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark"
                />
              </div>

              <div>
                <ComboBox
                  options={[
                    { value: 'all', label: 'Todas as entidades' },
                    { value: 'Account', label: entityTypeLabels.Account },
                    { value: 'Transaction', label: entityTypeLabels.Transaction },
                    { value: 'Company', label: entityTypeLabels.Company },
                    { value: 'Category', label: entityTypeLabels.Category },
                  ]}
                  value={filterEntityType}
                  onValueChange={(value) => setFilterEntityType(value ?? 'all')}
                  placeholder="Todas as entidades"
                />
              </div>

              <div>
                <ComboBox
                  options={[
                    { value: 'all', label: 'Todas as operações' },
                    { value: 'create', label: operationLabels.create },
                    { value: 'update', label: operationLabels.update },
                    { value: 'delete', label: operationLabels.delete },
                  ]}
                  value={filterOperation}
                  onValueChange={(value) => setFilterOperation(value ?? 'all')}
                  placeholder="Todas as operações"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Lista de Logs */}
        {renderLogsContent()}
      </div>
    </ViewDefault>
  );
}
