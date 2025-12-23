import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BusinessLog } from '@/services/businessLogService';
import { ChevronDown, ChevronUp, FileText, User } from 'lucide-react';
import { entityTypeLabels, operationColors, operationLabels } from '../constants';
import { formatDateTime } from '../utils';
import { LogDetails } from './LogDetails';

interface LogCardProps {
  log: BusinessLog;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function LogCard({ log, isExpanded, onToggleExpand }: LogCardProps) {
  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm hover:border-primary-500/50 transition-colors">
      <div className="p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-4">
          <div className="flex-1 space-y-2 min-w-0">
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
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {formatDateTime(log.timestamp)}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400 dark:text-gray-500">
              <div className="flex items-center gap-1 min-w-0">
                <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{log.userEmail}</span>
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="font-mono text-xs truncate">{log.entityId.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="text-gray-500 dark:text-gray-400 flex-shrink-0"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5" /> : <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
        </div>

        {isExpanded && <LogDetails log={log} />}
      </div>
    </Card>
  );
}

