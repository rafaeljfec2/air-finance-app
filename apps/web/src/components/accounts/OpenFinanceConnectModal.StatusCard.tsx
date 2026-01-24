import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';

interface StatusCardProps {
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
  readonly variant: 'blue' | 'yellow' | 'green' | 'gray';
}

export function StatusCard({ icon: Icon, title, description, variant }: Readonly<StatusCardProps>) {
  const variantStyles = useMemo(() => {
    switch (variant) {
      case 'blue':
        return {
          card: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
          icon: 'text-blue-600 dark:text-blue-400',
          title: 'text-blue-900 dark:text-blue-100',
          description: 'text-blue-800 dark:text-blue-200',
        };
      case 'yellow':
        return {
          card: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
          icon: 'text-yellow-600 dark:text-yellow-400',
          title: 'text-yellow-900 dark:text-yellow-100',
          description: 'text-yellow-800 dark:text-yellow-200',
        };
      case 'green':
        return {
          card: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
          icon: 'text-green-600 dark:text-green-400',
          title: 'text-green-900 dark:text-green-100',
          description: 'text-green-800 dark:text-green-200',
        };
      case 'gray':
      default:
        return {
          card: 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800',
          icon: 'text-gray-600 dark:text-gray-400',
          title: 'text-gray-900 dark:text-gray-100',
          description: 'text-gray-700 dark:text-gray-300',
        };
    }
  }, [variant]);

  return (
    <Card className={variantStyles.card}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 ${variantStyles.icon} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className={`text-sm font-medium ${variantStyles.title}`}>{title}</p>
            <p className={`text-xs ${variantStyles.description} mt-1`}>{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
