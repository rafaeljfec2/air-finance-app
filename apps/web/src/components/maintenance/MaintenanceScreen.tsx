import { Wrench, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MaintenanceScreenProps {
  readonly onRetry?: () => void;
  readonly isRetrying?: boolean;
  readonly scheduledEnd?: string;
}

export function MaintenanceScreen({
  onRetry,
  isRetrying = false,
  scheduledEnd,
}: MaintenanceScreenProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background dark:bg-background-dark">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-primary-500/10 dark:bg-primary-400/10 flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Wrench className="w-12 h-12 text-primary-500 dark:text-primary-400" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">!</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-text dark:text-text-dark mb-3">
            Sistema em Manutenção
          </h1>

          <p className="text-gray-600 dark:text-gray-400 mb-2">
            Estamos realizando uma manutenção programada para melhorar sua experiência.
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-500">
            Por favor, aguarde alguns instantes e tente novamente.
          </p>

          {scheduledEnd && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Previsão de retorno: <strong>{scheduledEnd}</strong>
              </p>
            </div>
          )}
        </div>

        {onRetry && (
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            className="bg-primary-500 hover:bg-primary-600 text-white px-8"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </>
            )}
          </Button>
        )}

        <div className="mt-8 pt-6 border-t border-border dark:border-border-dark">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Se o problema persistir, entre em contato com o suporte.
          </p>
        </div>
      </div>
    </div>
  );
}
