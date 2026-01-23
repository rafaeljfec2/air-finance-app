import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatters';
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react';
import { useMemo } from 'react';

interface TransactionSummaryProps {
  totalCredits: number;
  totalDebits: number;
  finalBalance: number;
}

type SummaryType = 'credits' | 'debits' | 'balance';

interface SummaryCardProps {
  type: SummaryType;
  label: string;
  value: number;
  isPositive: boolean;
}

const SummaryCard = ({ type, label, value, isPositive }: Readonly<SummaryCardProps>) => {
  const iconConfig = useMemo(() => {
    switch (type) {
      case 'credits':
        return {
          Icon: ArrowUpCircle,
          bgColor: 'bg-green-100 dark:bg-green-900/20',
          textColor: 'text-green-600 dark:text-green-400',
        };
      case 'debits':
        return {
          Icon: ArrowDownCircle,
          bgColor: 'bg-red-100 dark:bg-red-900/20',
          textColor: 'text-red-600 dark:text-red-400',
        };
      case 'balance':
        return {
          Icon: Wallet,
          bgColor: isPositive
            ? 'bg-blue-100 dark:bg-blue-900/20'
            : 'bg-red-100 dark:bg-red-900/20',
          textColor: isPositive
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-red-600 dark:text-red-400',
        };
    }
  }, [type, isPositive]);

  const formattedValue = useMemo(() => {
    if (type === 'debits') {
      return `-${formatCurrency(value)}`;
    }
    if (type === 'credits') {
      return formatCurrency(value);
    }
    return formatCurrency(value);
  }, [type, value]);

  const { Icon, bgColor, textColor } = iconConfig;

  return (
    <Card className="p-2 bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
      <div className="flex items-center justify-between space-x-3">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 ${bgColor} rounded-full`}>
            <Icon className={`h-3.5 w-3.5 ${textColor}`} />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
            <h3 className={`text-lg font-bold ${textColor}`}>{formattedValue}</h3>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface SummaryItemProps {
  type: SummaryType;
  label: string;
  value: number;
  isPositive: boolean;
}

const SummaryItem = ({ type, label, value, isPositive }: Readonly<SummaryItemProps>) => {
  const iconConfig = useMemo(() => {
    switch (type) {
      case 'credits':
        return {
          Icon: ArrowUpCircle,
          textColor: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'debits':
        return {
          Icon: ArrowDownCircle,
          textColor: 'text-red-600 dark:text-red-400',
        };
      case 'balance':
        return {
          Icon: Wallet,
          textColor: isPositive
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-red-600 dark:text-red-400',
        };
    }
  }, [type, isPositive]);

  const formattedValue = useMemo(() => {
    if (type === 'credits') {
      return `+${formatCurrency(value)}`;
    }
    if (type === 'debits') {
      return `-${formatCurrency(value)}`;
    }
    return formatCurrency(value);
  }, [type, value]);

  const { Icon, textColor } = iconConfig;

  return (
    <div className="flex flex-col items-center flex-1">
      <div className="flex items-center gap-1 mb-1">
        <Icon className={`h-3.5 w-3.5 ${textColor}`} />
        <span className="text-[10px] text-gray-500 dark:text-gray-400">{label}</span>
      </div>
      <span className={`text-sm font-bold ${textColor}`}>{formattedValue}</span>
    </div>
  );
};

const Divider = () => (
  <div className="h-10 w-px bg-border dark:bg-border-dark" />
);

export function TransactionSummary({
  totalCredits,
  totalDebits,
  finalBalance,
}: Readonly<TransactionSummaryProps>) {
  const isBalancePositive = useMemo(() => finalBalance >= 0, [finalBalance]);

  return (
    <>
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 mb-2 animate-in slide-in-from-top-2 duration-200">
        <SummaryCard
          type="credits"
          label="Receitas"
          value={totalCredits}
          isPositive={true}
        />
        <SummaryCard
          type="debits"
          label="Despesas"
          value={totalDebits}
          isPositive={false}
        />
        <SummaryCard
          type="balance"
          label="Saldo do Período"
          value={finalBalance}
          isPositive={isBalancePositive}
        />
      </div>

      <div className="md:hidden mb-3">
        <Card className="p-3 bg-card dark:bg-card-dark border-border dark:border-border-dark">
          <div className="flex items-center justify-between gap-3">
            <SummaryItem
              type="credits"
              label="Receitas"
              value={totalCredits}
              isPositive={true}
            />
            <Divider />
            <SummaryItem
              type="debits"
              label="Despesas"
              value={totalDebits}
              isPositive={false}
            />
            <Divider />
            <SummaryItem
              type="balance"
              label="Saldo"
              value={finalBalance}
              isPositive={isBalancePositive}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
