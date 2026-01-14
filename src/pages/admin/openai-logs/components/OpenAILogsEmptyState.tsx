import { Card } from '@/components/ui/card';
import { Bot } from 'lucide-react';

interface OpenAILogsEmptyStateProps {
  hasFilters: boolean;
}

export function OpenAILogsEmptyState({
  hasFilters,
}: Readonly<OpenAILogsEmptyStateProps>) {
  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
      <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
        <Bot className="h-10 w-10 opacity-20" />
        <p>{hasFilters ? 'Nenhum log encontrado com os filtros aplicados.' : 'Nenhum log encontrado.'}</p>
      </div>
    </Card>
  );
}
