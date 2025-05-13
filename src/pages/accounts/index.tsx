import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { FormField } from '@/components/ui/FormField';
import { IconPicker } from '@/components/ui/icon-picker';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useAccounts } from '@/hooks/useAccounts';
import { ViewDefault } from '@/layouts/ViewDefault';
import { useCompanyStore } from '@/stores/company';
import { formatCurrency, parseCurrency, formatCurrencyInput } from '@/utils/formatters';
import {
  BanknotesIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';

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
    initialBalance: 0,
    initialBalanceDate: new Date().toISOString().split('T')[0],
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialBalanceInput, setInitialBalanceInput] = useState('');

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      companyId: activeCompany?.id || '',
    }));
  }, [activeCompany]);

  useEffect(() => {
    setInitialBalanceInput(
      form.initialBalance
        ? formatCurrencyInput(form.initialBalance.toFixed(2).replace('.', ''))
        : '',
    );
  }, [form.initialBalance]);

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
    const errs: Record<string, string> = {};
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
      const payload = {
        ...form,
        initialBalanceDate: form.initialBalanceDate
          ? new Date(form.initialBalanceDate).toISOString()
          : null,
      };

      if (editingId) {
        await updateAccount({ id: editingId, data: payload });
        setEditingId(null);
      } else {
        await createAccount(payload);
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
        initialBalance: 0,
        initialBalanceDate: new Date().toISOString().split('T')[0],
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
        initialBalance: account.initialBalance,
        initialBalanceDate: account.initialBalanceDate
          ? account.initialBalanceDate.slice(0, 10)
          : new Date().toISOString().split('T')[0],
      });
      setEditingId(id);
      setInitialBalanceInput(
        account.initialBalance !== undefined && account.initialBalance !== null
          ? formatCurrencyInput(account.initialBalance.toFixed(2).replace('.', ''))
          : '',
      );
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
        <div className="container mx-auto">
          <Loading size="large">Carregando contas bancárias, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    // Trata erro 404 como "empresa não existe" (usando AxiosError)
    const isCompanyNotFound = error instanceof AxiosError && error.response?.status === 404;
    if (isCompanyNotFound) {
      return (
        <ViewDefault>
          <div className="container mx-auto px-2 sm:px-6 py-10 flex flex-col items-center justify-center min-h-[40vh]">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded shadow-md max-w-lg w-full text-center">
              <h2 className="text-lg font-semibold mb-2">Nenhuma empresa encontrada</h2>
              <p className="mb-4">
                Para cadastrar contas bancárias, você precisa criar uma empresa primeiro.
              </p>
              <Button
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => (window.location.href = '/companies')}
              >
                Criar empresa
              </Button>
            </div>
          </div>
        </ViewDefault>
      );
    }
    return (
      <ViewDefault>
        <div className="container mx-auto">
          <div className="text-red-500">Erro ao carregar contas: {error.message}</div>
        </div>
      </ViewDefault>
    );
  }

  if (!activeCompany) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-2 sm:px-6 py-10 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded shadow-md max-w-lg w-full text-center">
            <h2 className="text-lg font-semibold mb-2">Nenhuma empresa encontrada</h2>
            <p className="mb-4">
              Para cadastrar contas bancárias, você precisa criar uma empresa primeiro.
            </p>
            <Button
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => (window.location.href = '/companies')}
            >
              Criar empresa
            </Button>
          </div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="container mx-auto">
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
              <FormField label="Saldo inicial" error={errors.initialBalance}>
                <Input
                  name="initialBalance"
                  type="text"
                  inputMode="decimal"
                  value={initialBalanceInput}
                  onChange={(e) => {
                    const formatted = formatCurrencyInput(e.target.value);
                    setInitialBalanceInput(formatted);
                    setForm((prev) => ({
                      ...prev,
                      initialBalance: parseCurrency(formatted),
                    }));
                  }}
                  placeholder="R$ 0,00"
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Data do saldo inicial" error={errors.initialBalanceDate}>
                <Input
                  name="initialBalanceDate"
                  type="date"
                  value={form.initialBalanceDate}
                  onChange={handleChange}
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
                        initialBalance: 0,
                        initialBalanceDate: new Date().toISOString().split('T')[0],
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
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Saldo inicial: {formatCurrency(account.initialBalance)} em{' '}
                          {new Date(account.initialBalanceDate || '').toLocaleDateString('pt-BR')}
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
