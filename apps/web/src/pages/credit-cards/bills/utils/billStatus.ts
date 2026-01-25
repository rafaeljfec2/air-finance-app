export type BillStatus = 'OPEN' | 'CLOSED' | 'PAID';

interface StatusConfig {
  readonly label: string;
  readonly color: string;
  readonly bg: string;
}

const STATUS_CONFIG: Record<BillStatus, StatusConfig> = {
  PAID: {
    label: 'Fatura Paga',
    color: 'text-primary-500',
    bg: 'bg-primary-50 dark:bg-primary-900/20',
  },
  CLOSED: {
    label: 'Fatura Fechada',
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  OPEN: {
    label: 'Fatura Aberta',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
};

export const getStatusConfig = (status: BillStatus): StatusConfig => {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.OPEN;
};

export const getStatusBadgeClasses = (status: BillStatus): string => {
  const config = getStatusConfig(status);
  return `text-xs font-medium px-2.5 py-1 rounded-full ${config.bg} ${config.color}`;
};
