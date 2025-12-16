import { useState, useMemo, useEffect } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useCreditCards } from '@/hooks/useCreditCards';
import { useCompanyStore } from '@/stores/company';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { Plus, Search, Edit, Trash2, Grid3x3, List } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { CreditCard } from '@/services/creditCardService';
import { CreateCreditCardPayload } from '@/services/creditCardService';
import { CreditCardFormModal } from '@/components/credit-cards/CreditCardFormModal';
import { Loading } from '@/components/Loading';
import { cn } from '@/lib/utils';
import {
  BanknotesIcon,
  BuildingLibraryIcon,
  CreditCardIcon as CreditCardIconHero,
} from '@heroicons/react/24/outline';

const bankTypes = [
  { value: 'nubank', label: 'Nubank', icon: CreditCardIconHero },
  { value: 'itau', label: 'Itaú', icon: BanknotesIcon },
  { value: 'bradesco', label: 'Bradesco', icon: BanknotesIcon },
  { value: 'santander', label: 'Santander', icon: BanknotesIcon },
  { value: 'bb', label: 'Banco do Brasil', icon: BanknotesIcon },
  { value: 'caixa', label: 'Caixa Econômica', icon: BanknotesIcon },
  { value: 'outro', label: 'Outro', icon: BuildingLibraryIcon },
] as const;

export function CreditCardsPage() {
  const { activeCompany } = useCompanyStore();
  const companyId = activeCompany?.id || '';
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

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCreditCard, setEditingCreditCard] = useState<CreditCard | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    const saved = localStorage.getItem('credit-cards-view-mode');
    if (saved === 'grid' || saved === 'list') {
      return saved;
    }
    return 'grid';
  });

  useEffect(() => {
    localStorage.setItem('credit-cards-view-mode', viewMode);
  }, [viewMode]);

  const filteredCreditCards = useMemo(() => {
    if (!creditCards) return [];
    return creditCards.filter((card) => {
      const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [creditCards, searchTerm]);

  const handleCreate = () => {
    setEditingCreditCard(null);
    setShowFormModal(true);
  };

  const handleEdit = (creditCard: CreditCard) => {
    setEditingCreditCard(creditCard);
    setShowFormModal(true);
  };

  const handleSubmit = async (data: CreateCreditCardPayload) => {
    if (editingCreditCard) {
      updateCreditCard({ id: editingCreditCard.id, data });
      } else {
      createCreditCard(data);
      }
    setShowFormModal(false);
    setEditingCreditCard(null);
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteCreditCard(deleteId);
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
          <Loading size="large">Carregando cartões de crédito, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="text-red-500">Erro ao carregar cartões: {error.message}</div>
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
              Para cadastrar cartões de crédito, você precisa criar uma empresa primeiro.
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
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CreditCardIcon className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">
                  Cartões de Crédito
        </h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie seus cartões de crédito e limites
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Novo Cartão
            </Button>
          </div>

          {/* Busca e Filtros */}
          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm mb-6">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="text"
                    placeholder="Buscar por nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                  />
                </div>
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

          {/* Lista de Cartões */}
          {filteredCreditCards.length === 0 ? (
            <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
              <div className="p-12 text-center">
                <CreditCardIcon className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                {(() => {
                  const hasFilters = searchTerm;
                  const emptyTitle = hasFilters
                    ? 'Nenhum cartão encontrado'
                    : 'Nenhum cartão cadastrado';
                  const emptyDescription = hasFilters
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando seu primeiro cartão de crédito';

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
                          Criar Primeiro Cartão
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
                  {filteredCreditCards.map((card) => {
                const Icon =
                      bankTypes.find((t) => t.icon.displayName === card.icon)?.icon ||
                      CreditCardIconHero;
                return (
                      <Card
                        key={card.id}
                        className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm hover:shadow-lg transition-shadow"
                      >
                        <div className="p-6">
                          {/* Header do Card */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: card.color }}
                      >
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-1 truncate">
                                  {card.name}
                                </h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {bankTypes.find((t) => t.icon.displayName === card.icon)?.label ||
                                    'Cartão'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Informações */}
                          <div className="space-y-2 mb-4">
                            <div className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Limite: </span>
                              <span className="text-text dark:text-text-dark font-semibold">
                                {formatCurrency(card.limit)}
                              </span>
                            </div>
                            <div className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                                Fechamento: {card.closingDay}º dia
                              </span>
                      </div>
                            <div className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                          Vencimento: {card.dueDay}º dia
                              </span>
                            </div>
                          </div>

                          {/* Ações */}
                          <div className="flex gap-2 pt-4 border-t border-border dark:border-border-dark">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(card)}
                              disabled={isUpdating}
                              className="flex-1 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(card.id)}
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
              ) : (
                <div className="space-y-4">
                  {filteredCreditCards.map((card) => {
                    const Icon =
                      bankTypes.find((t) => t.icon.displayName === card.icon)?.icon ||
                      CreditCardIconHero;
                    return (
                      <Card
                        key={card.id}
                        className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm hover:shadow-lg transition-shadow"
                      >
                        <div className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            {/* Informações principais */}
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div
                                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ backgroundColor: card.color }}
                              >
                                <Icon className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold text-text dark:text-text-dark">
                                    {card.name}
                                  </h3>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {bankTypes.find((t) => t.icon.displayName === card.icon)?.label ||
                                      'Cartão'}
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <span className="text-gray-500 dark:text-gray-400">Limite: </span>
                                    <span className="text-text dark:text-text-dark font-semibold">
                                      {formatCurrency(card.limit)}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                      Fechamento:{' '}
                                    </span>
                                    <span className="text-text dark:text-text-dark">
                                      {card.closingDay}º dia
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500 dark:text-gray-400">
                                      Vencimento:{' '}
                                    </span>
                                    <span className="text-text dark:text-text-dark">
                                      {card.dueDay}º dia
                                    </span>
                                  </div>
                        </div>
                      </div>
                    </div>

                            {/* Ações */}
                            <div className="flex gap-2 md:flex-shrink-0">
                      <Button
                        size="sm"
                                variant="outline"
                                onClick={() => handleEdit(card)}
                        disabled={isUpdating}
                                className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
                      >
                                <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        size="sm"
                                variant="outline"
                        onClick={() => handleDelete(card.id)}
                        disabled={isDeleting}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
                      >
                                <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                          </div>
                        </div>
                      </Card>
                );
              })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreditCardFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingCreditCard(null);
        }}
        onSubmit={handleSubmit}
        creditCard={editingCreditCard}
        isLoading={isCreating || isUpdating}
      />
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
