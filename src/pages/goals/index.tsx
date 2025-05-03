import React, { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/FormField';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useGoals, Goal } from '@/hooks/useGoals';
import { useCategories } from '@/hooks/useCategories';
import { FlagIcon } from '@heroicons/react/24/outline';

function formatCurrency(value: string | number) {
  const number =
    typeof value === 'number' ? value : Number(value.replace(/[^\d,.-]/g, '').replace(',', '.'));
  if (isNaN(number)) return '';
  return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();
  const { categories } = useCategories();
  const [form, setForm] = useState<Goal>({
    id: '',
    name: '',
    targetValue: 0,
    dueDate: '',
    categoryId: '',
  });
  const [targetValueInput, setTargetValueInput] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'targetValue') {
      // Permitir apenas números, vírgula e ponto
      const raw = value.replace(/[^\d,\.]/g, '');
      setTargetValueInput(raw);
      setForm((prev) => ({ ...prev, targetValue: parseFloat(raw.replace(',', '.')) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTargetValueBlur = () => {
    setTargetValueInput(form.targetValue ? formatCurrency(form.targetValue) : '');
  };

  React.useEffect(() => {
    if (editingId) {
      setTargetValueInput(form.targetValue ? formatCurrency(form.targetValue) : '');
    } else if (!form.targetValue) {
      setTargetValueInput('');
    }
  }, [editingId]);

  const validate = () => {
    const errs: any = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (!form.targetValue || Number(form.targetValue) <= 0)
      errs.targetValue = 'Valor alvo inválido';
    if (!form.dueDate) errs.dueDate = 'Data limite obrigatória';
    if (!form.categoryId) errs.categoryId = 'Categoria obrigatória';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const { id, ...goalData } = form;
    if (editingId) {
      await updateGoal(editingId, goalData);
      setEditingId(null);
    } else {
      await addGoal(goalData);
    }
    setForm({ id: '', name: '', targetValue: 0, dueDate: '', categoryId: '' });
    setTargetValueInput('');
    setErrors({});
  };

  const handleEdit = (id: string) => {
    const goal = goals.find((g) => g.id === id);
    if (goal) {
      setForm(goal);
      setTargetValueInput(goal.targetValue ? formatCurrency(goal.targetValue) : '');
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) await deleteGoal(deleteId);
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

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
              <FormField label="Valor alvo" error={errors.targetValue}>
                <Input
                  name="targetValue"
                  type="text"
                  inputMode="decimal"
                  value={targetValueInput}
                  onChange={handleChange}
                  onBlur={handleTargetValueBlur}
                  placeholder="R$ 0,00"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Data limite" error={errors.dueDate}>
                <Input
                  name="dueDate"
                  type="date"
                  value={form.dueDate}
                  onChange={handleChange}
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Categoria associada" error={errors.categoryId}>
                <Select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button type="submit" color="primary">
                  {editingId ? 'Salvar Alterações' : 'Adicionar Meta'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setForm({ id: '', name: '', targetValue: 0, dueDate: '', categoryId: '' });
                      setTargetValueInput('');
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
              {goals.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhuma meta cadastrada.</li>
              )}
              {goals.map((goal) => {
                const category = categories.find((c) => c.id === goal.categoryId);
                return (
                  <li key={goal.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center justify-center rounded-full"
                        style={{ background: category?.color || '#eee', width: 32, height: 32 }}
                      >
                        {category?.icon ? (
                          <span className="text-white">
                            {/* Pode-se usar um componente de ícone real aqui se disponível */}
                            {category.icon}
                          </span>
                        ) : (
                          <FlagIcon className="h-5 w-5 text-white" />
                        )}
                      </span>
                      <div>
                        <div className="font-medium text-text dark:text-text-dark">{goal.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {category?.name || 'Sem categoria'} • Limite:{' '}
                          {goal.dueDate ? new Date(goal.dueDate).toLocaleDateString('pt-BR') : '-'}
                        </div>
                        <div className="text-sm font-semibold text-text dark:text-text-dark">
                          Valor alvo: {formatCurrency(goal.targetValue)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" color="secondary" onClick={() => handleEdit(goal.id)}>
                        Editar
                      </Button>
                      <Button size="sm" color="danger" onClick={() => handleDelete(goal.id)}>
                        Excluir
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
        <ConfirmModal
          open={showConfirmDelete}
          title="Confirmar exclusão"
          description={
            <>
              Tem certeza que deseja excluir esta meta?
              <br />
              Esta ação não poderá ser desfeita.
            </>
          }
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          danger
        />
      </div>
    </ViewDefault>
  );
}
