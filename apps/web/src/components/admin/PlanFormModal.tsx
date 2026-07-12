import { Loader2, X, CreditCard, DollarSign, Settings, Sparkles, Trash2, Star } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { Switch } from '@/components/ui/switch';
import { UpdatePlanData } from '@/services/subscriptionService';
import { Plan } from '@/types/subscription';
import { formatPlanDisplayName } from '@/utils/planAdminDisplay';

interface PlanFormModalProps {
  readonly open: boolean;
  readonly plan: Plan;
  readonly onClose: () => void;
  readonly onSubmit: (data: UpdatePlanData) => void;
  readonly isLoading?: boolean;
}

interface SectionProps {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly children: React.ReactNode;
}

function Section({ icon, title, children }: Readonly<SectionProps>) {
  return (
    <section className="rounded-2xl border border-border bg-background/60 p-4 dark:border-border-dark dark:bg-background-dark/40 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 text-primary-500 dark:bg-primary-400/10 dark:text-primary-400">
          {icon}
        </span>
        <h3 className="text-base font-semibold text-text dark:text-text-dark">{title}</h3>
      </div>
      {children}
    </section>
  );
}

interface ToggleRowProps {
  readonly title: string;
  readonly description: string;
  readonly checked: boolean;
  readonly onCheckedChange: (checked: boolean) => void;
}

function ToggleRow({ title, description, checked, onCheckedChange }: Readonly<ToggleRowProps>) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-3.5 dark:border-border-dark dark:bg-card-dark sm:p-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-text dark:text-text-dark">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function PlanFormModal({ open, plan, onClose, onSubmit, isLoading = false }: PlanFormModalProps) {
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
    if (!formData.limits) {
      return;
    }
    setFormData({
      ...formData,
      limits: {
        ...formData.limits,
        [key]: value,
      },
    });
  };

  const displayName = formatPlanDisplayName(plan.name);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title=""
      dismissible={false}
      className="flex max-h-[min(92vh,880px)] max-w-3xl flex-col bg-card p-0 dark:bg-card-dark"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border px-4 pb-4 pt-5 dark:border-border-dark sm:px-6 sm:pt-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/10 dark:bg-primary-400/10">
              <CreditCard className="h-5 w-5 text-primary-500 dark:text-primary-400" aria-hidden />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-tight text-text dark:text-text-dark sm:text-xl">
                Editar plano: {displayName}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Ajuste preço, limites e recursos ·{' '}
                <span className="font-mono text-xs">{plan.name}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-muted hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:hover:text-gray-200"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 sm:px-6">
          <form id="plan-form" onSubmit={handleSubmit} className="space-y-4 py-5 sm:space-y-5">
            <ToggleRow
              title="Destacar plano"
              description='Exibe o selo "Recomendado" na página de preços'
              checked={formData.highlight ?? false}
              onCheckedChange={(checked) => setFormData({ ...formData, highlight: checked })}
            />

            <Section icon={<DollarSign className="h-4 w-4" aria-hidden />} title="Preço">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Preço mensal (R$)" error="">
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

                <FormField label="Preço de exibição">
                  <Input
                    type="text"
                    value={formData.displayPrice || ''}
                    onChange={(e) => setFormData({ ...formData, displayPrice: e.target.value })}
                    placeholder="R$ 29,90"
                    className="min-h-[44px]"
                  />
                </FormField>
              </div>

              <div className="mt-4">
                <FormField label="Stripe Price ID">
                  <Input
                    type="text"
                    value={formData.stripePriceId || ''}
                    onChange={(e) => setFormData({ ...formData, stripePriceId: e.target.value })}
                    placeholder="price_..."
                    className="min-h-[44px] font-mono text-sm"
                  />
                </FormField>
              </div>
            </Section>

            <Section icon={<Settings className="h-4 w-4" aria-hidden />} title="Limites">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Máximo de contas">
                  <div className="space-y-1">
                    <Input
                      type="number"
                      min="-1"
                      value={formData.limits?.maxAccounts ?? 2}
                      onChange={(e) =>
                        handleLimitChange('maxAccounts', parseInt(e.target.value, 10) || 0)
                      }
                      className="min-h-[44px]"
                    />
                    <p className="text-xs text-muted-foreground">Use -1 para ilimitado</p>
                  </div>
                </FormField>

                <FormField label="Máximo de cartões">
                  <div className="space-y-1">
                    <Input
                      type="number"
                      min="-1"
                      value={formData.limits?.maxCards ?? 2}
                      onChange={(e) =>
                        handleLimitChange('maxCards', parseInt(e.target.value, 10) || 0)
                      }
                      className="min-h-[44px]"
                    />
                    <p className="text-xs text-muted-foreground">Use -1 para ilimitado</p>
                  </div>
                </FormField>
              </div>
            </Section>

            <Section
              icon={<Sparkles className="h-4 w-4" aria-hidden />}
              title="Recursos habilitados"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <ToggleRow
                  title="Inteligência artificial"
                  description="Habilitar recursos de IA"
                  checked={formData.limits?.aiEnabled ?? false}
                  onCheckedChange={(checked) => handleLimitChange('aiEnabled', checked)}
                />
                <ToggleRow
                  title="Integração bancária"
                  description="Conexão com bancos"
                  checked={formData.limits?.bankIntegrationEnabled ?? false}
                  onCheckedChange={(checked) =>
                    handleLimitChange('bankIntegrationEnabled', checked)
                  }
                />
                <ToggleRow
                  title="Multi-usuário"
                  description="Múltiplos usuários por empresa"
                  checked={formData.limits?.multiUser ?? false}
                  onCheckedChange={(checked) => handleLimitChange('multiUser', checked)}
                />
                <ToggleRow
                  title="Múltiplos perfis"
                  description="Criar vários perfis"
                  checked={formData.limits?.multiCompany ?? false}
                  onCheckedChange={(checked) => handleLimitChange('multiCompany', checked)}
                />
              </div>
            </Section>

            <Section icon={<Star className="h-4 w-4" aria-hidden />} title="Lista de recursos">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Adicionar novo recurso..."
                  onKeyDown={(e) => {
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
                  className="min-h-[44px] shrink-0 border-border bg-card text-sm font-medium text-text hover:bg-muted dark:border-border-dark dark:bg-card-dark dark:text-text-dark"
                >
                  Adicionar
                </Button>
              </div>

              <div className="mt-3 space-y-2">
                {formData.features && formData.features.length > 0 ? (
                  formData.features.map((feature, index) => (
                    <div
                      key={`${feature}-${index}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2.5 dark:border-border-dark dark:bg-card-dark"
                    >
                      <span className="min-w-0 flex-1 text-sm text-text dark:text-text-dark">
                        {feature}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                        className="min-h-[44px] min-w-[44px] text-error hover:bg-error/10 hover:text-error"
                        aria-label={`Remover recurso ${feature}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center dark:border-border-dark">
                    <p className="text-sm text-muted-foreground">Nenhum recurso adicionado</p>
                    <p className="mt-1 text-xs text-muted-foreground/80">
                      Adicione itens da lista de benefícios do plano
                    </p>
                  </div>
                )}
              </div>
            </Section>
          </form>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-card px-4 py-4 dark:border-border-dark dark:bg-card-dark sm:flex-row sm:justify-end sm:gap-3 sm:px-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="min-h-[44px] border-border bg-background text-sm font-medium text-text hover:bg-muted dark:border-border-dark dark:bg-background-dark dark:text-text-dark"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="plan-form"
            disabled={isLoading}
            className="min-h-[44px] bg-primary-500 text-sm font-medium text-white hover:bg-primary-600"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
            Salvar alterações
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export { PlanFormModal };
