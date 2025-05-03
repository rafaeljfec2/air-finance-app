import React, { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/FormField';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useIncomeSources } from '@/hooks/useIncomeSources';
import { useCompanyContext } from '@/contexts/companyContext';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/utils/formatters';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CreateIncomeSource } from '@/services/incomeSourceService';

export function IncomeSourcesPage() {
  const { companyId } = useCompanyContext() as { companyId: string };
  const {
    incomeSources,
    isLoading,
    error,
    createIncomeSource,
    updateIncomeSource,
    deleteIncomeSource,
    isCreating,
    isUpdating,
    isDeleting,
  } = useIncomeSources();

  const [form, setForm] = useState<CreateIncomeSource>({
    name: '',
    description: '',
    type: 'fixed',
    amount: 0,
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    status: 'active',
    companyId: companyId || '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      const numericValue = parseFloat(value.replace(/[^\d]/g, '')) / 100;
      setForm((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const errs: any = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (form.amount <= 0) errs.amount = 'Valor deve ser maior que zero';
    if (!form.startDate) errs.startDate = 'Data de início obrigatória';
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
        await updateIncomeSource({ id: editingId, data: form });
        setEditingId(null);
      } else {
        await createIncomeSource(form);
      }
      setForm({
        name: '',
        description: '',
        type: 'fixed',
        amount: 0,
        frequency: 'monthly',
        startDate: '',
        endDate: '',
        status: 'active',
        companyId: companyId || '',
      });
      setErrors({});
    } catch (error) {
      console.error('Erro ao salvar fonte de receita:', error);
    }
  };

  const handleEdit = (id: string) => {
    const source = incomeSources?.find((s) => s.id === id);
    if (source) {
      setForm({
        name: source.name,
        description: source.description || '',
        type: source.type,
        amount: source.amount,
        frequency: source.frequency,
        startDate: source.startDate,
        endDate: source.endDate || '',
        status: source.status,
        companyId: source.companyId,
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
        await deleteIncomeSource(deleteId);
      } catch (error) {
        console.error('Erro ao deletar fonte de receita:', error);
      }
    }
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'fixed':
        return 'Fixa';
      case 'variable':
        return 'Variável';
      case 'passive':
        return 'Passiva';
      default:
        return type;
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'Diária';
      case 'weekly':
        return 'Semanal';
      case 'monthly':
        return 'Mensal';
      case 'yearly':
        return 'Anual';
      default:
        return frequency;
    }
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
          <div className="text-red-500">Erro ao carregar fontes de receita: {error.message}</div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark mb-6 flex items-center gap-2">
          <CurrencyDollarIcon className="h-6 w-6 text-primary-500" /> Fontes de Receita
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Nome" error={errors.name}>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex: Salário, Freelance, Investimentos..."
                  required
                />
              </FormField>

              <FormField label="Descrição" error={errors.description}>
                <Input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Descrição detalhada da fonte de receita"
                />
              </FormField>

              <FormField label="Tipo" error={errors.type}>
                <Select name="type" value={form.type} onChange={handleChange} required>
                  <option value="fixed">Fixa</option>
                  <option value="variable">Variável</option>
                  <option value="passive">Passiva</option>
                </Select>
              </FormField>

              <FormField label="Valor" error={errors.amount}>
                <Input
                  name="amount"
                  type="number"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="R$ 0,00"
                  required
                  min="0"
                  step="0.01"
                />
              </FormField>

              <FormField label="Frequência" error={errors.frequency}>
                <Select name="frequency" value={form.frequency} onChange={handleChange} required>
                  <option value="daily">Diária</option>
                  <option value="weekly">Semanal</option>
                  <option value="monthly">Mensal</option>
                  <option value="yearly">Anual</option>
                </Select>
              </FormField>

              <FormField label="Data de Início" error={errors.startDate}>
                <Input
                  name="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                />
              </FormField>

              <FormField label="Data de Término (opcional)">
                <Input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
              </FormField>

              <FormField label="Status" error={errors.status}>
                <Select name="status" value={form.status} onChange={handleChange} required>
                  <option value="active">Ativa</option>
                  <option value="inactive">Inativa</option>
                </Select>
              </FormField>

              <div className="flex gap-2 mt-4">
                <Button type="submit" color="primary" disabled={isCreating || isUpdating}>
                  {editingId ? 'Salvar Alterações' : 'Adicionar Fonte de Receita'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setForm({
                        name: '',
                        description: '',
                        type: 'fixed',
                        amount: 0,
                        frequency: 'monthly',
                        startDate: '',
                        endDate: '',
                        status: 'active',
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
            <h2 className="text-lg font-semibold mb-4">Minhas Fontes de Receita</h2>
            <ul className="divide-y divide-border dark:divide-border-dark">
              {incomeSources?.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhuma fonte de receita cadastrada.</li>
              )}
              {incomeSources?.map((source) => (
                <li key={source.id} className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-text dark:text-text-dark">{source.name}</div>
                      {source.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {source.description}
                        </div>
                      )}
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded bg-primary-100 text-primary-800">
                          {getTypeLabel(source.type)}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-800">
                          {getFrequencyLabel(source.frequency)}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            source.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {source.status === 'active' ? 'Ativa' : 'Inativa'}
                        </span>
                      </div>
                      <div className="mt-2">
                        <div className="text-sm font-semibold">
                          {formatCurrency(source.amount)} por{' '}
                          {getFrequencyLabel(source.frequency).toLowerCase()}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Início:{' '}
                          {format(new Date(source.startDate), "dd 'de' MMMM 'de' yyyy", {
                            locale: ptBR,
                          })}
                          {source.endDate &&
                            ` • Término: ${format(
                              new Date(source.endDate),
                              "dd 'de' MMMM 'de' yyyy",
                              {
                                locale: ptBR,
                              },
                            )}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="secondary"
                        onClick={() => handleEdit(source.id)}
                        disabled={isUpdating}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        onClick={() => handleDelete(source.id)}
                        disabled={isDeleting}
                      >
                        Excluir
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta fonte de receita? Esta ação não poderá ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
