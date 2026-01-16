import { ComboBox, ComboBoxOption } from '@/components/ui/ComboBox';
import { FormField } from '@/components/ui/FormField';
import { Input } from '@/components/ui/input';
import { useBanks } from '@/hooks/useBanks';
import { cn } from '@/lib/utils';
import type { CreateAccount } from '@/services/accountService';
import { Building2, CreditCard } from 'lucide-react';
import React from 'react';

type AccountType = 'checking' | 'savings' | 'digital_wallet' | 'investment';

interface BasicInfoSectionProps {
  form: CreateAccount;
  errors: Record<string, string>;
  isCreditCard: boolean;
  accountTypeOptions: ComboBoxOption<AccountType>[];
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTypeChange: (value: string | null) => void;
  onBankChange: (bankCode: string | null, bankName: string) => void;
}

export function BasicInfoSection({
  form,
  errors,
  isCreditCard,
  accountTypeOptions,
  onNameChange,
  onTypeChange,
  onBankChange,
}: Readonly<BasicInfoSectionProps>) {
  const { bankOptions, isLoading: isLoadingBanks } = useBanks();

  const handleBankChange = (bankCode: string | null) => {
    if (bankCode) {
      const selectedBank = bankOptions.find(b => b.value === bankCode);
      if (selectedBank) {
        // Extract bank name from label (format: "001 - Banco do Brasil")
        const bankName = selectedBank.label.split(' - ')[1] || selectedBank.label;
        onBankChange(bankCode, bankName);
      }
    } else {
      onBankChange(null, '');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <CreditCard className="h-4 w-4 text-primary-500 dark:text-primary-400" />
        <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
          Informações Básicas
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          label={isCreditCard ? 'Nome do cartão *' : 'Nome da conta *'}
          error={errors.name}
          className="md:col-span-2"
        >
          <div className="relative">
            <Input
              name="name"
              value={form.name}
              onChange={onNameChange}
              placeholder={isCreditCard ? 'Ex: Cartão Nubank' : 'Ex: Conta Principal'}
              required
              className={cn(
                'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark placeholder:text-muted-foreground dark:placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all pl-10',
                errors.name && 'border-red-500 focus-visible:ring-red-500',
              )}
            />
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
          </div>
        </FormField>

        <FormField label="Tipo de conta *" error={errors.type}>
          <ComboBox
            options={accountTypeOptions}
            value={form.type}
            onValueChange={onTypeChange}
            placeholder="Selecione..."
            error={errors.type}
            renderItem={(option) => {
              const Icon = option.icon;
              return (
                <div className="flex items-center gap-2">
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{option.label}</span>
                </div>
              );
            }}
            className={cn(
              'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark',
              errors.type && 'border-red-500',
            )}
          />
        </FormField>

        <FormField label="Banco / Instituição *" error={errors.institution}>
          <ComboBox
            options={bankOptions}
            value={form.bankCode ?? null}
            onValueChange={handleBankChange}
            placeholder={isLoadingBanks ? "Carregando bancos..." : "Selecione o banco"}
            disabled={isLoadingBanks}
            searchable
            searchPlaceholder="Buscar banco..."
            error={errors.institution}
            icon={Building2}
            className={cn(
              'bg-background dark:bg-background-dark text-text dark:text-text-dark border-border dark:border-border-dark',
              errors.institution && 'border-red-500',
            )}
          />
        </FormField>
      </div>
    </div>
  );
}
