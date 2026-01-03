import { PlanCard } from '@/components/subscription/PlanCard';
import { PLANS } from '@/constants/plans';
import { ViewDefault } from '@/layouts/ViewDefault';
import { subscriptionService } from '@/services/subscriptionService';
import { useAuthStore } from '@/stores/auth';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export function PricingPage() {
  const { user } = useAuthStore();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const { data: plansData = [] } = useQuery({
      queryKey: ['plans'],
      queryFn: subscriptionService.getPlans,
      initialData: PLANS, 
  });

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
        window.location.href = '/register';
        return;
    }

    try {
      setLoadingPlanId(planId);
      const data = await subscriptionService.createCheckoutSession(user.id, planId);
      
      if (data && data.url) {
          window.location.href = data.url;
      } else {
          throw new Error('No checkout URL returned');
      }

    } catch (error) {
      alert(`Erro ao iniciar pagamento: ${(error as any).message}`);
    } finally {
      setLoadingPlanId(null);
    }
  };

  return (
    <ViewDefault>
      <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen">
        <div className="container mx-auto px-4 py-10 sm:py-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
              Invista no futuro do seu negócio
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400">
              Escolha o plano ideal para suas necessidades e comece a transformar sua gestão financeira hoje mesmo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative">
             {/* Decorative Background Blob */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full max-h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
             
             {Array.isArray(plansData) && plansData.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  onSelect={handleSelectPlan}
                  isLoading={loadingPlanId === plan.id}
                  currentPlanId={(user as any)?.plan || 'free'} 
                />
              ))}
          </div>

          {!Array.isArray(plansData) && (
              <div className="text-center text-red-500 mt-8">
                Erro ao carregar planos. Por favor, recarregue a página.
              </div>
          )}
          
          {/* Trust Signals */}
          <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 text-center border-t border-gray-100 dark:border-gray-800 pt-12">
             <div className="flex flex-col items-center">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-4">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pagamento 100% Seguro</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Processado via Stripe com criptografia de ponta a ponta.</p>
             </div>
             <div className="flex flex-col items-center">
                <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full mb-4">
                   <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cancele quando quiser</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Sem contratos de longo prazo ou taxas ocultas.</p>
             </div>
             <div className="flex flex-col items-center">
                 <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mb-4">
                   <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                 </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Acesso Imediato</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">Desbloqueie todos os recursos assim que confirmar o pagamento.</p>
             </div>
          </div>
          
           {/* FAQ Section */}
           <div className="mt-24 max-w-3xl mx-auto">
             <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Perguntas Frequentes</h2>
             <div className="space-y-6">
               <div className="bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                 <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Posso mudar de plano depois?</h4>
                 <p className="text-gray-600 dark:text-gray-300">Sim! Você pode fazer upgrade ou downgrade a qualquer momento através do painel de configurações. A mudança é imediata.</p>
               </div>
               <div className="bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                 <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Como funciona a integração bancária?</h4>
                 <p className="text-gray-600 dark:text-gray-300">Nossos planos Business incluem integração direta com APIs de bancos (como Inter). Para outros planos, você pode importar seus extratos OFX facilmente.</p>
               </div>
               <div className="bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                 <h4 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">Existe algum período de fidelidade?</h4>
                 <p className="text-gray-600 dark:text-gray-300">Não. O Airfinance funciona no modelo de assinatura mensal. Você é livre para cancelar quando desejar, sem multas.</p>
               </div>
             </div>
           </div>

        </div>
      </div>
    </ViewDefault>
  );
}
