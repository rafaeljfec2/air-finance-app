import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps,
} from 'recharts';

interface BalanceChartProps {
  data: Array<{
    date: string;
    balance: number;
  }>;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    value: number;
    payload: {
      date: string;
      balance: number;
    };
  }>;
  label?: string;
}

export function BalanceChart({ data }: BalanceChartProps) {
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {format(new Date(label || ''), 'dd MMM yyyy', { locale: ptBR })}
          </p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="rgb(34, 197, 94)"
              stopOpacity={0.2}
            />
            <stop
              offset="95%"
              stopColor="rgb(34, 197, 94)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="rgb(75, 85, 99)"
          opacity={0.2}
        />
        <XAxis
          dataKey="date"
          tickFormatter={(value: string) => format(new Date(value), 'dd/MM', { locale: ptBR })}
          stroke="rgb(156, 163, 175)"
          fontSize={12}
        />
        <YAxis
          tickFormatter={(value: number) => formatCurrency(value)}
          stroke="rgb(156, 163, 175)"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="rgb(34, 197, 94)"
          fill="url(#balanceGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
} 