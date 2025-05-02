import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { cn } from '@/lib/utils';
import { useTheme } from '@/stores/useTheme';

Chart.register(...registerables);

interface PieChartData {
  name: string;
  value: number;
}

interface PieChartProps {
  data: PieChartData[];
}

export function PieChart({ data }: PieChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      chartInstance.current = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: data.map(item => item.name),
          datasets: [
            {
              data: data.map(item => item.value),
              backgroundColor: [
                '#10B981', // green-500
                '#3B82F6', // blue-500
                '#F59E0B', // yellow-500
                '#EF4444', // red-500
                '#8B5CF6', // purple-500
                '#EC4899', // pink-500
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: isDarkMode ? '#F9FAFB' : '#111827', // text-dark : text
                font: {
                  size: 12,
                  family: "'Inter var', sans-serif",
                },
                padding: 16,
              },
            },
            tooltip: {
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              titleColor: isDarkMode ? '#F9FAFB' : '#111827',
              bodyColor: isDarkMode ? '#F9FAFB' : '#111827',
              borderColor: isDarkMode ? '#374151' : '#E5E7EB',
              borderWidth: 1,
              padding: 12,
              boxPadding: 4,
              usePointStyle: true,
              callbacks: {
                label: function(context) {
                  const value = context.raw as number;
                  return `R$ ${value.toLocaleString('pt-BR')}`;
                }
              }
            }
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, isDarkMode]);

  return (
    <div className="relative h-full">
      <canvas ref={chartRef} />
    </div>
  );
}
