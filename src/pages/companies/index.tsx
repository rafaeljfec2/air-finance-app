import { CompanyFormModal } from '@/components/companies/CompanyFormModal';
import { CompanyTableRow } from '@/components/companies/CompanyTableRow';
import { Loading } from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { useCompanies } from '@/hooks/useCompanies';
import { useViewMode } from '@/hooks/useViewMode';
import { ViewDefault } from '@/layouts/ViewDefault';
import { cn } from '@/lib/utils';
import { CreateCompany } from '@/services/companyService';
import { Company } from '@/types/company';
import { formatDate } from '@/utils/date';
import { formatDocument } from '@/utils/formatDocument';
import { Building2, Edit, Grid3x3, List, Plus, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';

const typeOptions = [
  { value: 'matriz', label: 'Matriz' },
  { value: 'filial', label: 'Filial' },
  { value: 'holding', label: 'Holding' },
  { value: 'prestadora', label: 'Prestadora' },
  { value: 'outra', label: 'Outra' },
] as const;

type CompanyType = 'matriz' | 'filial' | 'holding' | 'prestadora' | 'outra';

function removeNonDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function getTypeLabel(type: CompanyType): string {
  return typeOptions.find((t) => t.value === type)?.label ?? type;
}

function getTypeBadgeColor(type: CompanyType): string {
  const colors: Record<CompanyType, string> = {
    matriz: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    filial: 'bg-green-500/20 text-green-400 border-green-500/30',
    holding: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    prestadora: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    outra: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  return colors[type] ?? colors.outra;
}

export function CompaniesPage() {
  const {
    companies,
    isLoading,
    error,
    createCompany,
    updateCompany,
    deleteCompany,
    isCreating,
    isUpdating,
    isDeleting,
  } = useCompanies();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useViewMode('companies-view-mode');

  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    return companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        removeNonDigits(company.cnpj).includes(removeNonDigits(searchTerm));
      const matchesType = filterType === 'all' || company.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [companies, searchTerm, filterType]);

  const handleCreate = () => {
    setEditingCompany(null);
    setShowFormModal(true);
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setShowFormModal(true);
  };

  const handleSubmit = (data: CreateCompany) => {
    if (editingCompany) {
      updateCompany({ id: editingCompany.id, data });
    } else {
      createCompany(data);
    }
    setShowFormModal(false);
    setEditingCompany(null);
  };

  const handleDelete = (id: string) => {
    setShowConfirmDelete(true);
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteCompany(deleteId);
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
          <Loading size="large">Carregando empresas, por favor aguarde...</Loading>
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-4 sm:px-6 py-10">
          <div className="text-red-500">Erro ao carregar empresas: {error.message}</div>
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
                <Building2 className="h-8 w-8 text-primary-400" />
                <h1 className="text-2xl font-bold text-text dark:text-text-dark">Empresas</h1>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie suas empresas e filiais
              </p>
            </div>
            <Button
              onClick={handleCreate}
              className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Nova Empresa
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
                    placeholder="Buscar por nome ou CNPJ/CPF..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-background dark:bg-background-dark border border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 focus:ring-2 focus:ring-primary-500">
                    <span>
                      {filterType === 'all'
                        ? 'Todos os tipos'
                        : getTypeLabel(filterType as CompanyType)}
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

          {/* Lista de Empresas */}
          {filteredCompanies.length === 0 ? (
            <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
              <div className="p-12 text-center">
                <Building2 className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                {(() => {
                  const hasFilters = searchTerm || filterType !== 'all';
                  const emptyTitle = hasFilters
                    ? 'Nenhuma empresa encontrada'
                    : 'Nenhuma empresa cadastrada';
                  const emptyDescription = hasFilters
                    ? 'Tente ajustar os filtros de busca'
                    : 'Comece criando sua primeira empresa';

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
                          Criar Primeira Empresa
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
                  {filteredCompanies.map((company) => (
                    <Card
                      key={company.id}
                      className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm hover:shadow-lg transition-shadow"
                    >
                      <div className="p-6">
                        {/* Header do Card */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2 truncate">
                              {company.name}
                            </h3>
                            <span
                              className={cn(
                                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                                getTypeBadgeColor(company.type),
                              )}
                            >
                              {getTypeLabel(company.type)}
                            </span>
                          </div>
                        </div>

                        {/* Informações */}
                        <div className="space-y-2 mb-4">
                          <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">CNPJ/CPF: </span>
                            <span className="text-text dark:text-text-dark font-mono">
                              {formatDocument(company.cnpj)}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500 dark:text-gray-400">Fundação: </span>
                            <span className="text-text dark:text-text-dark">
                              {formatDate(company.foundationDate)}
                            </span>
                          </div>
                          {company.email && (
                            <div className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">E-mail: </span>
                              <span className="text-text dark:text-text-dark truncate block">
                                {company.email}
                              </span>
                            </div>
                          )}
                          {company.phone && (
                            <div className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Telefone: </span>
                              <span className="text-text dark:text-text-dark">{company.phone}</span>
                            </div>
                          )}
                          {company.address && (
                            <div className="text-sm">
                              <span className="text-gray-500 dark:text-gray-400">Endereço: </span>
                              <span className="text-text dark:text-text-dark truncate block">
                                {company.address}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Ações */}
                        <div className="flex gap-2 pt-4 border-t border-border dark:border-border-dark">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(company)}
                            disabled={isUpdating}
                            className="flex-1 bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(company.id)}
                            disabled={isDeleting}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-500/30 hover:border-red-500/50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark backdrop-blur-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border dark:border-border-dark">
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Empresa
                          </th>
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Informações
                          </th>
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Contato
                          </th>
                          <th className="text-left p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Endereço
                          </th>
                          <th className="text-right p-4 text-sm font-semibold text-text dark:text-text-dark">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCompanies.map((company) => (
                          <CompanyTableRow
                            key={company.id}
                            company={company}
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
              )}
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <CompanyFormModal
        open={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingCompany(null);
        }}
        onSubmit={handleSubmit}
        company={editingCompany}
        isLoading={isCreating || isUpdating}
      />
      <ConfirmModal
        open={showConfirmDelete}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </ViewDefault>
  );
}
