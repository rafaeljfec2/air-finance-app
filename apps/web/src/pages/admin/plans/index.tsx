import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlanFormModal } from '@/components/admin/PlanFormModal';
import { ViewDefault } from '@/layouts/ViewDefault';
import { subscriptionService, type UpdatePlanData } from '@/services/subscriptionService';
import { Plan } from '@/types/subscription';
import { parseApiError, getUserFriendlyMessage, logApiError } from '@/utils/apiErrorHandler';
import { toast } from '@/components/ui/toast';
import { Settings, Edit } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';

export function PlansAdminPage() {
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const {
    data: plans,
    isLoading,
    error,
  } = useQuery<Plan[]>({
    queryKey: ['admin-plans'],
    queryFn: () => subscriptionService.getPlans(),
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({ planName, data }: { planName: string; data: UpdatePlanData }) =>
      subscriptionService.updatePlan(planName as 'free' | 'pro' | 'business', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      queryClient.invalidateQueries({ queryKey: ['plan-permissions'] });
      toast({
        title: 'Sucesso',
        description: 'Plano atualizado com sucesso!',
        type: 'success',
      });
      setShowFormModal(false);
      setEditingPlan(null);
    },
    onError: (error) => {
      const apiError = parseApiError(error);
      logApiError(apiError);
      toast({
        title: 'Erro',
        description: getUserFriendlyMessage(apiError),
        type: 'error',
      });
    },
  });

  const sortedPlans = useMemo(() => {
    if (!plans) return [];
    const order = ['free', 'pro', 'business'];
    return [...plans].sort((a, b) => {
      const indexA = order.indexOf(a.name);
      const indexB = order.indexOf(b.name);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
  }, [plans]);

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setShowFormModal(true);
  };

  const handleSubmit = (data: UpdatePlanData) => {
    if (!editingPlan) return;
    updatePlanMutation.mutate({ planName: editingPlan.name, data });
  };

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <Loading size="large" />
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <div className="flex items-center justify-center h-full min-h-[400px]">
          <div className="text-center">
            <p className="text-red-500 mb-4">Erro ao carregar planos</p>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-plans'] })}>
              Tentar novamente
            </Button>
          </div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Settings className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">
                  Gerenciar Planos
                </h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Configure os planos de assinatura e seus limites
              </p>
            </div>
          </div>

          {/* Plans List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPlans.map((plan) => (
              <Card
                key={plan.name}
                className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6 relative"
              >
                {plan.highlight && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    RECOMENDADO
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="text-xl font-bold text-text dark:text-text-dark mb-2 capitalize">
                    {plan.name}
                  </h3>
                  <div className="text-3xl font-bold text-primary-500 mb-2">
                    {plan.displayPrice || `R$ ${plan.priceMonthly?.toFixed(2) || '0,00'}`}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">por mês</p>
                </div>

                {/* Limits */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Contas:</span>
                    <span className="text-sm font-semibold text-text dark:text-text-dark">
                      {plan.limits?.maxAccounts === -1
                        ? 'Ilimitadas'
                        : plan.limits?.maxAccounts || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cartões:</span>
                    <span className="text-sm font-semibold text-text dark:text-text-dark">
                      {plan.limits?.maxCards === -1 ? 'Ilimitados' : plan.limits?.maxCards || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Múltiplos Perfis:
                    </span>
                    <span className="text-sm font-semibold text-text dark:text-text-dark">
                      {plan.limits?.multiCompany ? 'Sim' : 'Não'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">IA:</span>
                    <span className="text-sm font-semibold text-text dark:text-text-dark">
                      {plan.limits?.aiEnabled ? 'Habilitada' : 'Desabilitada'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Integração Bancária:
                    </span>
                    <span className="text-sm font-semibold text-text dark:text-text-dark">
                      {plan.limits?.bankIntegrationEnabled ? 'Sim' : 'Não'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Multi-Usuário:</span>
                    <span className="text-sm font-semibold text-text dark:text-text-dark">
                      {plan.limits?.multiUser ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </div>

                {/* Features */}
                {plan.features && plan.features.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-text dark:text-text-dark mb-2">
                      Recursos:
                    </h4>
                    <ul className="space-y-1">
                      {plan.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 dark:text-gray-400 flex items-start"
                        >
                          <span className="text-green-500 mr-2">•</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Edit Button */}
                <Button
                  onClick={() => handleEdit(plan)}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Editar Plano
                </Button>
              </Card>
            ))}
          </div>

          {/* Form Modal */}
          {showFormModal && editingPlan && (
            <PlanFormModal
              open={showFormModal}
              plan={editingPlan}
              onClose={() => {
                setShowFormModal(false);
                setEditingPlan(null);
              }}
              onSubmit={handleSubmit}
              isLoading={updatePlanMutation.isPending}
            />
          )}
        </div>
      </div>
    </ViewDefault>
  );
}
