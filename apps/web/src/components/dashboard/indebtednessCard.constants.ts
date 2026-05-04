export const STATUS_COLORS = {
  credit: {
    low: 'text-green-600 dark:text-green-400',
    moderate: 'text-yellow-600 dark:text-yellow-400',
    high: 'text-orange-600 dark:text-orange-400',
    critical: 'text-red-600 dark:text-red-400',
  },
  liquidity: {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-yellow-600 dark:text-yellow-400',
    critical: 'text-red-600 dark:text-red-400',
  },
} as const;

export const STATUS_BG_COLORS = {
  credit: {
    low: 'bg-green-100 dark:bg-green-900/20',
    moderate: 'bg-yellow-100 dark:bg-yellow-900/20',
    high: 'bg-orange-100 dark:bg-orange-900/20',
    critical: 'bg-red-100 dark:bg-red-900/20',
  },
  liquidity: {
    positive: 'bg-green-100 dark:bg-green-900/20',
    negative: 'bg-yellow-100 dark:bg-yellow-900/20',
    critical: 'bg-red-100 dark:bg-red-900/20',
  },
} as const;

export const STATUS_LABELS = {
  credit: {
    low: 'Baixo',
    moderate: 'Moderado',
    high: 'Alto',
    critical: 'Crítico',
  },
  liquidity: {
    positive: 'Saudável',
    negative: 'Atenção',
    critical: 'Crítico',
  },
} as const;

export const PROGRESS_BAR_COLORS = {
  low: 'bg-green-500',
  moderate: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
} as const;

export const SUGGESTION_CONFIG = {
  success: {
    icon: '✅',
    color: 'text-green-600 dark:text-green-400',
    border: 'border-green-500',
  },
  warning: {
    icon: '⚠️',
    color: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-500',
  },
  error: {
    icon: '🚨',
    color: 'text-red-600 dark:text-red-400',
    border: 'border-red-500',
  },
  info: {
    icon: '💡',
    color: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500',
  },
} as const;
