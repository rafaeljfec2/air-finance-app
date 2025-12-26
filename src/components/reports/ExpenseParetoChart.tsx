import { useTheme } from '@/stores/useTheme';
import { formatCurrency } from '@/utils/formatters';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis,
} from 'recharts';

interface ExpenseItem {
  category: string;
  amount: number;
  percentage: number;
}

interface ExpenseParetoChartProps {
  data: ExpenseItem[];
}

interface CustomTooltipProps extends TooltipProps<number, string> {
    active?: boolean;
    payload?: Array<{
      value: number;
      payload: ExpenseItem;
    }>;
  }

function CustomTooltip({ active, payload }: Readonly<CustomTooltipProps>) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {data.category}
        </p>
        <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">Gasto:</span>
            <span className="text-sm font-semibold text-red-500">
                {formatCurrency(data.amount)}
            </span>
        </div>
        <div className="flex items-center justify-between gap-4 mt-1">
            <span className="text-xs text-gray-500">Representatividade:</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {data.percentage.toFixed(1)}%
            </span>
        </div>
      </div>
    );
  }
  return null;
}

export function ExpenseParetoChart({ data }: Readonly<ExpenseParetoChartProps>) {
  const { isDarkMode } = useTheme();

  // Sort data descending just in case
  const sortedData = [...data].sort((a, b) => b.amount - a.amount).slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        layout="vertical"
        data={sortedData}
        margin={{
          top: 5,
          right: 30,
          left: 40, // More space for category names
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} stroke="currentColor" />
        <XAxis type="number" hide />
        <YAxis 
            dataKey="category" 
            type="category" 
            width={100}
            tick={{ fill: 'currentColor', opacity: 0.8, fontSize: 12 }}
            tickLine={false}
            axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? '#374151' : '#F3F4F6', opacity: 0.4 }} />
        <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={24}>
            {sortedData.map((_, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={index < 3 ? '#EF4444' : '#F87171'} // Top 3 darker red
                    opacity={index < 3 ? 1 : 0.7}
                />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
