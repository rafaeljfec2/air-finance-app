import React, { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/FormField';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useGoals } from '@/hooks/useGoals';
import { useCategories } from '@/hooks/useCategories';
import { useCompanyStore } from '@/store/company';
import { FlagIcon } from '@heroicons/react/24/outline';
import { formatCurrency, parseCurrency, formatCurrencyInput } from '@/utils/formatters';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CreateGoal, Goal } from '@/services/goalService';
import { Category } from '@/services/categoryService';

interface FormErrors {
  name?: string;
  description?: string;
  targetAmount?: string;
  currentAmount?: string;
  deadline?: string;
  categoryId?: string;
  companyId?: string;
}

const calculateProgress = (current: number, target: number) => {
  return Math.min(Math.round((current / target) * 100), 100);
};

interface GoalItemProps {
  goal: Goal;
  category?: Category;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}

const GoalItem = ({ goal, category, onEdit, onDelete, isUpdating, isDeleting }: GoalItemProps) => {
  const { data: progressData } = useGoals(goal.companyId).getProgress(goal.id);
  const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
  const daysUntilDeadline = progressData?.daysUntilDeadline || 0;

  return (
    <li key={goal.id} className="py-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: category?.color || '#6B7280' }}
          >
            {category?.icon ? (
              <span className="text-white">{category.icon}</span>
            ) : (
              <FlagIcon className="h-5 w-5 text-white" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-medium text-text dark:text-text-dark">{goal.name}</div>
            {goal.description && (
              <div className="text-sm text-gray-500 dark:text-gray-400">{goal.description}</div>
            )}
            <div className="mt-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>{progress}% concluído</span>
                <span>
                  {formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}
                </span>
              </div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {category?.name && <span className="mr-2">{category.name} • </span>}
              <span>
                {format(new Date(goal.deadline), "dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </span>
              {daysUntilDeadline > 0 && (
                <span className="ml-2">• {daysUntilDeadline} dias restantes</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
            onClick={() => onEdit(goal.id)}
            disabled={isUpdating}
          >
            Editar
          </Button>
          <Button
            size="sm"
            className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
            onClick={() => onDelete(goal.id)}
            disabled={isDeleting}
          >
            Excluir
          </Button>
        </div>
      </div>
    </li>
  );
};

export function GoalsPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';

  const {
    goals,
    isLoading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    isCreating,
    isUpdating,
    isDeleting,
  } = useGoals(companyId);

  const { categories } = useCategories(companyId);

  const [form, setForm] = useState<CreateGoal>({
    name: '',
    description: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: '',
    status: 'active',
    categoryId: '',
    companyId,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'targetAmount' || name === 'currentAmount') {
      const formattedValue = formatCurrencyInput(value);
      setForm((prev) => ({ ...prev, [name]: parseCurrency(formattedValue) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (form.targetAmount <= 0) errs.targetAmount = 'Valor alvo deve ser maior que zero';
    if (!form.deadline) errs.deadline = 'Data limite obrigatória';
    if (!form.companyId) errs.companyId = 'Selecione uma empresa';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      if (editingId) {
        await updateGoal({ id: editingId, data: form });
        setEditingId(null);
      } else {
        await createGoal(form);
      }
      setForm({
        name: '',
        description: '',
        targetAmount: 0,
        currentAmount: 0,
        deadline: '',
        status: 'active',
        categoryId: '',
        companyId,
      });
      setErrors({});
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
    }
  };

  const handleEdit = (id: string) => {
    const goal = goals?.find((g) => g.id === id);
    if (goal) {
      setForm({
        name: goal.name,
        description: goal.description || '',
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        deadline: goal.deadline,
        status: goal.status,
        categoryId: goal.categoryId || '',
        companyId: goal.companyId,
      });
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      try {
        await deleteGoal(deleteId);
      } catch (error) {
        console.error('Erro ao deletar meta:', error);
      }
    }
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  if (isLoading) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-2 sm:px-6 py-10">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-2 sm:px-6 py-10">
          <div className="text-red-500">Erro ao carregar metas: {error.message}</div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark mb-6 flex items-center gap-2">
          <FlagIcon className="h-6 w-6 text-primary-500" /> Objetivos / Metas
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Nome da meta" error={errors.name}>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex: Viagem, Reserva de emergência..."
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Descrição" error={errors.description}>
                <Input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Descreva sua meta..."
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Valor alvo" error={errors.targetAmount}>
                <Input
                  name="targetAmount"
                  value={formatCurrency(form.targetAmount)}
                  onChange={handleChange}
                  placeholder="R$ 0,00"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Valor atual" error={errors.currentAmount}>
                <Input
                  name="currentAmount"
                  value={formatCurrency(form.currentAmount)}
                  onChange={handleChange}
                  placeholder="R$ 0,00"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Data limite" error={errors.deadline}>
                <Input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Categoria" error={errors.categoryId}>
                <Select
                  value={form.categoryId}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors">
                    {categories?.find((cat) => cat.id === form.categoryId)?.name || 'Selecione...'}
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors">
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                  disabled={isCreating || isUpdating}
                >
                  {editingId ? 'Salvar Alterações' : 'Adicionar Meta'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    size="sm"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                    onClick={() => {
                      setForm({
                        name: '',
                        description: '',
                        targetAmount: 0,
                        currentAmount: 0,
                        deadline: '',
                        status: 'active',
                        categoryId: '',
                        companyId,
                      });
                      setEditingId(null);
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>
          {/* Listagem */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Minhas Metas</h2>
            <ul className="divide-y divide-border dark:divide-border-dark">
              {goals?.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhuma meta cadastrada.</li>
              )}
              {goals?.map((goal) => {
                const category = categories?.find((c) => c.id === goal.categoryId);
                return (
                  <GoalItem
                    key={goal.id}
                    goal={goal}
                    category={category}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                  />
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta meta? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
