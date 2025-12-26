import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AlertTriangle, Lightbulb, TrendingDown, TrendingUp } from 'lucide-react';

export type InsightType = 'positive' | 'negative' | 'warning' | 'neutral';

export interface Insight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
}

interface InsightsCardProps {
  insights: Insight[];
  className?: string;
}

export function InsightsCard({ insights, className }: Readonly<InsightsCardProps>) {
  const getIcon = (type: InsightType) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'negative':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackground = (type: InsightType) => {
      switch (type) {
        case 'positive':
          return 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30';
        case 'negative':
          return 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30';
        case 'warning':
          return 'bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/30';
        default:
          return 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-900/30';
      }
  };

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle className="text-base font-medium flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Insights & Sugestões
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {insights.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nenhum insight disponível para o período.</p>
        ) : (
            insights.map((insight) => (
            <div
                key={insight.id}
                className={cn(
                'flex items-start gap-3 p-3 rounded-lg border',
                getBackground(insight.type)
                )}
            >
                <div className="mt-0.5">{getIcon(insight.type)}</div>
                <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{insight.title}</p>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
            </div>
            ))
        )}
      </CardContent>
    </Card>
  );
}
