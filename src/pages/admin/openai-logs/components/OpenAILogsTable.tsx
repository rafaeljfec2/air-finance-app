import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SortableColumn } from '@/components/ui/SortableColumn';
import { SortConfig } from '@/components/ui/SortableColumn';
import { OpenAILog } from '@/services/openaiService';
import { Eye, Terminal } from 'lucide-react';

interface OpenAILogsTableProps {
  logs: OpenAILog[];
  sortConfig: SortConfig<'status' | 'createdAt' | 'aiModel' | 'promptOrDescription'> | null;
  onSort: (field: 'status' | 'createdAt' | 'aiModel' | 'promptOrDescription') => void;
  onViewDetails: (log: OpenAILog) => void;
}

export function OpenAILogsTable({
  logs,
  sortConfig,
  onSort,
  onViewDetails,
}: Readonly<OpenAILogsTableProps>) {
  const formatDate = (log: OpenAILog): string => {
    let date: Date | null = null;

    if (log.createdAt && typeof log.createdAt !== 'object') {
      const parsed = new Date(log.createdAt);
      if (!isNaN(parsed.getTime())) {
        date = parsed;
      }
    }

    if (!date) {
      const idToUse = log._id || (log as unknown as { id?: string }).id;
      if (idToUse && typeof idToUse === 'string') {
        try {
          const timestamp = parseInt(idToUse.substring(0, 8), 16) * 1000;
          if (!isNaN(timestamp)) {
            date = new Date(timestamp);
          }
        } catch {
          // ignore
        }
      }
    }

    return date
      ? new Intl.DateTimeFormat('pt-BR', {
          timeZone: 'America/Sao_Paulo',
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(date)
      : '-';
  };

  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border dark:border-border-dark">
              <SortableColumn field="status" currentSort={sortConfig} onSort={onSort}>
                Status
              </SortableColumn>
              <SortableColumn field="createdAt" currentSort={sortConfig} onSort={onSort}>
                Data
              </SortableColumn>
              <SortableColumn field="aiModel" currentSort={sortConfig} onSort={onSort}>
                Modelo
              </SortableColumn>
              <SortableColumn
                field="promptOrDescription"
                currentSort={sortConfig}
                onSort={onSort}
              >
                Input
              </SortableColumn>
              <th className="text-left p-3 text-sm font-semibold text-text dark:text-text-dark whitespace-nowrap">
                Output
              </th>
              <th className="text-left p-3 text-sm font-semibold text-text dark:text-text-dark whitespace-nowrap">
                Meta
              </th>
              <th className="text-right p-3 text-sm font-semibold text-text dark:text-text-dark whitespace-nowrap">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log._id}
                className="border-b border-border dark:border-border-dark hover:bg-muted/30 transition-colors"
              >
                <td className="p-4 align-top">
                  <Badge variant={log.status === 'success' ? 'success' : 'destructive'}>
                    {log.status || 'Unknown'}
                  </Badge>
                </td>
                <td className="p-4 align-top text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">
                  {formatDate(log)}
                </td>
                <td className="p-4 align-top text-sm font-mono text-gray-600 dark:text-gray-300">
                  {log.aiModel || '-'}
                </td>
                <td
                  className="p-4 align-top text-sm text-gray-600 dark:text-gray-300 min-w-[200px] max-w-xs truncate"
                  title={log.promptOrDescription}
                >
                  {log.promptOrDescription || '-'}
                </td>
                <td
                  className="p-4 align-top text-sm font-mono text-gray-600 dark:text-gray-300 min-w-[200px] max-w-xs truncate"
                  title={log.response || log.errorMessage}
                >
                  {log.response || log.errorMessage || '-'}
                </td>
                <td className="p-4 align-top text-sm text-gray-600 dark:text-gray-300">
                  {log.metadata && (
                    <div
                      className="flex items-center gap-1"
                      title={JSON.stringify(log.metadata, null, 2)}
                    >
                      <Terminal className="h-4 w-4" />
                      {log.metadata.latencyMs ? (
                        <span>{log.metadata.latencyMs}ms</span>
                      ) : (
                        <span>Info</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="p-4 align-top text-right">
                  <Button variant="ghost" size="sm" onClick={() => onViewDetails(log)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
