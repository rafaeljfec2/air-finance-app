import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  readonly message: string;
  readonly subMessage?: string;
}

export function LoadingState({ message, subMessage }: Readonly<LoadingStateProps>) {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-3">
      <Loader2 className="h-8 w-8 animate-spin text-purple-600 dark:text-purple-400" />
      <p className="text-sm font-medium text-text dark:text-text-dark">{message}</p>
      {subMessage && (
        <p className="text-xs text-muted-foreground dark:text-gray-400">{subMessage}</p>
      )}
    </div>
  );
}
