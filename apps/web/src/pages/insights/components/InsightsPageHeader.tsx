import { Sparkles } from 'lucide-react';

export function InsightsPageHeader() {
  return (
    <div className="flex items-center gap-3 mb-6 lg:mb-8">
      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-violet-500/15 flex items-center justify-center">
        <Sparkles className="h-5 w-5 lg:h-6 lg:w-6 text-violet-500" />
      </div>
      <div>
        <h1 className="text-lg lg:text-xl font-bold text-text dark:text-text-dark">
          Análise Inteligente
        </h1>
        <p className="text-xs lg:text-sm text-text-muted dark:text-text-muted-dark">
          Insights gerados por IA para suas finanças
        </p>
      </div>
    </div>
  );
}
