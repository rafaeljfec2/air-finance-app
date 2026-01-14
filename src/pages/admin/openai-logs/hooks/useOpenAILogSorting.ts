import { useSortable } from '@/hooks/useSortable';
import { OpenAILog } from '@/services/openaiService';

export function useOpenAILogSorting() {
  const { sortConfig, handleSort, sortData } = useSortable<
    'status' | 'createdAt' | 'aiModel' | 'promptOrDescription'
  >();

  const sortLogs = (logs: OpenAILog[]): OpenAILog[] => {
    return sortData(logs as unknown as Record<string, unknown>[], (item, field) => {
      const log = item as unknown as OpenAILog;
      switch (field) {
        case 'status':
          return log.status;
        case 'createdAt': {
          // Try to parse createdAt or extract from _id
          let date: Date | null = null;
          if (log.createdAt && typeof log.createdAt !== 'object') {
            const parsed = new Date(log.createdAt);
            if (!Number.isNaN(parsed.getTime())) {
              date = parsed;
            }
          }
          if (!date && log._id) {
            try {
              const timestamp = Number.parseInt(log._id.substring(0, 8), 16) * 1000;
              if (!Number.isNaN(timestamp)) {
                date = new Date(timestamp);
              }
            } catch {
              // ignore
            }
          }
          return date ?? new Date(0);
        }
        case 'aiModel':
          return log.aiModel;
        case 'promptOrDescription':
          return log.promptOrDescription;
        default:
          return (log as unknown as Record<string, unknown>)[field];
      }
    }) as unknown as OpenAILog[];
  };

  return {
    sortConfig,
    handleSort,
    sortLogs,
  };
}
