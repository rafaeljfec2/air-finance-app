import type { StatementSchedule } from '@/services/bankingIntegrationService';
import { getScheduleDescription } from '../utils/scheduleUtils';

interface StatementScheduleStatusProps {
  schedule: StatementSchedule | null;
}

export function StatementScheduleStatus({
  schedule,
}: Readonly<StatementScheduleStatusProps>) {
  if (!schedule) return null;

  const description = schedule.enabled ? getScheduleDescription(schedule.cronExpression) : null;

  if (!description && !schedule.lastSyncAt) return null;

  return (
    <div className="space-y-3">
      {description && (
        <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
      )}

      {schedule.lastSyncAt && (
        <div className="text-xs text-gray-500 dark:text-gray-500">
          Última sincronização:{' '}
          {new Date(schedule.lastSyncAt).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )}
    </div>
  );
}
