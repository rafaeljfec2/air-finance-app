import { Button } from '@/components/ui/button';
import {
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ComboBox } from '@/components/ui/ComboBox';
import { useBanks } from '@/hooks/useBanks';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
    Banknote,
    Building2,
    ChevronLeft,
    ChevronRight,
    Landmark,
    Loader2,
    Wallet,
} from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type AccountFormData, AccountSchema } from '../schemas';

const accountTypes = [
  { value: 'checking', label: 'Conta Corrente', icon: Banknote, iconName: 'Banknote' },
  { value: 'savings', label: 'Poupança', icon: Wallet, iconName: 'Wallet' },
  { value: 'digital_wallet', label: 'Carteira Digital', icon: Wallet, iconName: 'Wallet' },
  { value: 'investment', label: 'Investimento', icon: Landmark, iconName: 'Landmark' },
] as const;

interface AccountStepProps {
  onNext: (data: AccountFormData) => void;
  onBack: () => void;
  loading: boolean;
  initialData?: AccountFormData | null;
}

export function AccountStep({ onNext, onBack, loading, initialData }: Readonly<AccountStepProps>) {
  const { bankOptions, isLoading: isLoadingBanks } = useBanks();
  
  const accountForm = useForm<AccountFormData>({
    resolver: zodResolver(AccountSchema),
    defaultValues: initialData || {
      type: 'checking',
      initialBalance: 0,
      initialBalanceDate: new Date().toISOString().split('T')[0],
    },
  });

  // Initialize form when initialData changes
  useEffect(() => {
    if (initialData) {
      accountForm.reset(initialData);
    }
  }, [initialData, accountForm]);

  const handleSubmit = (data: AccountFormData) => {
    onNext(data);
  };

  const handleBankChange = (bankCode: string | null) => {
    if (bankCode) {
      const selectedBank = bankOptions.find(b => b.value === bankCode);
      if (selectedBank) {
        // Extract bank name from label (format: "001 - Banco do Brasil")
        const bankName = selectedBank.label.split(' - ')[1] || selectedBank.label;
        accountForm.setValue('bankCode', bankCode);
        accountForm.setValue('institution', bankName);
      }
    } else {
      accountForm.setValue('bankCode', undefined);
      accountForm.setValue('institution', '');
    }
  };

  return (
    <motion.div
      key="step-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={accountForm.handleSubmit(handleSubmit)}>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-text dark:text-text-dark text-xl sm:text-2xl">
            Adicione uma Conta
          </CardTitle>
          <CardDescription className="text-text dark:text-text-dark/70 text-sm sm:text-base">
            Cadastre onde seu dinheiro está guardado (Banco ou Carteira). Este passo é opcional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="accountName" className="text-text dark:text-text-dark">
              Nome da Conta *
            </Label>
            <Input
              id="accountName"
              placeholder="Ex: Conta Principal ou Caixa Físico"
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark"
              {...accountForm.register('name')}
            />
            {accountForm.formState.errors.name && (
              <p className="text-sm text-red-400">
                {String(accountForm.formState.errors.name.message)}
              </p>
            )}
          </div>

          {/* Tipo e Instituição */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-text dark:text-text-dark">Tipo *</Label>
              <Select
                value={accountForm.watch('type')}
                onValueChange={(v) =>
                  accountForm.setValue(
                    'type',
                    v as 'checking' | 'savings' | 'investment' | 'digital_wallet',
                  )
                }
              >
                <SelectTrigger className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                  {accountTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem
                        key={type.value}
                        value={type.value}
                        className="text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark focus:bg-border dark:focus:bg-border-dark"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-text dark:text-text-dark">Banco / Instituição *</Label>
              <ComboBox
                options={bankOptions}
                value={accountForm.watch('bankCode') ?? null}
                onValueChange={handleBankChange}
                placeholder={isLoadingBanks ? "Carregando bancos..." : "Selecione o banco"}
                disabled={isLoadingBanks}
                searchable
                searchPlaceholder="Buscar banco..."
                icon={Building2}
                className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark"
              />
              {accountForm.formState.errors.institution && (
                <p className="text-sm text-red-400">
                  {String(accountForm.formState.errors.institution.message)}
                </p>
              )}
            </div>
          </div>

          {/* Campos para contas bancárias */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountAgency" className="text-text dark:text-text-dark">
                Agência{' '}
                <span className="text-xs text-text dark:text-text-dark/50 ml-1 font-normal">
                  (Opcional)
                </span>
              </Label>
              <Input
                id="accountAgency"
                placeholder="Ex: 1234"
                className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:ring-2 focus:ring-brand-leaf/20 focus:border-brand-leaf"
                {...accountForm.register('agency')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-text dark:text-text-dark">
                Número da Conta{' '}
                <span className="text-xs text-text dark:text-text-dark/50 ml-1 font-normal">
                  (Opcional)
                </span>
              </Label>
              <Input
                id="accountNumber"
                placeholder="Ex: 12345-6"
                className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:ring-2 focus:ring-brand-leaf/20 focus:border-brand-leaf"
                {...accountForm.register('accountNumber')}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountInitialBalance" className="text-text dark:text-text-dark">
                Saldo Inicial{' '}
                <span className="text-xs text-text dark:text-text-dark/50 ml-1 font-normal">
                  (Saldo atual)
                </span>
              </Label>
              <div className="relative">
                <Input
                  id="accountInitialBalance"
                  type="text"
                  inputMode="decimal"
                  className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:ring-2 focus:ring-brand-leaf/20 focus:border-brand-leaf"
                  {...accountForm.register('initialBalance', { valueAsNumber: true })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountInitialBalanceDate" className="text-text dark:text-text-dark">
                Data do Saldo *
              </Label>
              <Input
                id="accountInitialBalanceDate"
                type="date"
                className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark"
                {...accountForm.register('initialBalanceDate')}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 px-4 sm:px-6 pb-4 sm:pb-6">
          <Button
            variant="ghost"
            type="button"
            onClick={onBack}
            className="text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark w-full sm:w-auto order-2 sm:order-1"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90 w-full sm:w-auto order-1 sm:order-2"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continuar
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </form>
    </motion.div>
  );
}
