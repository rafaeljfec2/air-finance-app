import { Loading } from '@/components/Loading';
import { RecurringTransactionCard } from '@/components/recurring-transactions/RecurringTransactionCard';
import { RecurringTransactionFormModal } from '@/components/recurring-transactions/RecurringTransactionFormModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useRecurringTransactions } from '@/hooks/useRecurringTransactions';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewDefault } from '@/layouts/ViewDefault';
import { cn } from '@/lib/utils';
import {
  CreateRecurringTransaction,
  RecurringTransaction,
} from '@/services/recurringTransactionService';
import { useCompanyStore } from '@/stores/company';
import { AxiosError } from 'axios';
import { Grid3x3, List, Plus, Repeat, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

const typeOptions = [
  { value: 'Income', label: 'Receita' },
  { value: 'Expense', label: 'Despesa' },
] as const;

const frequencyOptions = [
  { value: 'daily', label: 'Diária' },
  { value: 'weekly', label: 'Semanal' },
  { value: 'monthly', label: 'Mensal' },
  { value: 'yearly', label: 'Anual' },
] as const;

type RecurringTransactionType = (typeof typeOptions)[number]['value'];
type RecurringTransactionFrequency = (typeof frequencyOptions)[number]['value'];

function getTypeLabel(type: RecurringTransactionType): string {
  return typeOptions.find((opt) => opt.value === type)?.label ?? type;
}

function getFrequencyLabel(frequency: RecurringTransactionFrequency): string {
  return frequencyOptions.find((opt) => opt.value === frequency)?.label ?? frequency;
}

export function RecurringTransactionsPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';

  const {
    recurringTransactions,
    isLoading,
    error,
    createRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    isCreating,
    isUpdating,
    isDeleting,
  } = useRecurringTransactions(companyId);

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingRecurringTransaction, setEditingRecurringTransaction] =
    useState<RecurringTransaction | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterFrequency, setFilterFrequency] = useState<string>('all');
  const [viewMode, setViewMode] = useViewMode('recurring-transactions-view-mode');

  const filteredRecurringTransactions = useMemo(() => {
    if (!recurringTransactions) return [];
    return recurringTransactions.filter((rt) => {
      const matchesSearch = rt.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || rt.type === filterType;
      const matchesFrequency = filterFrequency === 'all' || rt.frequency === filterFrequency;
      return matchesSearch && matchesType && matchesFrequency;
    });
  }, [recurringTransactions, searchTerm, filterType, filterFrequency]);

  const handleCreate = () => {
    setEditingRecurringTransaction(null);
    setShowFormModal(true);
  };

  const handleEdit = (recurringTransaction: RecurringTransaction) => {
    setEditingRecurringTransaction(recurringTransaction);
    setShowFormModal(true);
  };

  const handleSubmit = (data: CreateRecurringTransaction) => {
    if (editingRecurringTransaction) {
      updateRecurringTransaction({ id: editingRecurringTransaction.id, data });
    } else {
      createRecurringTransaction(data);
    }
    setShowFormModal(false);
    setEditingRecurringTransaction(null);
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteRecurringTransaction(deleteId);
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
          <Loading size="large">Carregando transações recorrentes, por favor aguarde...</Loading>
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
                Para cadastrar transações recorrentes, você precisa criar uma empresa primeiro.
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
          <div className="text-red-500">
            Erro ao carregar transações recorrentes: {error.message}
          </div>
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
              Para cadastrar transações recorrentes, você precisa criar uma empresa primeiro.
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
      <div className="flex-1 overflow-x-hidden bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Repeat className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">
                  Transações Recorrentes
                </h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie suas receitas e despesas recorrentes para planejamento
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nova Transação Recorrente
            </Button>
          </div>

          {/* Busca e Filtros */}
          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500 w-full sm:w-auto sm:min-w-[140px]">
                    <span>
                      {filterType === 'all'
                        ? 'Todos os tipos'
                        : getTypeLabel(filterType as RecurringTransactionType)}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    {typeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterFrequency} onValueChange={setFilterFrequency}>
                  <SelectTrigger className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500 w-full sm:w-auto sm:min-w-[160px]">
                    <span>
                      {filterFrequency === 'all'
                        ? 'Todas as frequências'
                        : getFrequencyLabel(filterFrequency as RecurringTransactionFrequency)}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
                    <SelectItem value="all">Todas as frequências</SelectItem>
                    {frequencyOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 border border-border dark:border-border-dark rounded-md overflow-hidden bg-background dark:bg-background-dark w-full sm:w-auto">
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

          {/* Lista de Transações Recorrentes */}
          {filteredRecurringTransactions.length === 0 ? (
            <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
              <div className="p-12 text-center">
                <Repeat className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                {(() => {
                  const hasFilters =
                    searchTerm || filterType !== 'all' || filterFrequency !== 'all';
                  const emptyTitle = hasFilters
                    ? 'Nenhuma transação recorrente encontrada'
                    : 'Nenhuma transação recorrente cadastrada';
                  const emptyDescription = hasFilters
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando sua primeira transação recorrente';

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
                          Criar Primeira Transação Recorrente
                        </Button>
                      )}
                    </>
                  );
                })()}
              </div>
            </Card>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRecurringTransactions.map((rt) => (
                    <RecurringTransactionCard
                      key={rt.id}
                      recurringTransaction={rt}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isUpdating={isUpdating}
                      isDeleting={isDeleting}
                      viewMode="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRecurringTransactions.map((rt) => (
                    <RecurringTransactionCard
                      key={rt.id}
                      recurringTransaction={rt}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      isUpdating={isUpdating}
                      isDeleting={isDeleting}
                      viewMode="list"
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <RecurringTransactionFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingRecurringTransaction(null);
        }}
        onSubmit={handleSubmit}
        recurringTransaction={editingRecurringTransaction}
        isLoading={isCreating || isUpdating}
      />
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta transação recorrente? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
