import {
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  CreditCard,
  Plus,
  Minus,
  ArrowLeftRight,
} from 'lucide-react';
import type { TransactionType } from '../utils/parseTransactionDescription';

interface TransactionIconProps {
  readonly type: TransactionType;
  readonly isCredit: boolean;
  readonly size?: 'sm' | 'md' | 'lg';
}

const ICON_CONFIG: Record<
  TransactionType,
  {
    icon: typeof ArrowDownLeft;
    creditColor: string;
    debitColor: string;
  }
> = {
  pix_received: {
    icon: ArrowDownLeft,
    creditColor: 'bg-green-500/20 text-green-500',
    debitColor: 'bg-red-500/20 text-red-500',
  },
  pix_sent: {
    icon: ArrowUpRight,
    creditColor: 'bg-green-500/20 text-green-500',
    debitColor: 'bg-red-500/20 text-red-500',
  },
  ted_received: {
    icon: ArrowDownLeft,
    creditColor: 'bg-green-500/20 text-green-500',
    debitColor: 'bg-red-500/20 text-red-500',
  },
  ted_sent: {
    icon: ArrowUpRight,
    creditColor: 'bg-green-500/20 text-green-500',
    debitColor: 'bg-red-500/20 text-red-500',
  },
  transfer_received: {
    icon: ArrowDownLeft,
    creditColor: 'bg-green-500/20 text-green-500',
    debitColor: 'bg-red-500/20 text-red-500',
  },
  transfer_sent: {
    icon: ArrowUpRight,
    creditColor: 'bg-green-500/20 text-green-500',
    debitColor: 'bg-red-500/20 text-red-500',
  },
  boleto_paid: {
    icon: Receipt,
    creditColor: 'bg-green-500/20 text-green-500',
    debitColor: 'bg-red-500/20 text-red-500',
  },
  bill_payment: {
    icon: CreditCard,
    creditColor: 'bg-green-500/20 text-green-500',
    debitColor: 'bg-red-500/20 text-red-500',
  },
  credit: {
    icon: Plus,
    creditColor: 'bg-green-500/20 text-green-500',
    debitColor: 'bg-red-500/20 text-red-500',
  },
  debit: {
    icon: Minus,
    creditColor: 'bg-green-500/20 text-green-500',
    debitColor: 'bg-red-500/20 text-red-500',
  },
  fee: {
    icon: Minus,
    creditColor: 'bg-green-500/20 text-green-500',
    debitColor: 'bg-orange-500/20 text-orange-500',
  },
  unknown: {
    icon: ArrowLeftRight,
    creditColor: 'bg-green-500/20 text-green-500',
    debitColor: 'bg-gray-500/20 text-gray-500',
  },
};

const SIZE_CLASSES = {
  sm: { container: 'w-8 h-8', icon: 'h-4 w-4' },
  md: { container: 'w-10 h-10', icon: 'h-5 w-5' },
  lg: { container: 'w-12 h-12', icon: 'h-6 w-6' },
};

export function TransactionIcon({ type, isCredit, size = 'md' }: TransactionIconProps) {
  const config = ICON_CONFIG[type] ?? ICON_CONFIG.unknown;
  const IconComponent = config.icon;
  const colorClass = isCredit ? config.creditColor : config.debitColor;
  const sizeClass = SIZE_CLASSES[size];

  return (
    <div
      className={`${sizeClass.container} rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
    >
      <IconComponent className={sizeClass.icon} />
    </div>
  );
}
