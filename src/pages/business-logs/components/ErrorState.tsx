import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark">
      <div className="p-12 text-center">
        <p className="text-red-500 dark:text-red-400">{error}</p>
        <Button onClick={onRetry} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    </Card>
  );
}

