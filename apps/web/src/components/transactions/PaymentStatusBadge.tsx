import { cn } from '@/lib/utils';
import { Clock, CheckCircle2, XCircle, Ban, RotateCcw } from 'lucide-react';

interface PaymentStatusBadgeProps {
  readonly status?: 'PROCESSANDO' | 'CONCLUIDO' | 'FALHOU' | 'CANCELADO';
  readonly onRetry?: () => void;
}

const STATUS_CONFIG = {
  PROCESSANDO: {
    label: 'Pendente',
    icon: Clock,
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  CONCLUIDO: {
    label: 'Pago',
    icon: CheckCircle2,
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  },
  FALHOU: {
    label: 'Falhou',
    icon: XCircle,
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
  CANCELADO: {
    label: 'Cancelado',
    icon: Ban,
    className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  },
} as const;

export function PaymentStatusBadge({ status, onRetry }: PaymentStatusBadgeProps) {
  if (!status) return null;

  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span className="inline-flex items-center gap-1 shrink-0">
      <span
        className={cn(
          'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap',
          config.className,
        )}
      >
        <Icon className="w-2.5 h-2.5" />
        {config.label}
      </span>
      {status === 'FALHOU' && onRetry && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRetry();
          }}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium whitespace-nowrap bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          Retry
        </button>
      )}
    </span>
  );
}
