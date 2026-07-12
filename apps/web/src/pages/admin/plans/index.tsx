import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';

import { PlanFormModal } from '@/components/admin/PlanFormModal';
import { TableSkeleton } from '@/components/skeletons';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { ViewDefault } from '@/layouts/ViewDefault';
import {
  subscriptionService,
  type PlanSlug,
  type UpdatePlanData,
} from '@/services/subscriptionService';
import { Plan } from '@/types/subscription';
import { parseApiError, getUserFriendlyMessage, logApiError } from '@/utils/apiErrorHandler';

import { PlanAdminCard, PlansAdminHeader } from './components';

const PLAN_SORT_ORDER: readonly PlanSlug[] = ['free', 'starter', 'pro', 'business', 'open_banking'];

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
    mutationFn: ({ planName, data }: { planName: PlanSlug; data: UpdatePlanData }) =>
      subscriptionService.updatePlan(planName, data),
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
    if (!plans) {
      return [];
    }

    return [...plans].sort((a, b) => {
      const indexA = PLAN_SORT_ORDER.indexOf(a.name as PlanSlug);
      const indexB = PLAN_SORT_ORDER.indexOf(b.name as PlanSlug);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
  }, [plans]);

  const handleEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setShowFormModal(true);
  };

  const handleSubmit = (data: UpdatePlanData) => {
    if (!editingPlan) {
      return;
    }
    updatePlanMutation.mutate({
      planName: editingPlan.name as PlanSlug,
      data,
    });
  };

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">
          <TableSkeleton title="Planos" />
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <div className="flex min-h-[400px] items-center justify-center px-4">
          <div className="max-w-sm text-center">
            <p className="mb-4 text-error">Erro ao carregar planos</p>
            <Button
              type="button"
              className="min-h-[44px]"
              onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-plans'] })}
            >
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
        <div className="container mx-auto px-4 py-6 sm:px-6 sm:py-8">
          <PlansAdminHeader planCount={sortedPlans.length} />

          <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sortedPlans.map((plan) => (
              <PlanAdminCard key={plan.name} plan={plan} onEdit={handleEdit} />
            ))}
          </div>

          {showFormModal && editingPlan ? (
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
          ) : null}
        </div>
      </div>
    </ViewDefault>
  );
}
