import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ComboBox, type ComboBoxOption } from '@/components/ui/ComboBox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBanks } from '@/hooks/useBanks';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Banknote,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  Landmark,
  Loader2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { type CreditCardFormData, CreditCardSchema } from '../schemas';

const bankTypes = [
  { value: 'nubank', label: 'Nubank', icon: CreditCard, iconName: 'CreditCard' },
  { value: 'itau', label: 'Itaú', icon: Banknote, iconName: 'Banknote' },
  { value: 'bradesco', label: 'Bradesco', icon: Banknote, iconName: 'Banknote' },
  { value: 'santander', label: 'Santander', icon: Banknote, iconName: 'Banknote' },
  { value: 'bb', label: 'Banco do Brasil', icon: Banknote, iconName: 'Banknote' },
  { value: 'caixa', label: 'Caixa Econômica', icon: Banknote, iconName: 'Banknote' },
  { value: 'outro', label: 'Outro', icon: Landmark, iconName: 'Landmark' },
] as const;

const dueDates: ComboBoxOption<number>[] = Array.from({ length: 31 }, (_, i) => ({
  value: i + 1,
  label: `${i + 1}${i + 1 === 1 ? 'º' : 'º'} dia`,
}));

interface CreditCardStepProps {
  onNext: (data: CreditCardFormData | null) => void;
  onBack: () => void;
  loading: boolean;
  initialData?: CreditCardFormData | null;
}

export function CreditCardStep({
  onNext,
  onBack,
  loading,
  initialData,
}: Readonly<CreditCardStepProps>) {
  const { bankOptions, isLoading: isLoadingBanks } = useBanks();
  
  const creditCardForm = useForm<CreditCardFormData>({
    resolver: zodResolver(CreditCardSchema),
    defaultValues: initialData || {
      name: '',
      limit: 0,
      closingDay: 10,
      dueDay: 10,
    },
  });

  const [limitInput, setLimitInput] = useState('');

  // Initialize form when initialData changes
  useEffect(() => {
    if (initialData) {
      creditCardForm.reset(initialData);
      if (initialData.limit) {
        setLimitInput(formatCurrencyInput(initialData.limit.toFixed(2).replace('.', '')));
      } else {
        setLimitInput('');
      }
    }
  }, [initialData, creditCardForm]);

  const handleSubmit = (data: CreditCardFormData) => {
    onNext(data);
  };

  const handleBankChange = (bankCode: string | null) => {
    creditCardForm.setValue('bankCode', bankCode || undefined);
  };

  return (
    <motion.div
      key="step-3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={creditCardForm.handleSubmit(handleSubmit)}>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-text dark:text-text-dark text-xl sm:text-2xl">
            Adicione um Cartão de Crédito
          </CardTitle>
          <CardDescription className="text-text dark:text-text-dark/70 text-sm sm:text-base">
            Cadastre seu cartão de crédito para controle financeiro. Este passo é opcional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          {/* Banco */}
          <div className="space-y-2">
            <Label className="text-text dark:text-text-dark">Banco</Label>
            <ComboBox
              options={bankOptions}
              value={creditCardForm.watch('bankCode') ?? null}
              onValueChange={handleBankChange}
              placeholder={isLoadingBanks ? "Carregando bancos..." : "Selecione o banco (opcional)"}
              disabled={isLoadingBanks}
              searchable
              searchPlaceholder="Buscar banco..."
              icon={Building2}
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark"
            />
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="creditCardName" className="text-text dark:text-text-dark">
              Nome do cartão *
            </Label>
            <div className="relative">
              <Input
                id="creditCardName"
                placeholder="Ex: Cartão Nubank"
                className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark pl-10"
                {...creditCardForm.register('name')}
              />
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
            </div>
            {creditCardForm.formState.errors.name && (
              <p className="text-sm text-red-400">
                {String(creditCardForm.formState.errors.name.message)}
              </p>
            )}
          </div>

          {/* Limite */}
          <div className="space-y-2">
            <Label htmlFor="creditCardLimit" className="text-text dark:text-text-dark">
              Limite *
            </Label>
            <div className="relative">
              <Input
                id="creditCardLimit"
                type="text"
                inputMode="decimal"
                value={limitInput}
                onChange={(e) => {
                  const formatted = formatCurrencyInput(e.target.value);
                  setLimitInput(formatted);
                  creditCardForm.setValue('limit', parseCurrency(formatted));
                }}
                placeholder="R$ 0,00"
                className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark pl-10"
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
            </div>
            {creditCardForm.formState.errors.limit && (
              <p className="text-sm text-red-400">
                {String(creditCardForm.formState.errors.limit.message)}
              </p>
            )}
          </div>

          {/* Datas */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary-500 dark:text-primary-400" />
              <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                Datas
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <ComboBox<number>
                  label="Dia de fechamento *"
                  options={dueDates}
                  value={creditCardForm.watch('closingDay')}
                  onValueChange={(value) =>
                    creditCardForm.setValue('closingDay', value ?? 10)
                  }
                  placeholder="Selecione o dia"
                  className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark"
                  error={
                    creditCardForm.formState.errors.closingDay
                      ? String(creditCardForm.formState.errors.closingDay.message)
                      : undefined
                  }
                  icon={Calendar}
                />
              </div>

              <div className="space-y-2">
                <ComboBox<number>
                  label="Dia de vencimento *"
                  options={dueDates}
                  value={creditCardForm.watch('dueDay')}
                  onValueChange={(value) => creditCardForm.setValue('dueDay', value ?? 10)}
                  placeholder="Selecione o dia"
                  className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark"
                  error={
                    creditCardForm.formState.errors.dueDay
                      ? String(creditCardForm.formState.errors.dueDay.message)
                      : undefined
                  }
                  icon={Calendar}
                />
              </div>
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
          <div className="flex gap-2 w-full sm:w-auto order-1 sm:order-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => onNext(null)}
              className="text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark w-full sm:w-auto"
            >
              Pular
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90 w-full sm:w-auto"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continuar
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </form>
    </motion.div>
  );
}
