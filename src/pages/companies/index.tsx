import React, { useState } from 'react';
import { ViewDefault } from '@/layouts/ViewDefault';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/FormField';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useCompanies } from '@/hooks/useCompanies';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/utils/date';
import { CreateCompany } from '@/services/companyService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FormCard } from '@/components/ui/FormCard';
import { DetailsCard } from '@/components/ui/DetailsCard';

const typeOptions = [
  { value: 'matriz', label: 'Matriz' },
  { value: 'filial', label: 'Filial' },
  { value: 'holding', label: 'Holding' },
  { value: 'prestadora', label: 'Prestadora' },
  { value: 'outra', label: 'Outra' },
] as const;

type CompanyType = 'matriz' | 'filial' | 'holding' | 'prestadora' | 'outra';

function formatCNPJ(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
}

function formatPhone(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

function validateCNPJ(cnpj: string) {
  cnpj = cnpj.replace(/[^\d]/g, '');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cnpj.charAt(12))) return false;

  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += parseInt(cnpj.charAt(i)) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== parseInt(cnpj.charAt(13))) return false;

  return true;
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

  const initialFormState = {
    name: '',
    cnpj: '',
    type: 'matriz' as CompanyType,
    foundationDate: '',
    userIds: [] as string[],
    email: '',
    phone: '',
    address: '',
    notes: '',
  };

  const [form, setForm] = useState<CreateCompany>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'cnpj') {
      setForm((prev) => ({ ...prev, cnpj: formatCNPJ(value) }));
    } else if (name === 'phone') {
      setForm((prev) => ({ ...prev, phone: formatPhone(value) }));
    } else if (name === 'type') {
      setForm((prev) => ({ ...prev, type: value as CompanyType }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const errs: any = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (!form.cnpj || !validateCNPJ(form.cnpj)) errs.cnpj = 'CNPJ inválido';
    if (!form.type) errs.type = 'Tipo obrigatório';
    if (!form.foundationDate) errs.foundationDate = 'Data de fundação obrigatória';
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      errs.email = 'E-mail inválido';
    if (form.phone && form.phone.replace(/\D/g, '').length < 10) errs.phone = 'Telefone inválido';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      if (editingId) {
        await updateCompany({ id: editingId, data: form });
        setEditingId(null);
      } else {
        await createCompany(form, {
          onSuccess: () => {
            toast.success('Empresa cadastrada com sucesso!');
          },
        });
      }
      setForm(initialFormState);
      setErrors({});
    } catch (error) {
      console.error('Erro ao salvar empresa:', error);
    }
  };

  const handleEdit = (id: string) => {
    const company = companies?.find((c) => c.id === id);
    if (company) {
      setForm({
        name: company.name,
        cnpj: company.cnpj,
        type: company.type,
        foundationDate: company.foundationDate.split('T')[0],
        email: company.email || '',
        phone: company.phone || '',
        address: company.address || '',
        notes: company.notes || '',
        userIds: company.userIds,
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
        await deleteCompany(deleteId);
      } catch (error) {
        console.error('Erro ao deletar empresa:', error);
      }
    }
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setDeleteId(null);
  };

  const navigate = useNavigate();

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
          <div className="text-red-500">Erro ao carregar empresas: {error.message}</div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="container mx-auto px-2 sm:px-6 py-10">
        <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-text-dark mb-6 flex items-center gap-2">
          <BuildingOfficeIcon className="h-6 w-6 text-primary-500" /> Empresas
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulário */}
          <FormCard title="Empresas">
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Nome da empresa" error={errors.name}>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ex: Minha Empresa Ltda."
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="CNPJ" error={errors.cnpj}>
                <Input
                  name="cnpj"
                  value={form.cnpj}
                  onChange={handleChange}
                  placeholder="00.000.000/0000-00"
                  required
                  maxLength={18}
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Tipo" error={errors.type}>
                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, type: value as CompanyType }))
                  }
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                    <span>
                      {typeOptions.find((t) => t.value === form.type)?.label || 'Selecione...'}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark">
                    {typeOptions.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        value={opt.value}
                        className="hover:bg-primary-100 dark:hover:bg-primary-900 focus:bg-primary-100 dark:focus:bg-primary-900"
                      >
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
              <FormField label="Data de fundação" error={errors.foundationDate}>
                <Input
                  name="foundationDate"
                  type="date"
                  value={form.foundationDate}
                  onChange={handleChange}
                  required
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="E-mail de contato" error={errors.email}>
                <Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contato@empresa.com"
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Telefone" error={errors.phone}>
                <Input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Endereço">
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Rua, número, bairro, cidade, UF"
                  className="bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
                />
              </FormField>
              <FormField label="Observações">
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Observações adicionais"
                  rows={2}
                  className="w-full bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors rounded-md resize-none"
                />
              </FormField>
              <div className="flex gap-2 mt-4">
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                  disabled={isCreating || isUpdating}
                >
                  {editingId ? 'Salvar Alterações' : 'Adicionar Empresa'}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    size="sm"
                    className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                    onClick={() => {
                      setForm(initialFormState);
                      setEditingId(null);
                    }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </FormCard>
          {/* Listagem */}
          <DetailsCard title="Minhas Empresas">
            <ul className="divide-y divide-border dark:divide-border-dark">
              {companies?.length === 0 && (
                <li className="text-gray-400 text-sm">Nenhuma empresa cadastrada.</li>
              )}
              {companies?.map((company) => (
                <li key={company.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-text dark:text-text-dark">{company.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      CNPJ: {company.cnpj} • Tipo:{' '}
                      {typeOptions.find((t) => t.value === company.type)?.label || '-'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Fundação: {formatDate(company.foundationDate)}
                      {company.email && ` • E-mail: ${company.email}`}
                      {company.phone && ` • Tel: ${company.phone}`}
                    </div>
                    {company.address && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Endereço: {company.address}
                      </div>
                    )}
                    {company.notes && (
                      <div className="text-xs text-gray-400 italic">Obs: {company.notes}</div>
                    )}
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                      onClick={() => handleEdit(company.id)}
                      disabled={isUpdating}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      className="bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-md px-6 py-2 transition-colors"
                      onClick={() => handleDelete(company.id)}
                      disabled={isDeleting}
                    >
                      Excluir
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </DetailsCard>
        </div>
      </div>
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
