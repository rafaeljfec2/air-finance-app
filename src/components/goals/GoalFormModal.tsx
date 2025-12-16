import { useEffect, useState, useMemo } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Target, FileText, DollarSign, Calendar, Tag, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { FormField } from '@/components/ui/FormField';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import { Goal, CreateGoal } from '@/services/goalService';
import { useCompanyStore } from '@/stores/company';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';

interface GoalFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGoal) => void;
  goal?: Goal | null;
  isLoading?: boolean;
}

export function GoalFormModal({
  open,
  onClose,
  onSubmit,
  goal,
  isLoading = false,
}: Readonly<GoalFormModalProps>) {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';
  const { categories } = useCategories(companyId);

  const initialFormState: CreateGoal = useMemo(
    () => ({
      name: '',
      description: '',
      targetAmount: 0,
      currentAmount: 0,
      deadline: '',
      status: 'active',
      categoryId: undefined,
      companyId: companyId,
    }),
    [companyId],
  );

  const [form, setForm] = useState<CreateGoal>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [targetAmountInput, setTargetAmountInput] = useState('');
  const [currentAmountInput, setCurrentAmountInput] = useState('');

  useEffect(() => {
    if (goal) {
      setForm({
        name: goal.name,
        description: goal.description || '',
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: goal.deadline,
        status: goal.status,
        categoryId: goal.categoryId || undefined,
        companyId: goal.companyId,
      });
      setTargetAmountInput(
        goal.targetAmount ? formatCurrencyInput(goal.targetAmount.toFixed(2).replace('.', '')) : '',
      );
      setCurrentAmountInput(
        goal.currentAmount
          ? formatCurrencyInput(goal.currentAmount.toFixed(2).replace('.', ''))
          : '',
      );
    } else {
      setForm({
        ...initialFormState,
        companyId: activeCompany?.id || '',
      });
      setTargetAmountInput('');
      setCurrentAmountInput('');
    }
    setErrors({});
  }, [goal, open, initialFormState, activeCompany]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (form.targetAmount <= 0) errs.targetAmount = 'Valor alvo deve ser maior que zero';
    if (!form.deadline) errs.deadline = 'Data limite obrigatória';
    if (!form.companyId) errs.companyId = 'Selecione uma empresa';
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit(form);
    onClose();
    setForm({
      ...initialFormState,
      companyId: activeCompany?.id || '',
    });
    setErrors({});
    setTargetAmountInput('');
    setCurrentAmountInput('');
  };

  const handleClose = () => {
    setForm({
      ...initialFormState,
      companyId: activeCompany?.id || '',
    });
    setErrors({});
    setTargetAmountInput('');
    setCurrentAmountInput('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title=""
      dismissible={false}
      className="max-w-3xl bg-card dark:bg-card-dark p-0 flex flex-col h-[90vh] max-h-[90vh]"
    >
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Header Customizado */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
              <Target className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text dark:text-text-dark">
                {goal ? 'Editar Meta' : 'Nova Meta'}
              </h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {goal ? 'Atualize as informações da meta' : 'Preencha os dados da nova meta'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-card dark:hover:bg-card-dark text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          <form onSubmit={handleSubmit} id="goal-form" className="space-y-6 py-4">
            {/* Seção: Informações Básicas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Informações Básicas
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nome da meta *" error={errors.name} className="md:col-span-2">
                  <div className="relative">
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ex: Viagem, Reserva de emergência..."
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.name && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>

                <FormField label="Descrição" error={errors.description} className="md:col-span-2">
                  <div className="relative">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                        const { name, value } = e.target;
                        setForm((prev) => ({ ...prev, [name]: value }));
                      }}
                      placeholder="Descreva sua meta..."
                      rows={3}
                      className="w-full bg-background dark:bg-background-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all rounded-md resize-none p-3 pl-10"
                    />
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>

                <FormField label="Categoria" error={errors.categoryId}>
                  <Select
                    value={form.categoryId || undefined}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, categoryId: value || undefined }))
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                        errors.categoryId && 'border-red-500 focus:ring-red-500',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                        <span>
                          {categories?.find((cat) => cat.id === form.categoryId)?.name ||
                            'Selecione...'}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark">
                      {categories && categories.length > 0 ? (
                        categories.map((cat) => (
                          <SelectItem
                            key={cat.id}
                            value={cat.id}
                            className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30"
                          >
                            {cat.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-categories" disabled>
                          Nenhuma categoria disponível
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>

            {/* Seção: Valores */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Valores
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Valor alvo *" error={errors.targetAmount}>
                  <div className="relative">
                    <Input
                      name="targetAmount"
                      type="text"
                      inputMode="decimal"
                      value={targetAmountInput}
                      onChange={(e) => {
                        const formatted = formatCurrencyInput(e.target.value);
                        setTargetAmountInput(formatted);
                        setForm((prev) => ({
                          ...prev,
                          targetAmount: parseCurrency(formatted),
                        }));
                      }}
                      placeholder="R$ 0,00"
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.targetAmount && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>

                <FormField label="Valor atual *" error={errors.currentAmount}>
                  <div className="relative">
                    <Input
                      name="currentAmount"
                      type="text"
                      inputMode="decimal"
                      value={currentAmountInput}
                      onChange={(e) => {
                        const formatted = formatCurrencyInput(e.target.value);
                        setCurrentAmountInput(formatted);
                        setForm((prev) => ({
                          ...prev,
                          currentAmount: parseCurrency(formatted),
                        }));
                      }}
                      placeholder="R$ 0,00"
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.currentAmount && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>
              </div>
            </div>

            {/* Seção: Prazo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Prazo
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Data limite *" error={errors.deadline}>
                  <div className="relative">
                    <Input
                      name="deadline"
                      type="date"
                      value={form.deadline}
                      onChange={handleChange}
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all',
                        errors.deadline && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400 pointer-events-none" />
                  </div>
                </FormField>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Fixo */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border dark:border-border-dark bg-card dark:bg-card-dark flex-shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="goal-form"
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20"
            disabled={isLoading}
          >
            {(() => {
              if (isLoading) return 'Salvando...';
              return goal ? 'Salvar Alterações' : 'Criar Meta';
            })()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
