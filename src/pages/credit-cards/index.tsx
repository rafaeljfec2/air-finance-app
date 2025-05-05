import React, { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Button } from '@/components/ui/button';
import { CreditCardIcon, BanknotesIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';
import { FormField } from '@/components/ui/FormField';
import { useCreditCards } from '@/hooks/useCreditCards';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useCompanyContext } from '@/contexts/companyContext';
import { toast } from '@/components/ui/toast';

const bankTypes = [
  { value: 'nubank', label: 'Nubank', icon: CreditCardIcon },
  { value: 'itau', label: 'Itaú', icon: BanknotesIcon },
  { value: 'bradesco', label: 'Bradesco', icon: BanknotesIcon },
  { value: 'santander', label: 'Santander', icon: BanknotesIcon },
  { value: 'bb', label: 'Banco do Brasil', icon: BanknotesIcon },
  { value: 'caixa', label: 'Caixa Econômica', icon: BanknotesIcon },
  { value: 'outro', label: 'Outro', icon: BuildingLibraryIcon },
] as const;

const dueDates = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}${i + 1 === 1 ? 'º' : 'º'} dia`,
}));

export function CreditCardsPage() {
  const { companyId } = useCompanyContext() as { companyId: string };
  const {
    creditCards,
    isLoading,
    error,
    createCreditCard,
    updateCreditCard,
    deleteCreditCard,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCreditCards(companyId);

  const [form, setForm] = useState({
    name: '',
    number: '',
    holderName: '',
    expirationDate: '',
    cvv: '',
    limit: 0,
    closingDay: 10,
    dueDay: 10,
    color: '#8A05BE',
    icon: 'CreditCardIcon',
    companyId: companyId || '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (color: string) => {
    setForm((prev) => ({ ...prev, color }));
  };

  const handleIconChange = (icon: string) => {
    setForm((prev) => ({ ...prev, icon }));
  };

  const validate = () => {
    const errs: any = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (!form.number.trim()) errs.number = 'Número do cartão obrigatório';
    if (!form.holderName.trim()) errs.holderName = 'Nome do titular obrigatório';
    if (!form.expirationDate) errs.expirationDate = 'Data de validade obrigatória';
    if (!form.cvv) errs.cvv = 'CVV obrigatório';
    if (!form.limit || form.limit <= 0) errs.limit = 'Limite inválido';
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
        await updateCreditCard({ id: editingId, data: form });
        setEditingId(null);
      } else {
        await createCreditCard(form);
      }
      setForm({
        name: '',
        number: '',
        holderName: '',
        expirationDate: '',
        cvv: '',
        limit: 0,
        closingDay: 10,
        dueDay: 10,
        color: '#8A05BE',
        icon: 'CreditCardIcon',
        companyId: companyId || '',
      });
      setErrors({});
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: `Erro ao salvar cartão: ${error.message || 'Erro desconhecido.'}`,
        type: 'error',
      });
      console.error('Erro ao salvar cartão:', error);
    }
  };

  const handleEdit = (id: string) => {
    const card = creditCards?.find((c) => c.id === id);
    if (card) {
      setForm({
        name: card.name,
        number: card.number,
        holderName: card.holderName,
        expirationDate: card.expirationDate,
        cvv: card.cvv,
        limit: card.limit,
        closingDay: card.closingDay,
        dueDay: card.dueDay,
        color: card.color,
        icon: card.icon,
        companyId: card.companyId,
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
        await deleteCreditCard(deleteId);
      } catch (error: any) {
        toast({
          title: 'Erro',
          description: `Erro ao deletar cartão: ${error.message || 'Erro desconhecido.'}`,
          type: 'error',
        });
        console.error('Erro ao deletar cartão:', error);
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
        <div className="container mx-auto">
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
    toast({
      title: 'Erro',
      description: `Erro ao carregar cartões: ${error.message || 'Erro desconhecido.'}`,
      type: 'error',
    });
    return (
      <ViewDefault>
        <div className="container mx-auto">
          <div className="text-red-500">Erro ao carregar cartões: {error.message}</div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="container mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark mb-6 flex items-center gap-2">
          <CreditCardIcon className="h-6 w-6 text-primary-500" /> Cartões de Crédito
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
                  placeholder="Nome do cartão"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>

              <FormField label="Limite" error={errors.limit}>
                <Input
                  name="limit"
                  type="number"
                  value={form.limit}
                  onChange={handleChange}
                  placeholder="R$ 0,00"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Dia de fechamento" error={errors.closingDay}>
                <Select
                  value={String(form.closingDay)}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, closingDay: Number(value) }))
                  }
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                    {dueDates.find((d) => d.value === form.closingDay)?.label || 'Selecione...'}
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark max-h-60 overflow-y-auto">
                    {dueDates.map((d) => (
                      <SelectItem
                        key={d.value}
                        value={String(d.value)}
                        className="hover:bg-primary-100 dark:hover:bg-primary-900 focus:bg-primary-100 dark:focus:bg-primary-900"
                      >
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Dia de vencimento" error={errors.dueDay}>
                <Select
                  value={String(form.dueDay)}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, dueDay: Number(value) }))}
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                    {dueDates.find((d) => d.value === form.dueDay)?.label || 'Selecione...'}
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark max-h-60 overflow-y-auto">
                    {dueDates.map((d) => (
                      <SelectItem
                        key={d.value}
                        value={String(d.value)}
                        className="hover:bg-primary-100 dark:hover:bg-primary-900 focus:bg-primary-100 dark:focus:bg-primary-900"
                      >
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Cor">
                <ColorPicker
                  value={form.color}
                  onChange={handleColorChange}
                  className="bg-card dark:bg-card-dark border border-border dark:border-border-dark transition-colors"
                />
              </FormField>
              <FormField label="Ícone">
                <IconPicker
                  value={form.icon}
                  onChange={handleIconChange}
                  options={bankTypes.map((t) => ({
                    value: t.icon.displayName || t.icon.name || t.value,
                    icon: t.icon,
                  }))}
                  className="bg-card dark:bg-card-dark border border-border dark:border-border-dark transition-colors"
                />
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                  disabled={isCreating || isUpdating}
                >
                  {editingId ? 'Salvar Alterações' : 'Adicionar Cartão'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    size="sm"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                    onClick={() => {
                      setForm({
                        name: '',
                        number: '',
                        holderName: '',
                        expirationDate: '',
                        cvv: '',
                        limit: 0,
                        closingDay: 10,
                        dueDay: 10,
                        color: '#8A05BE',
                        icon: 'CreditCardIcon',
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
            <h2 className="text-lg font-semibold mb-4">Meus Cartões</h2>
            <ul className="divide-y divide-border dark:divide-border-dark">
              {creditCards?.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhum cartão cadastrado.</li>
              )}
              {creditCards?.map((card) => {
                const Icon =
                  bankTypes.find((t) => t.icon.displayName === card.icon)?.icon || CreditCardIcon;
                return (
                  <li key={card.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: card.color }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-text dark:text-text-dark">{card.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          {bankTypes.find((t) => t.icon.displayName === card.icon)?.label} •
                          Vencimento: {card.dueDay}º dia
                        </div>
                        <div className="text-sm font-semibold text-text dark:text-text-dark">
                          Limite: R${' '}
                          {Number(card.limit).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                        onClick={() => handleEdit(card.id)}
                        disabled={isUpdating}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                        onClick={() => handleDelete(card.id)}
                        disabled={isDeleting}
                      >
                        Excluir
                      </Button>
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
        description="Tem certeza que deseja excluir este cartão? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
