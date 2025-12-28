import { Loader2 } from 'lucide-react';

/**
 * SuspenseLoader Component
 *
 * Loading component used as fallback for React Suspense boundaries
 */
export function SuspenseLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    </div>
  );
}
