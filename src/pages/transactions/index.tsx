import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Receipt, Search, Plus, Calendar, Filter, Download } from 'lucide-react';
import {
  TransactionGrid,
  type TransactionGridTransaction,
} from '@/components/transactions/TransactionGrid';
import { useCompanyStore } from '@/stores/company';
import { useTransactions } from '@/hooks/useTransactions';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { toast } from '@/components/ui/toast';
import { AccountEditModal } from '@/components/accounts/AccountEditModal';
import { useAccounts } from '@/hooks/useAccounts';

export function Transactions() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<TransactionGridTransaction | null>(
    null,
  );
  const [showAccountModal, setShowAccountModal] = useState(false);

  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id ?? '';
  const { accounts } = useAccounts();
  const {
    transactions = [],
    isLoading,
    isFetching,
    refetch,
    deleteTransaction,
  } = useTransactions(companyId);

  const filteredTransactions = [...transactions]
    .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
    .filter((transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === 'all' ||
        (selectedType === 'RECEITA' && transaction.launchType === 'revenue') ||
        (selectedType === 'DESPESA' && transaction.launchType === 'expense');

      let matchesPeriod = true;
      if (selectedPeriod !== 'all') {
        const transactionDate = new Date(transaction.paymentDate);
        const now = new Date();

        switch (selectedPeriod) {
          case 'current':
            matchesPeriod =
              transactionDate.getMonth() === now.getMonth() &&
              transactionDate.getFullYear() === now.getFullYear();
            break;
          case 'last': {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
            matchesPeriod =
              transactionDate.getMonth() === lastMonth.getMonth() &&
              transactionDate.getFullYear() === lastMonth.getFullYear();
            break;
          }
        }
      }

      return matchesSearch && matchesType && matchesPeriod;
    });

  const handleEdit = () => {
    setShowAccountModal(true);
  };

  const handleDelete = (transaction: TransactionGridTransaction) => {
    setTransactionToDelete(transaction);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (!transactionToDelete) return;
    try {
      await Promise.resolve(deleteTransaction(transactionToDelete.id));
      toast({
        title: 'Transação excluída',
        description: 'A transação foi excluída com sucesso.',
        type: 'success',
      });
      setShowConfirmDelete(false);
      setTransactionToDelete(null);
    } catch {
      toast({
        title: 'Erro ao excluir',
        description: 'Não foi possível excluir a transação. Tente novamente.',
        type: 'error',
      });
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setTransactionToDelete(null);
  };

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Receipt className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">Fluxo de Caixa</h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie seu fluxo de caixa
              </p>
            </div>
            <Button
              onClick={() => navigate('/transactions/new')}
              className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Novo lançamento
            </Button>
          </div>

          {/* Filters and Search */}
          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto_auto] gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar transação..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500">
                      {selectedPeriod === '' ? (
                        <span className="text-muted-foreground">Selecione o período</span>
                      ) : null}
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
                      <SelectItem value="all">Todos os períodos</SelectItem>
                      <SelectItem value="current">Mês atual</SelectItem>
                      <SelectItem value="last">Mês anterior</SelectItem>
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500">
                      {selectedType === '' ? (
                        <span className="text-muted-foreground">Selecione o tipo</span>
                      ) : null}
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark">
                      <SelectItem value="all">Todos os tipos</SelectItem>
                      <SelectItem value="RECEITA">Receitas</SelectItem>
                      <SelectItem value="DESPESA">Despesas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => {
                    refetch();
                  }}
                  className="bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Pesquisar
                </Button>
                <Button
                  variant="outline"
                  className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark flex items-center justify-center gap-2"
                  onClick={() => setShowAccountModal(true)}
                >
                  <Filter className="h-4 w-4" />
                  Editar contas
                </Button>
                <Button
                  variant="outline"
                  className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </Card>

          {/* Transactions Grid */}
          <TransactionGrid
            transactions={filteredTransactions}
            isLoading={isLoading || isFetching}
            showActions={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
      <AccountEditModal
        open={showAccountModal}
        onClose={() => setShowAccountModal(false)}
        // evita abrir modal sem contas carregadas
        key={accounts?.length ?? 0}
      />
    </ViewDefault>
  );
}
