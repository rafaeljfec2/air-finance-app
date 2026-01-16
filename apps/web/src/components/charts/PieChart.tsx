import { useTheme } from '@/stores/useTheme';
import {
  Cell,
  Legend,
  Pie,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartProps {
  data: PieChartData[];
}

const COLORS = [
  '#10B981', // green-500
  '#3B82F6', // blue-500
  '#F59E0B', // yellow-500
  '#EF4444', // red-500
  '#8B5CF6', // purple-500
  '#EC4899', // pink-500
];

export function PieChart({ data }: Readonly<PieChartProps>) {
  const { isDarkMode } = useTheme();

  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              borderColor: isDarkMode ? '#374151' : '#E5E7EB',
              borderRadius: '0.5rem',
              color: isDarkMode ? '#F9FAFB' : '#111827',
            }}
            itemStyle={{ color: isDarkMode ? '#F9FAFB' : '#111827' }}
            formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR')}`, 'Valor']}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            wrapperStyle={{
              paddingTop: '1rem',
              fontSize: '12px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '4px',
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
