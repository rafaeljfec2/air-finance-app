import { Button } from '@/components/ui/button';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { IconPicker } from '@/components/ui/icon-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Banknote,
  Calendar,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  Landmark,
  Loader2,
  Palette,
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

const dueDates = Array.from({ length: 31 }, (_, i) => ({
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
  const creditCardForm = useForm<CreditCardFormData>({
    resolver: zodResolver(CreditCardSchema),
    defaultValues: initialData || {
      name: '',
      limit: 0,
      closingDay: 10,
      dueDay: 10,
      color: '#8A05BE',
      icon: 'CreditCard',
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

  const iconOptions = bankTypes.map((type) => ({
    value: type.iconName,
    icon: type.icon,
  }));

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
                <Label className="text-text dark:text-text-dark">Dia de fechamento *</Label>
                <Select
                  value={String(creditCardForm.watch('closingDay'))}
                  onValueChange={(value) =>
                    creditCardForm.setValue('closingDay', Number.parseInt(value, 10))
                  }
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                    {dueDates.map((d) => (
                      <SelectItem
                        key={d.value}
                        value={String(d.value)}
                        className="text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark focus:bg-border dark:focus:bg-border-dark"
                      >
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {creditCardForm.formState.errors.closingDay && (
                  <p className="text-sm text-red-400">
                    {String(creditCardForm.formState.errors.closingDay.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-text dark:text-text-dark">Dia de vencimento *</Label>
                <Select
                  value={String(creditCardForm.watch('dueDay'))}
                  onValueChange={(value) =>
                    creditCardForm.setValue('dueDay', Number.parseInt(value, 10))
                  }
                >
                  <SelectTrigger className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                    {dueDates.map((d) => (
                      <SelectItem
                        key={d.value}
                        value={String(d.value)}
                        className="text-text dark:text-text-dark hover:bg-border dark:hover:bg-border-dark focus:bg-border dark:focus:bg-border-dark"
                      >
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {creditCardForm.formState.errors.dueDay && (
                  <p className="text-sm text-red-400">
                    {String(creditCardForm.formState.errors.dueDay.message)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Personalização */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary-500 dark:text-primary-400" />
              <h3 className="text-sm font-semibold text-text dark:text-text-dark uppercase tracking-wide">
                Personalização
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-text dark:text-text-dark">Cor</Label>
                <ColorPicker
                  value={creditCardForm.watch('color')}
                  onChange={(color) => creditCardForm.setValue('color', color)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-text dark:text-text-dark">Ícone</Label>
                <IconPicker
                  value={creditCardForm.watch('icon')}
                  onChange={(icon) => creditCardForm.setValue('icon', icon)}
                  options={iconOptions}
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
