import React, { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Button } from '@/components/ui/button';
import {
  BanknotesIcon,
  CreditCardIcon,
  WalletIcon,
  BuildingLibraryIcon,
} from '@heroicons/react/24/outline';
import { FormField } from '@/components/ui/FormField';
import { useAccounts, Account } from '@/hooks/useAccounts';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

const accountTypes = [
  { value: 'corrente', label: 'Corrente', icon: BanknotesIcon },
  { value: 'poupanca', label: 'Poupança', icon: WalletIcon },
  { value: 'cartao', label: 'Cartão', icon: CreditCardIcon },
  { value: 'carteira', label: 'Carteira', icon: WalletIcon },
  { value: 'outro', label: 'Outro', icon: BuildingLibraryIcon },
];

export default function AccountsPage() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();
  const [form, setForm] = useState<Account>({
    id: '',
    name: '',
    type: 'corrente',
    initialBalance: '',
    color: '#8A05BE',
    icon: 'BanknotesIcon',
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
    if (!form.initialBalance || isNaN(Number(form.initialBalance)))
      errs.initialBalance = 'Saldo inicial obrigatório';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    const { id, ...accountData } = form;
    if (editingId) {
      await updateAccount(editingId, accountData);
      setEditingId(null);
    } else {
      await addAccount(accountData);
    }
    setForm({
      id: '',
      name: '',
      type: 'corrente',
      initialBalance: '',
      color: '#8A05BE',
      icon: 'BanknotesIcon',
    });
    setErrors({});
  };

  const handleEdit = (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    if (acc) {
      setForm(acc);
      setEditingId(id);
    }
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (deleteId) await deleteAccount(deleteId);
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
          <BanknotesIcon className="h-6 w-6 text-primary-500" /> Contas Bancárias
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Nome da conta" error={errors.name}>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex: Nubank, Itaú, Carteira..."
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Tipo">
                <Select name="type" value={form.type} onChange={handleChange} required>
                  {accountTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              <FormField label="Saldo inicial" error={errors.initialBalance}>
                <Input
                  name="initialBalance"
                  type="number"
                  min="0"
                  value={form.initialBalance}
                  onChange={handleChange}
                  placeholder="0,00"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Cor">
                <ColorPicker value={form.color} onChange={handleColorChange} />
              </FormField>
              <FormField label="Ícone">
                <IconPicker
                  value={form.icon}
                  onChange={handleIconChange}
                  options={accountTypes.map((t) => ({
                    value: t.icon.displayName || t.icon.name || t.value,
                    icon: t.icon,
                  }))}
                />
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button type="submit" color="primary">
                  {editingId ? 'Salvar Alterações' : 'Adicionar Conta'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    color="secondary"
                    onClick={() => {
                      setForm({
                        id: '',
                        name: '',
                        type: 'corrente',
                        initialBalance: '',
                        color: '#8A05BE',
                        icon: 'BanknotesIcon',
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
            <h2 className="text-lg font-semibold mb-4">Minhas Contas</h2>
            <ul className="divide-y divide-border dark:divide-border-dark">
              {accounts.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhuma conta cadastrada.</li>
              )}
              {accounts.map((acc) => {
                const Icon = accountTypes.find((t) => t.value === acc.type)?.icon || BanknotesIcon;
                return (
                  <li key={acc.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <span
                        className="inline-flex items-center justify-center rounded-full"
                        style={{ background: acc.color, width: 32, height: 32 }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </span>
                      <div>
                        <div className="font-medium text-text dark:text-text-dark">{acc.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {accountTypes.find((t) => t.value === acc.type)?.label}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-text dark:text-text-dark">
                        R${' '}
                        {Number(acc.initialBalance).toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <Button size="sm" color="secondary" onClick={() => handleEdit(acc.id)}>
                        Editar
                      </Button>
                      <Button size="sm" color="danger" onClick={() => handleDelete(acc.id)}>
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
              Tem certeza que deseja excluir esta conta?
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
