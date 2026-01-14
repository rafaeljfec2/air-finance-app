import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecordCardProps {
  children: ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
  className?: string;
  showActions?: boolean;
}

export function RecordCard({
  children,
  onEdit,
  onDelete,
  isUpdating = false,
  isDeleting = false,
  className,
  showActions = true,
}: Readonly<RecordCardProps>) {
  return (
    <Card
      className={cn(
        'bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm hover:shadow-lg transition-shadow',
        className,
      )}
    >
      <div className="p-3">
        {children}
        {showActions && (onEdit || onDelete) && (
          <div className="flex gap-1.5 pt-2 mt-2 border-t border-border dark:border-border-dark">
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={onEdit}
                disabled={isUpdating || isDeleting}
                className="flex-1 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark text-[10px] py-1 h-auto px-2"
              >
                <Edit className="h-3 w-3 mr-1" />
                Editar
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={onDelete}
                disabled={isUpdating || isDeleting}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50 px-2 py-1 h-auto"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
