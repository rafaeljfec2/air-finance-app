import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plan } from '@/types/subscription';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PlanCardProps {
  plan: Plan;
  onSelect: (planId: string) => void;
  isLoading?: boolean;
  currentPlanId?: string;
}

export function PlanCard({ plan, onSelect, isLoading, currentPlanId }: PlanCardProps) {
  const isCurrent = currentPlanId === plan.id;
  const isHighlight = plan.highlight;

  // Define styling based on plan type or highlight
  const themeColor = isHighlight ? 'bg-emerald-500' : plan.name === 'business' ? 'bg-purple-500' : 'bg-blue-500';
  const themeLightBg = isHighlight ? 'bg-emerald-50 dark:bg-emerald-900/30' : plan.name === 'business' ? 'bg-purple-50 dark:bg-purple-900/30' : 'bg-blue-50 dark:bg-blue-900/30';
  const themeText = isHighlight ? 'text-emerald-700 dark:text-emerald-400' : plan.name === 'business' ? 'text-purple-700 dark:text-purple-400' : 'text-blue-700 dark:text-blue-400';
  const glowColor = isHighlight ? 'bg-emerald-500/10 group-hover:bg-emerald-500/20' : plan.name === 'business' ? 'bg-purple-500/10 group-hover:bg-purple-500/20' : 'bg-blue-500/10 group-hover:bg-blue-500/20';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <div className={cn(
        'relative overflow-hidden rounded-2xl bg-white dark:bg-card-dark p-6 sm:p-8 shadow-md border border-gray-100 dark:border-border-dark group h-full flex flex-col justify-between transition-all duration-300',
        isHighlight ? 'ring-2 ring-emerald-500 shadow-xl' : '',
        isCurrent ? 'ring-2 ring-blue-500/50' : ''
      )}>
        {/* Decorative elements similar to Dashboard */}
        <div className={cn("absolute top-0 right-0 w-1.5 h-full rounded-r-2xl opacity-80 group-hover:opacity-100 transition-opacity", themeColor)} />
        <div className={cn("absolute -right-6 -top-6 w-32 h-32 rounded-full blur-3xl transition-all", glowColor)} />

        {isHighlight && (
          <div className="absolute top-4 right-6 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm z-10">
            Mais Popular
          </div>
        )}

        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 capitalize">{plan.name}</h3>
            <div className="flex items-baseline justify-center gap-1 mt-4">
               <span className={cn("text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white")}>
                 {plan.displayPrice}
               </span>
               <span className="text-sm font-medium text-gray-500 dark:text-gray-400">/mês</span>
            </div>
            {plan.price === 0 && (
                <span className="inline-block mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
                    Sempre gratuito
                </span>
            )}
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gray-100 dark:bg-gray-800 my-6" />

          {/* Features */}
          <ul className="space-y-4 mb-8 flex-1">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600 dark:text-gray-300">
                <div className={cn("rounded-full p-1 shrink-0 mt-0.5", themeLightBg, themeText)}>
                  <Check className="h-3 w-3" />
                </div>
                <span className="leading-tight">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Action Button */}
          <Button 
            className={cn(
                "w-full py-6 font-semibold shadow-sm transition-all duration-200 text-base", 
                isHighlight 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 ring-2 ring-emerald-600 ring-offset-2 dark:ring-offset-card-dark" 
                    : isCurrent 
                        ? "bg-gray-100/50 text-gray-500 dark:bg-gray-800/50 dark:text-gray-500 cursor-default hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                        : "bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
            onClick={() => !isCurrent && onSelect(plan.id)}
            disabled={isLoading || isCurrent}
            variant={isHighlight ? 'default' : 'outline'}
          >
            {isLoading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
            {isCurrent ? 'Seu Plano Atual' : isHighlight ? 'Assinar Agora' : `Escolher ${plan.name}`}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
