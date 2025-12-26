import { useTheme } from '@/stores/useTheme';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    TooltipProps,
    XAxis,
    YAxis,
} from 'recharts';

interface CashFlowData {
  date: string;
  revenue: number;
  expenses: number;
  balance: number;
}

interface CashFlowChartProps {
  data: CashFlowData[];
}

interface CustomTooltipProps extends TooltipProps<number, string> {
    active?: boolean;
    payload?: Array<{
      value: number;
      dataKey: string;
      color: string;
      name: string;
      payload: CashFlowData;
    }>;
    label?: string;
  }

function CustomTooltip({ active, payload, label }: Readonly<CustomTooltipProps>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
          {format(new Date(label ?? ''), 'MMMM yyyy', { locale: ptBR })}
        </p>
        <div className="space-y-1">
            {payload.map((entry) => (
                <div key={entry.dataKey} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-sm text-gray-600 dark:text-gray-300 capitalize">{entry.name}:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white ml-auto">
                        {formatCurrency(entry.value)}
                    </span>
                </div>
            ))}
        </div>
      </div>
    );
  }
  return null;
}

export function CashFlowChart({ data }: Readonly<CashFlowChartProps>) {
  const { isDarkMode } = useTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} stroke="currentColor" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => format(new Date(value), 'MMM', { locale: ptBR })}
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'currentColor', opacity: 0.7, fontSize: 12 }}
          dy={10}
        />
        <YAxis
          tickFormatter={(value) => 
            new Intl.NumberFormat('pt-BR', { notation: 'compact', compactDisplay: 'short' }).format(value)
          }
          axisLine={false}
          tickLine={false}
          tick={{ fill: 'currentColor', opacity: 0.7, fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? '#374151' : '#F3F4F6', opacity: 0.4 }} />
        <Legend 
            verticalAlign="top" 
            height={36}
            iconType="circle"
        />
        <Bar 
            dataKey="revenue" 
            name="Receitas" 
            fill="#10B981" 
            radius={[4, 4, 0, 0]} 
            barSize={20}
            stackId="stack"
        />
        <Bar 
            dataKey="expenses" 
            name="Despesas" 
            fill="#EF4444" 
            radius={[4, 4, 0, 0]} 
            barSize={20}
            stackId="stack"
        />
        <Line
            type="monotone"
            dataKey="balance"
            name="Resultado Líquido"
            stroke="#3B82F6"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
