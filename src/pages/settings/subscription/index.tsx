import { ViewHeader } from '@/components/layout/ViewHeader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PLANS } from '@/constants/plans';
import { ViewDefault } from '@/layouts/ViewDefault';
import { subscriptionService } from '@/services/subscriptionService';
import { useAuthStore } from '@/stores/auth';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function SubscriptionManagementPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: subscription, isLoading } = useQuery({
      queryKey: ['subscription', user?.id],
      queryFn: () => subscriptionService.getMySubscription(user!.id),
      enabled: !!user?.id,
  });

  const currentPlanId = subscription?.plan || (user as any)?.plan || 'free';
  const currentPlan = PLANS.find((p) => p.id === currentPlanId) || PLANS[0];
  const nextBillingDate = subscription?.nextBillingDate 
    ? format(new Date(subscription.nextBillingDate), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : 'N/A';

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  if (isLoading) {
      return (
          <ViewDefault>
              <div className="p-8 text-center text-gray-500">Carregando detalhes da assinatura...</div>
          </ViewDefault>
      );
  }

  return (
    <ViewDefault>
      <ViewHeader
        title="Minha Assinatura"
        description="Gerencie seu plano e método de pagamento"
      />

      <motion.div 
        className="container mx-auto py-8 max-w-4xl"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="space-y-8">
          {/* Current Plan Card - Custom Style */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-card-dark p-6 sm:p-8 shadow-md border border-gray-100 dark:border-border-dark group">
            <div className="absolute top-0 right-0 w-1.5 h-full bg-blue-500 rounded-r-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Plano Atual</h3>
                  <p className="text-gray-500 dark:text-gray-400">Você está inscrito no plano <strong className="text-gray-900 dark:text-white capitalize">{currentPlan.name}</strong></p>
                </div>
                <Badge 
                  variant={currentPlanId === 'free' ? 'secondary' : 'default'} 
                  className="text-sm px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 border-none"
                >
                  {currentPlan.name.toUpperCase()}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl flex items-center gap-4 border border-gray-100 dark:border-gray-700/50">
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Pagamento</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {currentPlanId === 'free' ? 'Gratuito' : `${currentPlan.displayPrice}/mês`}
                    </p>
                  </div>
                </div>

                {currentPlanId !== 'free' && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl flex items-center gap-4 border border-gray-100 dark:border-gray-700/50">
                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                       <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Renovação</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Próxima cobrança em {nextBillingDate}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  Recursos Ativos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentPlan.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  onClick={() => navigate('/pricing')} 
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm py-6 text-base font-semibold"
                  size="lg"
                >
                  {currentPlanId === 'free' ? 'Fazer Upgrade' : 'Alterar Plano'}
                </Button>
                {currentPlanId !== 'free' && (
                  <Button variant="ghost" className="w-full sm:w-auto text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10">
                    Cancelar Assinatura
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Payment History Link/Placeholder */}
           <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-card-dark p-6 border border-gray-100 dark:border-border-dark opacity-60 hover:opacity-100 transition-opacity">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Histórico de Cobranças</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/30">
                <p>Nenhuma fatura gerada recentemente.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </ViewDefault>
  );
}
