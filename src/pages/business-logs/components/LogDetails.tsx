import { BusinessLog } from '@/services/businessLogService';

interface LogDetailsProps {
  readonly log: BusinessLog;
}

function renderData(data: unknown, label: string) {
  if (!data) return null;

  return (
    <div className="mt-2">
      <h4 className="text-sm font-semibold text-text dark:text-text-dark mb-2">{label}:</h4>
      <pre className="bg-background dark:bg-background-dark p-3 rounded-md text-xs overflow-auto max-h-64 border border-border dark:border-border-dark dark:text-gray-200">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export function LogDetails({ log }: LogDetailsProps) {
  return (
    <div className="mt-4 pt-4 border-t border-border dark:border-border-dark space-y-4">
      {log.metadata && (
        <div>
          <h4 className="text-sm font-semibold text-text dark:text-text-dark mb-2">Metadados:</h4>
          <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
            {log.metadata.ip && <p>IP: {log.metadata.ip}</p>}
            {log.metadata.userAgent && <p>User Agent: {log.metadata.userAgent}</p>}
          </div>
        </div>
      )}

      {log.operation === 'update' && log.changes && (
        <div>
          <h4 className="text-sm font-semibold text-text dark:text-text-dark mb-2">Mudanças:</h4>
          <pre className="bg-background dark:bg-background-dark p-3 rounded-md text-xs overflow-auto max-h-64 border border-border dark:border-border-dark dark:text-gray-200">
            {JSON.stringify(log.changes, null, 2)}
          </pre>
        </div>
      )}

      {renderData(log.dataBefore, 'Dados Antes')}
      {renderData(log.dataAfter, 'Dados Depois')}
    </div>
  );
}
