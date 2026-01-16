import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DatePicker } from '@/components/ui/DatePicker';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { toast } from '@/components/ui/toast';
import { useIncomeSources } from '@/hooks/useIncomeSources';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import { IncomeSource } from '@/types/incomeSource';
import { formatDate, formatDateToLocalISO } from '@/utils/date';
import { formatCurrency, formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import React, { useEffect, useState } from 'react';

export function IncomeSourcesPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';
  const { incomeSources, loading, error, addIncomeSource, updateIncomeSource, deleteIncomeSource } =
    useIncomeSources(companyId);
  const [form, setForm] = useState<Omit<IncomeSource, 'id' | 'createdAt' | 'updatedAt'>>({
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setForm((prev) => ({ ...prev, companyId: companyId || '' }));
  }, [companyId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      const formattedValue = formatCurrencyInput(value);
      setForm((prev) => ({ ...prev, [name]: parseCurrency(formattedValue) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
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
        updateIncomeSource({ id: editingId, data: form });
        setEditingId(null);
      } else {
        addIncomeSource(form);
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
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: 'Erro ao salvar fonte de receita',
          description: err.message,
          type: 'error',
        });
      } else {
        toast({
          title: 'Erro ao salvar fonte de receita',
          description: 'Erro desconhecido',
          type: 'error',
        });
      }
    }
  };

  const handleEdit = (id: string) => {
    const source = incomeSources.find((s) => s.id === id);
    if (source) {
      setForm(source);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) deleteIncomeSource(deleteId);
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

  const renderIncomeSources = () => {
    if (loading) {
      return <div className="text-center py-4">Carregando...</div>;
    }

    if (incomeSources.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">Nenhuma fonte de receita cadastrada.</div>
      );
    }

    return (
      <div className="space-y-4">
        {incomeSources.map((source) => (
          <div key={source.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold">{source.name}</h3>
                {source.description && (
                  <p className="text-sm text-gray-600">{source.description}</p>
                )}
                <div className="flex gap-2 mt-1">
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
              </div>
              <div className="flex gap-2">
                <Button size="sm" color="secondary" onClick={() => handleEdit(source.id)}>
                  Editar
                </Button>
                <Button size="sm" color="danger" onClick={() => handleDelete(source.id)}>
                  Excluir
                </Button>
              </div>
            </div>
            <div className="mt-2">
              <div className="text-sm font-semibold">
                {formatCurrency(source.amount)} por{' '}
                {getFrequencyLabel(source.frequency).toLowerCase()}
              </div>
              <div className="text-xs text-gray-500">
                Início: {formatDate(source.startDate)}
                {source.endDate && ` • Término: ${formatDate(source.endDate)}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <ViewDefault>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Fontes de Receita</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

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
                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, type: value as IncomeSource['type'] }))
                  }
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors">
                    {getTypeLabel(form.type)}
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                    <SelectItem value="fixed">Fixa</SelectItem>
                    <SelectItem value="variable">Variável</SelectItem>
                    <SelectItem value="passive">Passiva</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Valor" error={errors.amount}>
                <Input
                  name="amount"
                  inputMode="decimal"
                  value={formatCurrency(form.amount)}
                  onChange={handleChange}
                  placeholder="R$ 0,00"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>

              <FormField label="Frequência" error={errors.frequency}>
                <Select
                  value={form.frequency}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, frequency: value as IncomeSource['frequency'] }))
                  }
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors">
                    {getFrequencyLabel(form.frequency)}
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                    <SelectItem value="daily">Diária</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensal</SelectItem>
                    <SelectItem value="yearly">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <FormField label="Data de Início" error={errors.startDate}>
                <DatePicker
                  value={form.startDate || undefined}
                  onChange={(date) => {
                    const dateString = date ? formatDateToLocalISO(date) : '';
                    handleChange({
                      target: { name: 'startDate', value: dateString },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  placeholder="Selecionar data de início"
                  error={errors.startDate}
                  className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                />
              </FormField>

              <FormField label="Data de Término (opcional)">
                <DatePicker
                  value={form.endDate || undefined}
                  onChange={(date) => {
                    const dateString = date ? formatDateToLocalISO(date) : '';
                    handleChange({
                      target: { name: 'endDate', value: dateString },
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}
                  placeholder="Selecionar data de término"
                  className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                />
              </FormField>

              <FormField label="Status" error={errors.status}>
                <Select
                  value={form.status}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, status: value as IncomeSource['status'] }))
                  }
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors">
                    {form.status === 'active' ? 'Ativa' : 'Inativa'}
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>

              <div className="flex gap-2">
                <Button type="submit" color="primary">
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
            {renderIncomeSources()}
          </Card>
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
      </div>
    </ViewDefault>
  );
}
