import { useEffect, useState, useMemo } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Building2, Mail, Phone, MapPin, FileText, Calendar, X } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { FormField } from '@/components/ui/FormField';
import { CreateCompany } from '@/services/companyService';
import { Company } from '@/types/company';
import { cn } from '@/lib/utils';

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
      title=""
      dismissible={false}
      className="max-w-3xl bg-card dark:bg-card-dark p-0 flex flex-col h-[90vh] max-h-[90vh]"
    >
      <div className="flex flex-col flex-1 overflow-hidden min-h-0">
        {/* Header Customizado */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-500/10 dark:bg-primary-400/10">
              <Building2 className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text dark:text-text-dark">
                {company ? 'Editar Empresa' : 'Nova Empresa'}
              </h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {company
                  ? 'Atualize as informações da empresa'
                  : 'Preencha os dados da nova empresa'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-card dark:hover:bg-card-dark text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto px-6 min-h-0">
          <form onSubmit={handleSubmit} id="company-form" className="space-y-6 py-4">
            {/* Seção: Informações Básicas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Informações Básicas
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nome da empresa *" error={errors.name} className="md:col-span-2">
                  <div className="relative">
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ex: Minha Empresa Ltda."
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.name && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>

                <FormField label="CNPJ *" error={errors.cnpj}>
                  <Input
                    name="cnpj"
                    value={form.cnpj}
                    onChange={handleChange}
                    placeholder="00.000.000/0000-00"
                    required
                    maxLength={18}
                    className={cn(
                      'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all font-mono',
                      errors.cnpj && 'border-red-500 focus-visible:ring-red-500',
                    )}
                  />
                </FormField>

                <FormField label="Tipo *" error={errors.type}>
                  <Select
                    value={form.type}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, type: value as CompanyType }))
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                        errors.type && 'border-red-500 focus:ring-red-500',
                      )}
                    >
                      <span>
                        {typeOptions.find((t) => t.value === form.type)?.label || 'Selecione...'}
                      </span>
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark">
                      {typeOptions.map((opt) => (
                        <SelectItem
                          key={opt.value}
                          value={opt.value}
                          className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30"
                        >
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Data de fundação *" error={errors.foundationDate}>
                  <div className="relative">
                    <Input
                      name="foundationDate"
                      type="date"
                      value={form.foundationDate}
                      onChange={handleChange}
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all',
                        errors.foundationDate && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400 pointer-events-none" />
                  </div>
                </FormField>
              </div>
            </div>

            {/* Seção: Contato */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Mail className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Contato
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="E-mail de contato" error={errors.email}>
                  <div className="relative">
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="contato@empresa.com"
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.email && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>

                <FormField label="Telefone" error={errors.phone}>
                  <div className="relative">
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="(00) 00000-0000"
                      maxLength={15}
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.phone && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>
              </div>
            </div>

            {/* Seção: Endereço */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Endereço
                </h3>
              </div>

              <FormField label="Endereço completo">
                <div className="relative">
                  <Input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Rua, número, bairro, cidade, UF"
                    className="bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10"
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                </div>
              </FormField>
            </div>

            {/* Seção: Observações */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Observações
                </h3>
              </div>

              <FormField label="Observações adicionais">
                <div className="relative">
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Adicione observações ou notas sobre a empresa..."
                    rows={3}
                    className="w-full bg-background dark:bg-background-dark text-text dark:text-text-dark border border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all rounded-md resize-none p-3 pl-10"
                  />
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                </div>
              </FormField>
            </div>
          </form>
        </div>

        {/* Footer Fixo */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-border dark:border-border-dark bg-card dark:bg-card-dark flex-shrink-0">
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
            form="company-form"
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20"
            disabled={isLoading}
          >
            {(() => {
              if (isLoading) return 'Salvando...';
              return company ? 'Salvar Alterações' : 'Criar Empresa';
            })()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
