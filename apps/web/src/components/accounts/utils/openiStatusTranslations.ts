import { CheckCircle2, Loader2, AlertCircle, Clock, XCircle, RefreshCw, WifiOff } from 'lucide-react';

export interface StatusBadgeConfig {
  label: string;
  icon: typeof CheckCircle2;
  className: string;
}

export const translateOpeniStatus = (status: string): StatusBadgeConfig => {
  const upperStatus = status.toUpperCase();

  switch (upperStatus) {
    case 'CONNECTED':
      return {
        label: 'Conectado',
        icon: CheckCircle2,
        className:
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      };
    case 'SYNCING':
      return {
        label: 'Sincronizando',
        icon: Loader2,
        className:
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      };
    case 'SYNCED':
      return {
        label: 'Sincronizado',
        icon: CheckCircle2,
        className:
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      };
    case 'PENDING':
      return {
        label: 'Pendente',
        icon: Clock,
        className:
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800',
      };
    case 'WAITING_USER_INPUT':
      return {
        label: 'Aguardando ação',
        icon: AlertCircle,
        className:
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
      };
    case 'ERROR':
    case 'AUTH_ERROR':
      return {
        label: 'Erro',
        icon: XCircle,
        className:
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
      };
    case 'OUT_OF_SYNC':
      return {
        label: 'Desincronizado',
        icon: RefreshCw,
        className:
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
      };
    case 'DELETED':
      return {
        label: 'Excluído',
        icon: WifiOff,
        className:
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800',
      };
    default:
      return {
        label: status,
        icon: AlertCircle,
        className:
          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800',
      };
  }
};
