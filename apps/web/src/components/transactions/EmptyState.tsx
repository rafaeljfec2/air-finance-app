import { Receipt } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  description?: string;
  variant?: 'table' | 'mobile';
  colSpan?: number;
}

export function EmptyState({
  message = 'Nenhuma transação encontrada',
  description = 'Tente ajustar os filtros ou busque por outro termo.',
  variant = 'table',
  colSpan,
}: Readonly<EmptyStateProps>) {
  if (variant === 'table') {
    return (
      <tr>
        <td colSpan={colSpan ?? 7} className="py-8 text-center">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 bg-muted/50 rounded-full">
              <Receipt className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-sm font-medium text-text dark:text-text-dark">{message}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="flex flex-col h-full items-center justify-center py-12 px-4 gap-3 text-center bg-muted/10 rounded-lg border border-border/50 border-dashed">
      <div className="p-3 bg-muted/50 rounded-full">
        <Receipt className="h-6 w-6 text-muted-foreground/50" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium text-text dark:text-text-dark">{message}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
