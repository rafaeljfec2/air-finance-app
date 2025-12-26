import { FormField } from '@/components/ui/FormField';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/button';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  CreateCreditCardPayload,
  CreditCard as CreditCardType,
} from '@/services/creditCardService';
import { useCompanyStore } from '@/stores/company';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import { Banknote, Calendar, CreditCard, DollarSign, Landmark, Palette, X } from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';

const bankTypes = [
  { value: 'nubank', label: 'Nubank', icon: CreditCard, iconName: 'CreditCard' },
  { value: 'itau', label: 'Itaú', icon: Banknote, iconName: 'Banknote' },
  { value: 'bradesco', label: 'Bradesco', icon: Banknote, iconName: 'Banknote' },
  { value: 'santander', label: 'Santander', icon: Banknote, iconName: 'Banknote' },
  { value: 'bb', label: 'Banco do Brasil', icon: Banknote, iconName: 'Banknote' },
  { value: 'caixa', label: 'Caixa Econômica', icon: Banknote, iconName: 'Banknote' },
  { value: 'outro', label: 'Outro', icon: Landmark, iconName: 'Landmark' },
] as const;

const dueDates = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}${i + 1 === 1 ? 'º' : 'º'} dia`,
}));

interface CreditCardFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCreditCardPayload) => void;
  creditCard?: CreditCardType | null;
  isLoading?: boolean;
}

export function CreditCardFormModal({
  open,
  onClose,
  onSubmit,
  creditCard,
  isLoading = false,
}: Readonly<CreditCardFormModalProps>) {
  const { activeCompany } = useCompanyStore();
  const initialFormState: CreateCreditCardPayload = useMemo(
    () => ({
      name: '',
      limit: 0,
      closingDay: 10,
      dueDay: 10,
      color: '#8A05BE',
      icon: 'CreditCard',
      companyId: activeCompany?.id || '',
    }),
    [activeCompany],
  );

  const [form, setForm] = useState<CreateCreditCardPayload>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [limitInput, setLimitInput] = useState('');

  useEffect(() => {
    if (creditCard) {
      setForm({
        name: creditCard.name,
        limit: creditCard.limit,
        closingDay: creditCard.closingDay,
        dueDay: creditCard.dueDay,
        color: creditCard.color,
        icon: creditCard.icon,
        companyId: creditCard.companyId,
      });
      setLimitInput(
        creditCard.limit ? formatCurrencyInput(creditCard.limit.toFixed(2).replace('.', '')) : '',
      );
    } else {
      setForm({
        ...initialFormState,
        companyId: activeCompany?.id || '',
      });
      setLimitInput('');
    }
    setErrors({});
  }, [creditCard, open, initialFormState, activeCompany]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (!form.limit || form.limit <= 0) errs.limit = 'Limite inválido';
    if (!form.companyId) errs.companyId = 'Selecione uma empresa';
    return errs;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    onSubmit(form);
    onClose();
    setForm({
      ...initialFormState,
      companyId: activeCompany?.id || '',
    });
    setErrors({});
    setLimitInput('');
  };

  const handleClose = () => {
    setForm({
      ...initialFormState,
      companyId: activeCompany?.id || '',
    });
    setErrors({});
    setLimitInput('');
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
              <CreditCard className="h-5 w-5 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text dark:text-text-dark">
                {creditCard ? 'Editar Cartão' : 'Novo Cartão de Crédito'}
              </h2>
              <p className="text-sm text-muted-foreground dark:text-gray-400">
                {creditCard
                  ? 'Atualize as informações do cartão'
                  : 'Preencha os dados do novo cartão de crédito'}
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
          <form onSubmit={handleSubmit} id="credit-card-form" className="space-y-6 py-4">
            {/* Seção: Informações Básicas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Informações Básicas
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Nome do cartão *" error={errors.name} className="md:col-span-2">
                  <div className="relative">
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Ex: Cartão Nubank"
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.name && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>

                <FormField label="Limite *" error={errors.limit}>
                  <div className="relative">
                    <Input
                      name="limit"
                      type="text"
                      inputMode="decimal"
                      value={limitInput}
                      onChange={(e) => {
                        const formatted = formatCurrencyInput(e.target.value);
                        setLimitInput(formatted);
                        setForm((prev) => ({
                          ...prev,
                          limit: parseCurrency(formatted),
                        }));
                      }}
                      placeholder="R$ 0,00"
                      required
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                        errors.limit && 'border-red-500 focus-visible:ring-red-500',
                      )}
                    />
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </FormField>
              </div>
            </div>

            {/* Seção: Datas */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Datas
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Dia de fechamento *" error={errors.closingDay}>
                  <Select
                    value={String(form.closingDay)}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, closingDay: Number(value) }))
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                        errors.closingDay && 'border-red-500 focus:ring-red-500',
                      )}
                    >
                      {dueDates.find((d) => d.value === form.closingDay)?.label || 'Selecione...'}
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark max-h-60 overflow-y-auto">
                      {dueDates.map((d) => (
                        <SelectItem
                          key={d.value}
                          value={String(d.value)}
                          className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30"
                        >
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>

                <FormField label="Dia de vencimento *" error={errors.dueDay}>
                  <Select
                    value={String(form.dueDay)}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, dueDay: Number(value) }))
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all',
                        errors.dueDay && 'border-red-500 focus:ring-red-500',
                      )}
                    >
                      {dueDates.find((d) => d.value === form.dueDay)?.label || 'Selecione...'}
                    </SelectTrigger>
                    <SelectContent className="bg-card dark:bg-card-dark text-text dark:text-text-dark border-border dark:border-border-dark max-h-60 overflow-y-auto">
                      {dueDates.map((d) => (
                        <SelectItem
                          key={d.value}
                          value={String(d.value)}
                          className="hover:bg-primary-100 dark:hover:bg-primary-900/30 focus:bg-primary-100 dark:focus:bg-primary-900/30"
                        >
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
              </div>
            </div>

            {/* Seção: Personalização */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                  Personalização
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Cor">
                  <ColorPicker value={form.color} onChange={handleColorChange} />
                </FormField>

                <FormField label="Ícone">
                  <IconPicker
                    value={form.icon}
                    onChange={handleIconChange}
                    options={bankTypes.map((t) => ({
                      value: t.iconName,
                      icon: t.icon,
                    }))}
                  />
                </FormField>
              </div>
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
            form="credit-card-form"
            className="bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20"
            disabled={isLoading}
          >
            {(() => {
              if (isLoading) return 'Salvando...';
              return creditCard ? 'Salvar Alterações' : 'Criar Cartão';
            })()}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
