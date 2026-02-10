import { Sparkles } from 'lucide-react';
import { toast } from '@/components/ui/toast';

export function AskAirFinanceFab() {
  const handleClick = () => {
    toast({
      title: 'Em breve!',
      description: 'Estamos trabalhando nisso.',
      type: 'info',
    });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-24 right-4 lg:bottom-6 lg:right-8 z-50 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-violet-600 hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600 text-white text-sm font-medium shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 active:scale-95"
    >
      <Sparkles className="h-4 w-4" />
      Pergunte ao AirFinance
    </button>
  );
}
