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
            onClick={onToggleExpand}
            className="text-gray-500 dark:text-gray-400"
          >
            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>

        {isExpanded && <LogDetails log={log} />}
      </div>
    </Card>
  );
}

