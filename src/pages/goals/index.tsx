import React, { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/FormField';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useGoals } from '@/hooks/useGoals';
import { useCategories } from '@/hooks/useCategories';
import { useCompanyContext } from '@/contexts/companyContext';
import { FlagIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/formatters';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CreateGoal } from '@/services/goalService';

export function GoalsPage() {
  const { companyId } = useCompanyContext() as { companyId: string };
  const {
    goals,
    isLoading,
    error,
    createGoal,
    updateGoal,
    deleteGoal,
    getProgress,
    isCreating,
    isUpdating,
    isDeleting,
  } = useGoals();
  const { categories } = useCategories();

  const [form, setForm] = useState<CreateGoal>({
    name: '',
    description: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: '',
    status: 'active',
    categoryId: '',
    companyId: companyId || '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'targetAmount' || name === 'currentAmount') {
      const numericValue = parseFloat(value.replace(/[^\d]/g, '')) / 100;
      setForm((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const errs: any = {};
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
        companyId: companyId || '',
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

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
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
                />
              </FormField>
              <FormField label="Descrição" error={errors.description}>
                <Input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Descreva sua meta..."
                />
              </FormField>
              <FormField label="Valor alvo" error={errors.targetAmount}>
                <Input
                  name="targetAmount"
                  type="number"
                  value={form.targetAmount}
                  onChange={handleChange}
                  placeholder="R$ 0,00"
                  required
                />
              </FormField>
              <FormField label="Valor atual" error={errors.currentAmount}>
                <Input
                  name="currentAmount"
                  type="number"
                  value={form.currentAmount}
                  onChange={handleChange}
                  placeholder="R$ 0,00"
                  required
                />
              </FormField>
              <FormField label="Data limite" error={errors.deadline}>
                <Input
                  name="deadline"
                  type="date"
                  value={form.deadline}
                  onChange={handleChange}
                  required
                />
              </FormField>
              <FormField label="Categoria" error={errors.categoryId}>
                <Select name="categoryId" value={form.categoryId} onChange={handleChange}>
                  <option value="">Selecione...</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button type="submit" color="primary" disabled={isCreating || isUpdating}>
                  {editingId ? 'Salvar Alterações' : 'Adicionar Meta'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setForm({
                        name: '',
                        description: '',
                        targetAmount: 0,
                        currentAmount: 0,
                        deadline: '',
                        status: 'active',
                        categoryId: '',
                        companyId: companyId || '',
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
                const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
                const { data: progressData } = getProgress(goal.id);
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
                          <div className="font-medium text-text dark:text-text-dark">
                            {goal.name}
                          </div>
                          {goal.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {goal.description}
                            </div>
                          )}
                          <div className="mt-2">
                            <Progress value={progress} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span>{progress}% concluído</span>
                              <span>
                                {formatCurrency(goal.currentAmount)} /{' '}
                                {formatCurrency(goal.targetAmount)}
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
                          color="secondary"
                          onClick={() => handleEdit(goal.id)}
                          disabled={isUpdating}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          color="danger"
                          onClick={() => handleDelete(goal.id)}
                          disabled={isDeleting}
                        >
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </li>
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
