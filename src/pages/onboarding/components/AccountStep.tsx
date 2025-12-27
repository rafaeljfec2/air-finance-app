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
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Banknote,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Landmark,
  Loader2,
  Wallet,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { type AccountFormData, AccountSchema } from '../schemas';

interface AccountStepProps {
  onNext: (data: AccountFormData) => void;
  onBack: () => void;
  loading: boolean;
}

export function AccountStep({ onNext, onBack, loading }: Readonly<AccountStepProps>) {
  const accountForm = useForm<AccountFormData>({ resolver: zodResolver(AccountSchema) });

  return (
    <motion.div
      key="step-2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={accountForm.handleSubmit(onNext)}>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-text-dark text-xl sm:text-2xl">Adicione uma Conta</CardTitle>
          <CardDescription className="text-text-dark/70 text-sm sm:text-base">
            Cadastre onde seu dinheiro está guardado (Banco ou Carteira).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="space-y-2">
            <Label htmlFor="accountName" className="text-text-dark">
              Nome da Conta
            </Label>
            <Input
              id="accountName"
              placeholder="Ex: Conta Principal ou Caixa Físico"
              className="bg-card-dark border-border-dark text-text-dark"
              {...accountForm.register('name')}
            />
            {accountForm.formState.errors.name && (
              <p className="text-sm text-red-400">
                {String(accountForm.formState.errors.name.message)}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-text-dark">Tipo</Label>
              <Select
                onValueChange={(v) =>
                  accountForm.setValue(
                    'type',
                    v as 'checking' | 'savings' | 'investment' | 'credit_card' | 'digital_wallet',
                  )
                }
                defaultValue="checking"
              >
                <SelectTrigger className="bg-card-dark border-border-dark text-text-dark">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card-dark border-border-dark text-text-dark">
                  <SelectItem
                    value="checking"
                    className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                  >
                    <div className="flex items-center gap-2">
                      <Banknote className="h-4 w-4" />
                      Conta Corrente
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="savings"
                    className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Poupança
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="credit_card"
                    className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Cartão de Crédito
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="digital_wallet"
                    className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Carteira Digital
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="investment"
                    className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                  >
                    <div className="flex items-center gap-2">
                      <Landmark className="h-4 w-4" />
                      Investimento
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-text-dark">Instituição</Label>
              <Input
                placeholder="Ex: Nubank, Itau..."
                className="bg-card-dark border-border-dark text-text-dark"
                {...accountForm.register('institution')}
              />
              {accountForm.formState.errors.institution && (
                <p className="text-sm text-red-400">
                  {String(accountForm.formState.errors.institution.message)}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accountAgency" className="text-text-dark">
                Agência{' '}
                <span className="text-xs text-text-dark/50 ml-1 font-normal">(Opcional)</span>
              </Label>
              <Input
                id="accountAgency"
                placeholder="Ex: 1234"
                className="bg-card-dark border-border-dark text-text-dark focus:ring-2 focus:ring-brand-leaf/20 focus:border-brand-leaf"
                {...accountForm.register('agency')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber" className="text-text-dark">
                Número da Conta{' '}
                <span className="text-xs text-text-dark/50 ml-1 font-normal">(Opcional)</span>
              </Label>
              <Input
                id="accountNumber"
                placeholder="Ex: 12345-6"
                className="bg-card-dark border-border-dark text-text-dark focus:ring-2 focus:ring-brand-leaf/20 focus:border-brand-leaf"
                {...accountForm.register('accountNumber')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountInitialBalance" className="text-text-dark">
              Saldo Inicial{' '}
              <span className="text-xs text-text-dark/50 ml-1 font-normal">
                (Saldo atual da conta)
              </span>
            </Label>
            <Input
              id="accountInitialBalance"
              type="number"
              step="0.01"
              placeholder="Ex: 1000.00"
              className="bg-card-dark border-border-dark text-text-dark focus:ring-2 focus:ring-brand-leaf/20 focus:border-brand-leaf"
              {...accountForm.register('initialBalance')}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 px-4 sm:px-6 pb-4 sm:pb-6">
          <Button
            variant="ghost"
            type="button"
            onClick={onBack}
            className="text-text-dark hover:bg-border-dark w-full sm:w-auto order-2 sm:order-1"
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
