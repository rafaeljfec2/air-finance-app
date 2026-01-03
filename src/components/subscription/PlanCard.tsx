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
  const planId = plan.id || plan.name;
  const isCurrent = currentPlanId === planId;
  const isHighlight = plan.highlight;

  // Refined styling for a more premium look
  const themeText = isHighlight ? 'text-emerald-700 dark:text-emerald-400' : plan.name === 'business' ? 'text-purple-700 dark:text-purple-400' : 'text-blue-700 dark:text-blue-400';
  const borderColor = isHighlight ? 'border-emerald-200 dark:border-emerald-800' : 'border-gray-200 dark:border-gray-800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={cn("h-full relative", isHighlight ? "z-10 -mt-4 mb-4" : "")} // Lift highlighted card slightly
    >
      <div className={cn(
        'relative overflow-hidden rounded-2xl bg-white dark:bg-card-dark p-8 shadow-lg border h-full flex flex-col justify-between transition-all duration-300',
        borderColor,
        isHighlight ? 'shadow-emerald-100 dark:shadow-emerald-900/20 ring-1 ring-emerald-500/50' : 'hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-700',
        isCurrent ? 'ring-2 ring-blue-500/50 cursor-default' : ''
      )}>
        
        {/* Recommended Badge */}
        {isHighlight && (
          <div className="absolute top-0 inset-x-0 flex justify-center pt-2">
             <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide uppercase">
                Recomendado
             </div>
          </div>
        )}

        <div className="relative z-10 flex flex-col h-full mt-2">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 capitalize tracking-tight">{plan.name}</h3>
            
            <div className="flex items-end justify-center gap-1 mt-6 text-gray-900 dark:text-white">
              <span className="text-4xl font-extrabold tracking-tight">{plan.displayPrice}</span>
              <span className="text-gray-500 dark:text-gray-400 font-medium mb-1">/mês</span>
            </div>
            
            {plan.price === 0 && (
                 <p className="mt-4 text-sm text-gray-500">
                    Perfeito para começar
                 </p>
            )}
             {plan.name === 'pro' && (
                 <p className="mt-4 text-sm text-emerald-600 font-medium">
                    O favorito dos freelancers
                 </p>
            )}
             {plan.name === 'business' && (
                 <p className="mt-4 text-sm text-purple-600 font-medium">
                    Para empresas em crescimento
                 </p>
            )}
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-gray-800 mb-8" />

          {/* Features */}
          <ul className="space-y-4 mb-8 flex-1">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={cn("rounded-full p-0.5 shrink-0 mt-0.5 bg-white dark:bg-gray-800", themeText)}>
                  <Check className="h-4 w-4" strokeWidth={3} />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300 leading-tight">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Action Button */}
          <Button 
            className={cn(
                "w-full py-6 font-bold shadow-sm transition-all duration-300 text-base rounded-xl", 
                isHighlight 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5" 
                    : isCurrent 
                        ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 shadow-none border border-transparent"
                        : "bg-white dark:bg-transparent border-2 border-gray-200 dark:border-gray-700 hover:border-gray-900 dark:hover:border-gray-400 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
            onClick={() => !isCurrent && planId && onSelect(planId)}
            disabled={isLoading || isCurrent}
          >
            {isLoading ? (
               <div className="flex items-center gap-2">
                 <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                 Processando...
               </div>
            ) : (
                isCurrent ? 'Seu Plano Atual' : isHighlight ? 'Começar Agora' : 'Escolher este plano'
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
