import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/FormField';
import { Switch } from '@/components/ui/switch';
import { Plan } from '@/types/subscription';
import { UpdatePlanData } from '@/services/subscriptionService';
import { Loader2, X, CreditCard, DollarSign, Settings, Sparkles, Trash2 } from 'lucide-react';

interface PlanFormModalProps {
  open: boolean;
  plan: Plan;
  onClose: () => void;
  onSubmit: (data: UpdatePlanData) => void;
  isLoading?: boolean;
}

export function PlanFormModal({
  open,
  plan,
  onClose,
  onSubmit,
  isLoading = false,
}: PlanFormModalProps) {
  const [formData, setFormData] = useState<UpdatePlanData>({
    priceMonthly: plan.priceMonthly ?? plan.price ?? 0,
    displayPrice: plan.displayPrice || `R$ ${(plan.priceMonthly ?? plan.price ?? 0).toFixed(2)}`,
    stripePriceId: plan.stripePriceId,
    features: plan.features || [],
    limits: {
      maxAccounts: plan.limits?.maxAccounts ?? 2,
      maxCards: plan.limits?.maxCards ?? 2,
      aiEnabled: plan.limits?.aiEnabled ?? false,
      bankIntegrationEnabled: plan.limits?.bankIntegrationEnabled ?? false,
      multiUser: plan.limits?.multiUser ?? false,
      multiCompany: plan.limits?.multiCompany ?? false,
    },
    highlight: plan.highlight ?? false,
  });

  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (plan) {
      setFormData({
        priceMonthly: plan.priceMonthly ?? plan.price ?? 0,
        displayPrice:
          plan.displayPrice || `R$ ${(plan.priceMonthly ?? plan.price ?? 0).toFixed(2)}`,
        stripePriceId: plan.stripePriceId,
        features: plan.features || [],
        limits: {
          maxAccounts: plan.limits?.maxAccounts ?? 2,
          maxCards: plan.limits?.maxCards ?? 2,
          aiEnabled: plan.limits?.aiEnabled ?? false,
          bankIntegrationEnabled: plan.limits?.bankIntegrationEnabled ?? false,
          multiUser: plan.limits?.multiUser ?? false,
          multiCompany: plan.limits?.multiCompany ?? false,
        },
        highlight: plan.highlight ?? false,
      });
      setNewFeature('');
    }
  }, [plan]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setNewFeature('');
    onClose();
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), newFeature.trim()],
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index),
    });
  };

  const handleLimitChange = (
    key:
      | 'maxAccounts'
      | 'maxCards'
      | 'aiEnabled'
      | 'bankIntegrationEnabled'
      | 'multiUser'
      | 'multiCompany',
    value: number | boolean,
  ) => {
    if (!formData.limits) return;
    setFormData({
      ...formData,
      limits: {
        ...formData.limits,
        [key]: value,
      },
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title=""
      dismissible={false}
      className="max-w-4xl bg-card dark:bg-card-dark p-0 flex flex-col"
    >
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Header Customizado */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
              <CreditCard className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text dark:text-text-dark">
                Editar Plano: {plan.name.toUpperCase()}
              </h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                Configure os limites e recursos do plano de assinatura
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="min-h-[44px] min-w-[44px] p-2 rounded-lg hover:bg-card dark:hover:bg-card-dark text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 px-6">
          <form id="plan-form" onSubmit={handleSubmit} className="space-y-6 py-6">
            {/* Informações de Preço */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-primary-500" />
                <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                  Informações de Preço
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Preço Mensal (R$)" error="">
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.priceMonthly || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, priceMonthly: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="29.90"
                    className="min-h-[44px]"
                  />
                </FormField>

                <FormField label="Preço de Exibição">
                  <Input
                    type="text"
                    value={formData.displayPrice || ''}
                    onChange={(e) => setFormData({ ...formData, displayPrice: e.target.value })}
                    placeholder="R$ 29,90"
                    className="min-h-[44px]"
                  />
                </FormField>
              </div>

              <FormField label="Stripe Price ID">
                <Input
                  type="text"
                  value={formData.stripePriceId || ''}
                  onChange={(e) => setFormData({ ...formData, stripePriceId: e.target.value })}
                  placeholder="price_..."
                  className="min-h-[44px]"
                />
              </FormField>
            </div>

            {/* Limites */}
            <div className="space-y-4 border-t border-border dark:border-border-dark pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Settings className="h-5 w-5 text-primary-500" />
                <h3 className="text-lg font-semibold text-text dark:text-text-dark">Limites</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Máximo de Contas">
                  <div className="space-y-1">
                    <Input
                      type="number"
                      min="-1"
                      value={formData.limits?.maxAccounts ?? 2}
                      onChange={(e) =>
                        handleLimitChange('maxAccounts', parseInt(e.target.value) || 0)
                      }
                      className="min-h-[44px]"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Use -1 para ilimitado
                    </p>
                  </div>
                </FormField>

                <FormField label="Máximo de Cartões">
                  <div className="space-y-1">
                    <Input
                      type="number"
                      min="-1"
                      value={formData.limits?.maxCards ?? 2}
                      onChange={(e) => handleLimitChange('maxCards', parseInt(e.target.value) || 0)}
                      className="min-h-[44px]"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Use -1 para ilimitado
                    </p>
                  </div>
                </FormField>
              </div>
            </div>

            {/* Recursos Habilitados */}
            <div className="space-y-4 border-t border-border dark:border-border-dark pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary-500" />
                <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                  Recursos Habilitados
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text dark:text-text-dark">
                      Inteligência Artificial
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Habilitar recursos de IA
                    </span>
                  </div>
                  <Switch
                    checked={formData.limits?.aiEnabled ?? false}
                    onCheckedChange={(checked) => handleLimitChange('aiEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text dark:text-text-dark">
                      Integração Bancária
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Conexão com bancos
                    </span>
                  </div>
                  <Switch
                    checked={formData.limits?.bankIntegrationEnabled ?? false}
                    onCheckedChange={(checked) =>
                      handleLimitChange('bankIntegrationEnabled', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text dark:text-text-dark">
                      Multi-Usuário
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Múltiplos usuários por empresa
                    </span>
                  </div>
                  <Switch
                    checked={formData.limits?.multiUser ?? false}
                    onCheckedChange={(checked) => handleLimitChange('multiUser', checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-text dark:text-text-dark">
                      Múltiplos Perfis
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Criar vários perfis
                    </span>
                  </div>
                  <Switch
                    checked={formData.limits?.multiCompany ?? false}
                    onCheckedChange={(checked) => handleLimitChange('multiCompany', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Lista de Recursos */}
            <div className="space-y-4 border-t border-border dark:border-border-dark pt-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary-500" />
                <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                  Lista de Recursos
                </h3>
              </div>

              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Adicionar novo recurso..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                  className="min-h-[44px] flex-1"
                />
                <Button
                  type="button"
                  onClick={addFeature}
                  variant="outline"
                  className="min-h-[44px] text-sm font-medium bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
                >
                  Adicionar
                </Button>
              </div>

              <div className="space-y-2">
                {formData.features && formData.features.length > 0 ? (
                  formData.features.map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <span className="text-sm text-text dark:text-text-dark flex-1">
                        {feature}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 min-h-[44px] min-w-[44px]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 border border-dashed border-border dark:border-border-dark rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nenhum recurso adicionado
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      Adicione recursos acima
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Destacar Plano */}
            <div className="border-t border-border dark:border-border-dark pt-6">
              <div className="flex items-center justify-between p-4 bg-card dark:bg-card-dark rounded-lg border border-border dark:border-border-dark">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-text dark:text-text-dark">
                    Destacar Plano
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Marcar como &quot;Recomendado&quot; na página de preços
                  </span>
                </div>
                <Switch
                  checked={formData.highlight ?? false}
                  onCheckedChange={(checked) => setFormData({ ...formData, highlight: checked })}
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border dark:border-border-dark flex-shrink-0 bg-card dark:bg-card-dark">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="min-h-[44px] text-sm font-medium bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="plan-form"
            disabled={isLoading}
            className="bg-primary-500 hover:bg-primary-600 text-white min-h-[44px] text-sm font-medium"
          >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Salvar Alterações
          </Button>
        </div>
      </div>
    </Modal>
  );
}
