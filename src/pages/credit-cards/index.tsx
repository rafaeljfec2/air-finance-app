import React, { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Button } from '@/components/ui/button';
import {
  CreditCardIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { FormField } from '@/components/ui/FormField';
import { useCreditCards, CreditCard } from '@/hooks/useCreditCards';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

const bankTypes = [
  { value: 'nubank', label: 'Nubank', icon: CreditCardIcon },
  { value: 'itau', label: 'Itaú', icon: BanknotesIcon },
  { value: 'bradesco', label: 'Bradesco', icon: BanknotesIcon },
  { value: 'santander', label: 'Santander', icon: BanknotesIcon },
  { value: 'bb', label: 'Banco do Brasil', icon: BanknotesIcon },
  { value: 'caixa', label: 'Caixa Econômica', icon: BanknotesIcon },
  { value: 'outro', label: 'Outro', icon: BuildingLibraryIcon },
];

const dueDates = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}${i + 1 === 1 ? 'º' : 'º'} dia`,
}));

export function CreditCardsPage() {
  const { creditCards, addCreditCard, updateCreditCard, deleteCreditCard } = useCreditCards();
  const [form, setForm] = useState<CreditCard>({
    id: '',
    name: '',
    bank: 'nubank',
    limit: 0,
    dueDate: 10,
    color: '#8A05BE',
    icon: 'CreditCardIcon',
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
    if (!form.bank) errs.bank = 'Banco obrigatório';
    if (!form.limit || form.limit <= 0) errs.limit = 'Limite inválido';
    if (!form.dueDate || form.dueDate < 1 || form.dueDate > 31)
      errs.dueDate = 'Dia de vencimento inválido';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const { id, ...creditCardData } = form;
    if (editingId) {
      await updateCreditCard(editingId, creditCardData);
      setEditingId(null);
    } else {
      await addCreditCard(creditCardData);
    }
    setForm({
      id: '',
      name: '',
      bank: 'nubank',
      limit: 0,
      dueDate: 10,
      color: '#8A05BE',
      icon: 'CreditCardIcon',
    });
    setErrors({});
  };

  const handleEdit = (id: string) => {
    const card = creditCards.find((c) => c.id === id);
    if (card) {
      setForm(card);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) await deleteCreditCard(deleteId);
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
          <CreditCardIcon className="h-6 w-6 text-primary-500" /> Cartões de Crédito
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Nome do cartão" error={errors.name}>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex: Nubank Ultravioleta, Itaú Platinum..."
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Banco" error={errors.bank}>
                <Select name="bank" value={form.bank} onChange={handleChange} required>
                  {bankTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Limite" error={errors.limit}>
                <Input
                  name="limit"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.limit}
                  onChange={handleChange}
                  placeholder="0,00"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Dia do vencimento" error={errors.dueDate}>
                <Select name="dueDate" value={form.dueDate} onChange={handleChange} required>
                  {dueDates.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Cor">
                <ColorPicker value={form.color} onChange={handleColorChange} />
              </FormField>
              <FormField label="Ícone">
                <IconPicker
                  value={form.icon}
                  onChange={handleIconChange}
                  options={bankTypes.map((t) => ({
                    value: t.icon.displayName || t.icon.name || t.value,
                    icon: t.icon,
                  }))}
                />
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button type="submit" color="primary">
                  {editingId ? 'Salvar Alterações' : 'Adicionar Cartão'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setForm({
                        id: '',
                        name: '',
                        bank: 'nubank',
                        limit: 0,
                        dueDate: 10,
                        color: '#8A05BE',
                        icon: 'CreditCardIcon',
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
              {creditCards.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhum cartão cadastrado.</li>
              )}
              {creditCards.map((card) => {
                const Icon = bankTypes.find((t) => t.value === card.bank)?.icon || CreditCardIcon;
                return (
                  <li key={card.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center justify-center rounded-full"
                        style={{ background: card.color, width: 32, height: 32 }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </span>
                      <div>
                        <div className="font-medium text-text dark:text-text-dark">{card.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {bankTypes.find((t) => t.value === card.bank)?.label} • Vencimento:{' '}
                          {card.dueDate}º dia
                        </div>
                        <div className="text-sm font-semibold text-text dark:text-text-dark">
                          Limite: R${' '}
                          {Number(card.limit).toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" color="secondary" onClick={() => handleEdit(card.id)}>
                        Editar
                      </Button>
                      <Button size="sm" color="danger" onClick={() => handleDelete(card.id)}>
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
              Tem certeza que deseja excluir este cartão?
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
