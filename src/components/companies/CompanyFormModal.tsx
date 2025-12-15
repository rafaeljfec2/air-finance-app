import { useEffect, useState, useMemo } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { FormField } from '@/components/ui/FormField';
import { CreateCompany } from '@/services/companyService';
import { Company } from '@/types/company';

const typeOptions = [
  { value: 'matriz', label: 'Matriz' },
  { value: 'filial', label: 'Filial' },
  { value: 'holding', label: 'Holding' },
  { value: 'prestadora', label: 'Prestadora' },
  { value: 'outra', label: 'Outra' },
] as const;

type CompanyType = 'matriz' | 'filial' | 'holding' | 'prestadora' | 'outra';

// Helper function to remove non-digit characters using regex
// Note: replaceAll() doesn't support regex, so replace() with global flag is required
function removeNonDigits(value: string): string {
  return value.replace(/\D/g, '');
}

function formatCNPJ(value: string) {
  return removeNonDigits(value)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
}

function formatPhone(value: string) {
  return removeNonDigits(value)
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

function validateCNPJ(cnpj: string) {
  cnpj = removeNonDigits(cnpj);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += Number.parseInt(cnpj.charAt(i), 10) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== Number.parseInt(cnpj.charAt(12), 10)) return false;

  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += Number.parseInt(cnpj.charAt(i), 10) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== Number.parseInt(cnpj.charAt(13), 10)) return false;

  return true;
}

interface CompanyFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCompany) => void;
  company?: Company | null;
  isLoading?: boolean;
}

export function CompanyFormModal({
  open,
  onClose,
  onSubmit,
  company,
  isLoading = false,
}: Readonly<CompanyFormModalProps>) {
  const initialFormState: CreateCompany = useMemo(
    () => ({
      name: '',
      cnpj: '',
      type: 'matriz',
      foundationDate: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
      userIds: [],
    }),
    [],
  );

  const [form, setForm] = useState<CreateCompany>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (company) {
      setForm({
        name: company.name,
        cnpj: company.cnpj,
        type: company.type,
        foundationDate: company.foundationDate.split('T')[0],
        email: company.email ?? '',
        phone: company.phone ?? '',
        address: company.address ?? '',
        notes: company.notes ?? '',
        userIds: company.userIds,
      });
    } else {
      setForm(initialFormState);
    }
    setErrors({});
  }, [company, open, initialFormState]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'cnpj') {
      setForm((prev) => ({ ...prev, cnpj: formatCNPJ(value) }));
    } else if (name === 'phone') {
      setForm((prev) => ({ ...prev, phone: formatPhone(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nome obrigatório';
    if (!form.cnpj || !validateCNPJ(form.cnpj)) errs.cnpj = 'CNPJ inválido';
    if (!form.type) errs.type = 'Tipo obrigatório';
    if (!form.foundationDate) errs.foundationDate = 'Data de fundação obrigatória';
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      errs.email = 'E-mail inválido';
    if (form.phone && removeNonDigits(form.phone).length < 10) errs.phone = 'Telefone inválido';
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit(form);
    onClose();
    setForm(initialFormState);
    setErrors({});
  };

  const handleClose = () => {
    setForm(initialFormState);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={company ? 'Editar Empresa' : 'Nova Empresa'}
      className="max-w-2xl max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seção 1: Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text dark:text-text-dark border-b border-border dark:border-border-dark pb-2">
            Informações Básicas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nome da empresa" error={errors.name} className="md:col-span-2">
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ex: Minha Empresa Ltda."
                required
                className="bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
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
                className="bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
              />
            </FormField>
            <FormField label="Tipo" error={errors.type}>
              <Select
                value={form.type}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, type: value as CompanyType }))
                }
              >
                <SelectTrigger className="bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors">
                  <span>
                    {typeOptions.find((t) => t.value === form.type)?.label || 'Selecione...'}
                  </span>
                </SelectTrigger>
                <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark">
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
                className="bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
              />
            </FormField>
          </div>
        </div>

        {/* Seção 2: Contato */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text dark:text-text-dark border-b border-border dark:border-border-dark pb-2">
            Contato
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="E-mail de contato" error={errors.email}>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contato@empresa.com"
                className="bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
              />
            </FormField>
            <FormField label="Telefone" error={errors.phone}>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className="bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
              />
            </FormField>
          </div>
        </div>

        {/* Seção 3: Endereço */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text dark:text-text-dark border-b border-border dark:border-border-dark pb-2">
            Endereço
          </h3>
          <FormField label="Endereço">
            <Input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Rua, número, bairro, cidade, UF"
              className="bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors"
            />
          </FormField>
        </div>

        {/* Seção 4: Observações */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-text dark:text-text-dark border-b border-border dark:border-border-dark pb-2">
            Observações
          </h3>
          <FormField label="Observações">
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Observações adicionais"
              rows={3}
              className="w-full bg-background dark:bg-background-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-colors rounded-md resize-none p-2"
            />
          </FormField>
        </div>

        {/* Botões */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border dark:border-border-dark">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-card dark:hover:bg-card-dark"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-primary-500 hover:bg-primary-600 text-white"
            disabled={isLoading}
          >
            {(() => {
              if (isLoading) return 'Salvando...';
              return company ? 'Salvar Alterações' : 'Criar Empresa';
            })()}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
