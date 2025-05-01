import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { cn } from '@/lib/utils';

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
                color: '#6B7280', // gray-500
                font: {
                  size: 12,
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="relative h-full">
      <canvas ref={chartRef} />
    </div>
  );
}
