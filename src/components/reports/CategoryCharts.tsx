import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';
import { ChartBarIcon, ChartPieIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/formatters';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface HistoricalData {
  date: string;
  categories: {
    name: string;
    value: number;
    color: string;
  }[];
}

interface Report {
  incomeByCategory: ChartData[];
  expensesByCategory: ChartData[];
  historicalIncome: HistoricalData[];
  historicalExpenses: HistoricalData[];
}

interface CategoryChartsProps {
  report: Report;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

type ChartType = 'pie' | 'bar' | 'line';

const COLORS = [
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#6366F1', // Indigo
  '#EF4444', // Red
];

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function CategoryCharts({ report }: CategoryChartsProps) {
  const [chartType, setChartType] = useState<ChartType>('pie');

  const renderChart = (data: ChartData[], title: string) => {
    switch (chartType) {
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        const historicalData = title.includes('Income') ? report.historicalIncome : report.historicalExpenses;
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip content={<CustomTooltip />} />
              {historicalData[0]?.categories.map((category, index) => (
                <Line
                  key={category.name}
                  type="monotone"
                  dataKey={`categories[${index}].value`}
                  name={category.name}
                  stroke={category.color || COLORS[index % COLORS.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart Type Selector */}
      <div className="lg:col-span-2 flex justify-center gap-2">
        <button
          onClick={() => setChartType('pie')}
          className={cn(
            'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium',
            chartType === 'pie'
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          )}
        >
          <ChartPieIcon className="h-5 w-5 mr-1" />
          Pie Chart
        </button>
        <button
          onClick={() => setChartType('bar')}
          className={cn(
            'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium',
            chartType === 'bar'
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          )}
        >
          <ChartBarIcon className="h-5 w-5 mr-1" />
          Bar Chart
        </button>
        <button
          onClick={() => setChartType('line')}
          className={cn(
            'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium',
            chartType === 'line'
              ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          )}
        >
          <ArrowTrendingUpIcon className="h-5 w-5 mr-1" />
          Line Chart
        </button>
      </div>

      {/* Income Chart */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Income by Category</h3>
        {renderChart(report.incomeByCategory, 'Income')}
      </Card>

      {/* Expenses Chart */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Expenses by Category</h3>
        {renderChart(report.expensesByCategory, 'Expenses')}
      </Card>
    </div>
  );
}
