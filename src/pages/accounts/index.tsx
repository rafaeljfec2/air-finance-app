import { AccountFormModal } from '@/components/accounts/AccountFormModal';
import { AccountTableRow } from '@/components/accounts/AccountTableRow';
import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useAccounts } from '@/hooks/useAccounts';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewDefault } from '@/layouts/ViewDefault';
import { cn } from '@/lib/utils';
import { Account, CreateAccount } from '@/services/accountService';
import { useCompanyStore } from '@/stores/company';
import { formatCurrency } from '@/utils/formatters';
import { AxiosError } from 'axios';
import {
  Banknote,
  CreditCard,
  Edit,
  Grid3x3,
  Landmark,
  List,
  Plus,
  Search,
  Trash2,
  Wallet,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const accountTypes = [
  { value: 'checking', label: 'Conta Corrente', icon: Banknote },
  { value: 'savings', label: 'Poupança', icon: Wallet },
  { value: 'credit_card', label: 'Cartão de Crédito', icon: CreditCard },
  { value: 'digital_wallet', label: 'Carteira Digital', icon: Wallet },
  { value: 'investment', label: 'Investimento', icon: Landmark },
] as const;

type AccountType = (typeof accountTypes)[number]['value'];

function getTypeLabel(type: AccountType): string {
  return accountTypes.find((t) => t.value === type)?.label ?? type;
}

function getTypeBadgeColor(type: AccountType): string {
  const colors: Record<AccountType, string> = {
    checking: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    savings: 'bg-green-500/20 text-green-400 border-green-500/30',
    credit_card: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    digital_wallet: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    investment: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };
  return colors[type] ?? colors.checking;
}

export function AccountsPage() {
  const {
    accounts,
    isLoading,
    error,
    createAccount,
    updateAccount,
    deleteAccount,
    isCreating,
    isUpdating,
    isDeleting,
  } = useAccounts();
  const { activeCompany } = useCompanyStore();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useViewMode('accounts-view-mode');

  const filteredAccounts = useMemo(() => {
    if (!accounts) return [];
    return accounts.filter((account) => {
      const matchesSearch =
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (account.agency && account.agency.includes(searchTerm)) ||
        (account.accountNumber && account.accountNumber.includes(searchTerm));
      const matchesType = filterType === 'all' || account.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [accounts, searchTerm, filterType]);

  const handleCreate = () => {
    setEditingAccount(null);
    setShowFormModal(true);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setShowFormModal(true);
  };

  const handleSubmit = (data: CreateAccount) => {
    if (!activeCompany?.id) return;

    if (editingAccount) {
      updateAccount({ id: editingAccount.id, data });
    } else {
      createAccount(data);
    }
    setShowFormModal(false);
    setEditingAccount(null);
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteAccount(deleteId);
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
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <Loading size="large">Carregando contas bancárias, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    const isCompanyNotFound = error instanceof AxiosError && error.response?.status === 404;
    if (isCompanyNotFound) {
      return (
        <ViewDefault>
          <div className="container mx-auto px-2 sm:px-6 py-10 flex flex-col items-center justify-center min-h-[40vh]">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded shadow-md max-w-lg w-full text-center">
              <h2 className="text-lg font-semibold mb-2">Nenhuma empresa selecionada</h2>
              <p className="mb-4">
                Para cadastrar contas bancárias, você precisa criar uma empresa primeiro.
              </p>
              <Button
                className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => {
                  globalThis.location.href = '/companies';
                }}
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
        <div className="container mx-auto px-4 sm:px-6 py-10">
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
            <h2 className="text-lg font-semibold mb-2">Nenhuma empresa selecionada</h2>
            <p className="mb-4">
              Para cadastrar contas bancárias, você precisa criar uma empresa primeiro.
            </p>
            <Button
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                globalThis.location.href = '/companies';
              }}
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
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Banknote className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">
                  Contas Bancárias
                </h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie suas contas bancárias e investimentos
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nova Conta
            </Button>
          </div>

          {/* Busca e Filtros */}
          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por nome, instituição, agência ou conta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500">
                    <span>
                      {filterType === 'all' ? 'Todos os tipos' : getTypeLabel(filterType as AccountType)}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {accountTypes.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 border border-border dark:border-border-dark rounded-md overflow-hidden bg-background dark:bg-background-dark">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'flex-1 rounded-none border-0',
                      viewMode === 'grid'
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark',
                    )}
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'flex-1 rounded-none border-0',
                      viewMode === 'list'
                        ? 'bg-primary-500 text-white hover:bg-primary-600'
                        : 'text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark',
                    )}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Lista de Contas */}
          {filteredAccounts.length === 0 ? (
            <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
              <div className="p-12 text-center">
                <Banknote className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                {(() => {
                  const hasFilters = searchTerm || filterType !== 'all';
                  const emptyTitle = hasFilters
                    ? 'Nenhuma conta encontrada'
                    : 'Nenhuma conta cadastrada';
                  const emptyDescription = hasFilters
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando sua primeira conta bancária';

                  return (
                    <>
                      <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
                        {emptyTitle}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                        {emptyDescription}
                      </p>
                      {!hasFilters && (
                        <Button
                          onClick={handleCreate}
                          className="bg-primary-500 hover:bg-primary-600 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Criar Primeira Conta
                        </Button>
                      )}
                    </>
                  );
                })()}
              </div>
            </Card>
          ) : (
            <>
              {/* Grid View - Mobile only, Desktop when selected */}
              <div className={viewMode === 'grid' ? 'block' : 'block md:hidden'}>
                <div className="grid grid-cols-1 gap-6">
                  {filteredAccounts.map((account) => {
                    const Icon =
                      accountTypes.find((t) => t.value === account.type)?.icon || Banknote;
                    return (
                      <Card
                        key={account.id}
                        className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm hover:shadow-lg transition-shadow"
                      >
                        <div className="p-6">
                          {/* Header do Card */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: account.color }}
                              >
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-1 truncate">
                                  {account.name}
                                </h3>
                                <span
                                  className={cn(
                                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                                    getTypeBadgeColor(account.type),
                                  )}
                                >
                                  {getTypeLabel(account.type)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Informações */}
                          <div className="space-y-2 mb-4">
                            <div className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                                Instituição:{' '}
                              </span>
                              <span className="text-text dark:text-text-dark">
                                {account.institution}
                              </span>
                            </div>

                            {account.type === 'credit_card' ? (
                              <>
                                <div className="text-sm">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Limite:{' '}
                                  </span>
                                  <span className="text-text dark:text-text-dark font-mono">
                                    {formatCurrency(account.creditLimit || 0)}
                                  </span>
                                </div>
                                <div className="text-sm pt-2 border-t border-border dark:border-border-dark">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Saldo Atual:{' '}
                                  </span>
                                  <span className="text-text dark:text-text-dark font-semibold text-lg">
                                    {formatCurrency(account.balance)}
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="text-sm">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Agência:{' '}
                                  </span>
                                  <span className="text-text dark:text-text-dark font-mono">
                                    {account.agency}
                                  </span>
                                </div>
                                <div className="text-sm">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Conta:{' '}
                                  </span>
                                  <span className="text-text dark:text-text-dark font-mono">
                                    {account.accountNumber}
                                  </span>
                                </div>
                                <div className="text-sm pt-2 border-t border-border dark:border-border-dark">
                                  <span className="text-gray-500 dark:text-gray-400">
                                    Saldo:{' '}
                                  </span>
                                  <span className="text-text dark:text-text-dark font-semibold text-lg">
                                    {formatCurrency(account.balance)}
                                  </span>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Ações */}
                          <div className="flex gap-2 pt-4 border-t border-border dark:border-border-dark">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(account)}
                              disabled={isUpdating}
                              className="flex-1 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(account.id)}
                              disabled={isDeleting}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* List View - Only visible on desktop when viewMode === 'list' */}
              <div className={viewMode === 'list' ? 'hidden md:block' : 'hidden'}>
                <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border dark:border-border-dark">
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Conta
                          </th>
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Instituição
                          </th>
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Detalhes
                          </th>
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Saldo
                          </th>
                          <th className="text-right p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAccounts.map((account) => (
                          <AccountTableRow
                            key={account.id}
                            account={account}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isUpdating={isUpdating}
                            isDeleting={isDeleting}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <AccountFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingAccount(null);
        }}
        onSubmit={handleSubmit}
        account={editingAccount}
        isLoading={isCreating || isUpdating}
      />
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão de conta"
        description={
          <div className="space-y-3">
            <p className="font-semibold">Tem certeza que deseja excluir esta conta?</p>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
                ⚠️ Atenção: Esta ação irá deletar:
              </p>
              <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
                <li>Todos os registros de transações vinculados a esta conta</li>
                <li>Todos os registros de extrato vinculados a esta conta</li>
                <li>A própria conta</li>
              </ul>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Esta ação não pode ser desfeita.
            </p>
          </div>
        }
        confirmLabel="Excluir tudo"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
