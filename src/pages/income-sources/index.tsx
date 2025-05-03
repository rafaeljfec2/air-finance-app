import React, { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/FormField';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useIncomeSources, IncomeSource } from '@/hooks/useIncomeSources';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const typeOptions = [
  { value: 'salary', label: 'Salário' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'investment', label: 'Investimento' },
  { value: 'business', label: 'Negócios' },
  { value: 'other', label: 'Outro' },
];

const recurrenceOptions = [
  { value: 'monthly', label: 'Mensal' },
  { value: 'eventual', label: 'Eventual' },
  { value: 'annual', label: 'Anual' },
];

export function IncomeSourcesPage() {
  const { incomeSources, addIncomeSource, updateIncomeSource, deleteIncomeSource } =
    useIncomeSources();
  const [form, setForm] = useState<IncomeSource>({
    id: '',
    name: '',
    type: '',
    recurrence: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs: any = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (!form.type) errs.type = 'Tipo obrigatório';
    if (!form.recurrence) errs.recurrence = 'Recorrência obrigatória';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const { id, ...incomeSourceData } = form;
    if (editingId) {
      await updateIncomeSource(editingId, incomeSourceData);
      setEditingId(null);
    } else {
      await addIncomeSource(incomeSourceData);
    }
    setForm({ id: '', name: '', type: '', recurrence: '' });
    setErrors({});
  };

  const handleEdit = (id: string) => {
    const source = incomeSources.find((i) => i.id === id);
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
    if (deleteId) await deleteIncomeSource(deleteId);
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
          <CurrencyDollarIcon className="h-6 w-6 text-primary-500" /> Fontes de Receita
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Nome da fonte" error={errors.name}>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex: Salário, Freelance, Investimento..."
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Tipo" error={errors.type}>
                <Select name="type" value={form.type} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  {typeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Recorrência" error={errors.recurrence}>
                <Select name="recurrence" value={form.recurrence} onChange={handleChange} required>
                  <option value="">Selecione...</option>
                  {recurrenceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button type="submit" color="primary">
                  {editingId ? 'Salvar Alterações' : 'Adicionar Fonte'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setForm({ id: '', name: '', type: '', recurrence: '' });
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
            <h2 className="text-lg font-semibold mb-4">Minhas Fontes</h2>
            <ul className="divide-y divide-border dark:divide-border-dark">
              {incomeSources.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhuma fonte cadastrada.</li>
              )}
              {incomeSources.map((source) => (
                <li key={source.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-text dark:text-text-dark">{source.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Tipo: {typeOptions.find((t) => t.value === source.type)?.label || '-'} •
                      Recorrência:{' '}
                      {recurrenceOptions.find((r) => r.value === source.recurrence)?.label || '-'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" color="secondary" onClick={() => handleEdit(source.id)}>
                      Editar
                    </Button>
                    <Button size="sm" color="danger" onClick={() => handleDelete(source.id)}>
                      Excluir
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
        <ConfirmModal
          open={showConfirmDelete}
          title="Confirmar exclusão"
          description={
            <>
              Tem certeza que deseja excluir esta fonte?
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
