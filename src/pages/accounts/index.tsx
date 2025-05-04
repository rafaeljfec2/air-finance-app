import React, { useState, useEffect } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
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
import { useAccounts } from '@/hooks/useAccounts';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useCompanyContext } from '@/contexts/companyContext';
import { formatCurrency } from '@/utils/format';
import { useCompanyStore } from '@/store/company';

const accountTypes = [
  { value: 'checking', label: 'Conta Corrente', icon: BanknotesIcon },
  { value: 'savings', label: 'Poupança', icon: WalletIcon },
  { value: 'credit_card', label: 'Cartão de Crédito', icon: CreditCardIcon },
  { value: 'digital_wallet', label: 'Carteira Digital', icon: WalletIcon },
  { value: 'investment', label: 'Investimento', icon: BuildingLibraryIcon },
] as const;

type AccountType = (typeof accountTypes)[number]['value'];

export function AccountsPage() {
  const {
    accounts,
    isLoading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    isUpdating,
    isDeleting,
  } = useAccounts();
  const { activeCompany } = useCompanyStore();

  const [form, setForm] = useState({
    name: '',
    type: 'checking' as AccountType,
    institution: '',
    agency: '',
    accountNumber: '',
    color: '#8A05BE',
    icon: 'BanknotesIcon',
    companyId: activeCompany?.id || '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      companyId: activeCompany?.id || '',
    }));
  }, [activeCompany]);

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
    if (!form.institution.trim()) errs.institution = 'Instituição obrigatória';
    if (!form.agency.trim()) errs.agency = 'Agência obrigatória';
    if (!form.accountNumber.trim()) errs.accountNumber = 'Número da conta obrigatório';
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
        await updateAccount({ id: editingId, data: form });
        setEditingId(null);
      } else {
        await createAccount(form);
      }
      setForm({
        name: '',
        type: 'checking',
        institution: '',
        agency: '',
        accountNumber: '',
        color: '#8A05BE',
        icon: 'BanknotesIcon',
        companyId: activeCompany?.id || '',
      });
      setErrors({});
    } catch (error) {
      console.error('Erro ao salvar conta:', error);
    }
  };

  const handleEdit = (id: string) => {
    const account = accounts?.find((a) => a.id === id);
    if (account) {
      setForm({
        name: account.name,
        type: account.type as AccountType,
        institution: account.institution,
        agency: account.agency,
        accountNumber: account.accountNumber,
        color: account.color,
        icon: account.icon,
        companyId: account.companyId,
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
        await deleteAccount(deleteId);
      } catch (error) {
        console.error('Erro ao deletar conta:', error);
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
          <div className="text-red-500">Erro ao carregar contas: {error.message}</div>
        </div>
      </ViewDefault>
    );
  }

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
                  placeholder="Ex: Conta Principal"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Tipo de conta" error={errors.type}>
                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, type: value as AccountType }))
                  }
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark">
                    {accountTypes.find((t) => t.value === form.type)?.label || 'Selecione...'}
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark">
                    {accountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Instituição" error={errors.institution}>
                <Input
                  name="institution"
                  value={form.institution}
                  onChange={handleChange}
                  placeholder="Ex: Banco do Brasil"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Agência" error={errors.agency}>
                <Input
                  name="agency"
                  value={form.agency}
                  onChange={handleChange}
                  placeholder="0000"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Número da conta" error={errors.accountNumber}>
                <Input
                  name="accountNumber"
                  value={form.accountNumber}
                  onChange={handleChange}
                  placeholder="00000-0"
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
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                >
                  {editingId ? 'Salvar Alterações' : 'Adicionar Conta'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    size="sm"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                    onClick={() => {
                      setForm({
                        name: '',
                        type: 'checking',
                        institution: '',
                        agency: '',
                        accountNumber: '',
                        color: '#8A05BE',
                        icon: 'BanknotesIcon',
                        companyId: activeCompany?.id || '',
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
              {accounts?.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhuma conta cadastrada.</li>
              )}
              {accounts?.map((account) => {
                const Icon =
                  accountTypes.find((t) => t.value === account.type)?.icon || BanknotesIcon;
                return (
                  <li key={account.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: account.color }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-text dark:text-text-dark">
                          {account.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {account.institution} • Ag: {account.agency} • CC: {account.accountNumber}
                        </div>
                        <div className="text-sm font-semibold text-text dark:text-text-dark">
                          Saldo: {formatCurrency(account.balance)}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                        onClick={() => handleEdit(account.id)}
                        disabled={isUpdating}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                        onClick={() => handleDelete(account.id)}
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
        description="Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
