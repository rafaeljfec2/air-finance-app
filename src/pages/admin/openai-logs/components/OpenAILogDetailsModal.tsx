import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OpenAILog } from '@/services/openaiService';
import { Bot, X } from 'lucide-react';

interface OpenAILogDetailsModalProps {
  log: OpenAILog | null;
  onClose: () => void;
}

export function OpenAILogDetailsModal({
  log,
  onClose,
}: Readonly<OpenAILogDetailsModalProps>) {
  if (!log) return null;

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
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).format(date)
      : '-';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background dark:bg-card-dark rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border dark:border-border-dark flex justify-between items-center">
          <h2 className="text-xl font-bold text-text dark:text-text-dark flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary-500" />
            Detalhes do Log
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Status</label>
              <Badge variant={log.status === 'success' ? 'success' : 'destructive'}>
                {log.status}
              </Badge>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Data</label>
              <span className="text-sm font-mono">{formatDate(log)}</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Modelo</label>
              <span className="text-sm font-mono">{log.aiModel}</span>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <label className="text-xs font-medium text-gray-500 uppercase block mb-1">Latência</label>
              <span className="text-sm font-mono">{log.metadata?.latencyMs ?? '-'}ms</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-text dark:text-text-dark block mb-2">
              Input / Prompt
            </label>
            <div className="bg-muted dark:bg-black/30 p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap">{log.promptOrDescription}</pre>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-text dark:text-text-dark block mb-2">
              {log.status === 'success' ? 'Output / Response' : 'Error Message'}
            </label>
            <div
              className={`p-4 rounded-lg overflow-x-auto ${
                log.status === 'success'
                  ? 'bg-muted dark:bg-black/30'
                  : 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900'
              }`}
            >
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {log.response || log.errorMessage}
              </pre>
            </div>
          </div>

          {log.metadata && (
            <div>
              <label className="text-sm font-semibold text-text dark:text-text-dark block mb-2">
                Metadata Completo
              </label>
              <div className="bg-muted dark:bg-black/30 p-4 rounded-lg overflow-x-auto">
                <pre className="text-xs font-mono text-blue-600 dark:text-blue-400">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
