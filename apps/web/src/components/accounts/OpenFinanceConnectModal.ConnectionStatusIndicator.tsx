import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Wifi, WifiOff } from 'lucide-react';

export interface ConnectionStatusIndicatorProps {
  readonly status:
    | 'connecting'
    | 'connected'
    | 'error'
    | 'reconnecting'
    | 'disconnected'
    | 'closed';
  readonly message?: string;
}

export function ConnectionStatusIndicator({
  status,
  message,
}: Readonly<ConnectionStatusIndicatorProps>) {
  const statusConfig = useMemo(() => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          color: 'text-green-600 dark:text-green-400',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          label: 'Conectado',
        };
      case 'connecting':
      case 'reconnecting':
        return {
          icon: Loader2,
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          label: status === 'reconnecting' ? 'Reconectando...' : 'Conectando...',
        };
      case 'error':
        return {
          icon: WifiOff,
          color: 'text-red-600 dark:text-red-400',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          label: 'Erro na conexão',
        };
      case 'disconnected':
      case 'closed':
      default:
        return null;
    }
  }, [status]);

  if (!statusConfig) return null;

  const Icon = statusConfig.icon;
  const isAnimating = status === 'connecting' || status === 'reconnecting';

  return (
    <Card className={`${statusConfig.bgColor} ${statusConfig.borderColor}`}>
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${statusConfig.color} ${isAnimating ? 'animate-spin' : ''}`} />
          <p className={`text-xs font-medium ${statusConfig.color}`}>{statusConfig.label}</p>
        </div>
        {message && (
          <p className="text-xs text-muted-foreground dark:text-gray-400 mt-1 ml-6">{message}</p>
        )}
      </CardContent>
    </Card>
  );
}
