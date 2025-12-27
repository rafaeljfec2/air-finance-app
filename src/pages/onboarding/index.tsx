import { Button } from '@/components/ui/button';
import {
  Card,
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
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/services/apiClient';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Tags,
  Target,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// --- Schemas ---

const CompanySchema = z.object({
  name: z.string().min(3, 'Nome da empresa deve ter pelo menos 3 caracteres'),
  cnpj: z.string().optional(), // Optional for now to keep it simple
  type: z.enum(['matriz', 'filial']).default('matriz'),
});

const AccountSchema = z.object({
  name: z.string().min(3, 'Nome da conta deve ter pelo menos 3 caracteres'),
  type: z.enum(['checking', 'savings', 'investment', 'digital_wallet']).default('checking'),
  initialBalance: z.coerce.number().default(0),
  institution: z.string().min(2, 'Informe a instituição'),
  agency: z.string().optional(),
  accountNumber: z.string().optional(),
});

// --- Components ---

interface Step {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
}

function StepIndicator({ currentStep, steps }: Readonly<{ currentStep: number; steps: Step[] }>) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border-dark -z-10" />
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          return (
            <div
              key={`step-${index}-${step.label}`}
              className="flex flex-col items-center gap-2 bg-transparent px-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                    ${
                      index <= currentStep
                        ? 'bg-brand-leaf text-brand-arrow border-brand-leaf'
                        : 'bg-card-dark border-border-dark text-gray-400'
                    }`}
              >
                <IconComponent width={20} height={20} />
              </div>
              <span
                className={`text-xs font-medium ${index <= currentStep ? 'text-brand-leaf' : 'text-gray-400'}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type CompanyFormData = z.infer<typeof CompanySchema>;
type AccountFormData = z.infer<typeof AccountSchema>;

export default function OnboardingPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyFormData | null>(null);
  const [accountData, setAccountData] = useState<AccountFormData | null>(null);

  // --- Checking existing state on mount ---
  useEffect(() => {
    const checkState = async () => {
      try {
        if (user?.onboardingCompleted) {
          window.location.href = '/dashboard';
          return;
        }

        setLoading(true);
        // explicit fresh check to be safe
        const { data: freshUser } = await apiClient.get('/auth/me');
        if (freshUser.onboardingCompleted) {
          window.location.href = '/dashboard';
          return;
        }
      } catch (error) {
        console.error('Error checking state', error);
      } finally {
        setLoading(false);
      }
    };
    checkState();
  }, [user?.onboardingCompleted]);

  const steps = [
    { icon: CheckCircle2, label: 'Boas-vindas' },
    { icon: Building2, label: 'Empresa' },
    { icon: Wallet, label: 'Conta' },
    { icon: Tags, label: 'Conclusão' },
  ];

  // --- Forms ---
  const companyForm = useForm<CompanyFormData>({ resolver: zodResolver(CompanySchema) });
  const accountForm = useForm<AccountFormData>({ resolver: zodResolver(AccountSchema) });

  // --- Handlers ---

  const handleCompanyNext = (data: CompanyFormData) => {
    setCompanyData(data);
    setCurrentStep(2);
  };

  const handleAccountNext = (data: AccountFormData) => {
    setAccountData(data);
    setCurrentStep(3);
  };

  const handleComplete = async () => {
    if (!companyData || !accountData) {
      toast.error('Por favor, preencha todos os dados necessários.');
      return;
    }

    try {
      setLoading(true);

      // Create company
      const companyResponse = await apiClient.post('/companies', {
        ...companyData,
        userIds: [user?.id],
        email: user?.email,
        foundationDate: new Date().toISOString(),
      });

      const createdCompanyId = companyResponse.data.id;

      // Create account
      await apiClient.post(`/companies/${createdCompanyId}/accounts`, {
        ...accountData,
        color: '#000000', // Default
        icon: 'Wallet', // Default
        companyId: createdCompanyId,
        initialBalanceDate: new Date().toISOString(),
      });

      // Complete onboarding
      await apiClient.post('/user/onboarding/complete');

      toast.success('Bem-vindo ao AirFinance!');
      // Force reload or redirect
      window.location.href = '/dashboard';
    } catch (error) {
      console.error(error);
      toast.error('Erro ao finalizar onboarding. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && currentStep === 0 && !user) {
    // Initial loading state
    return (
      <div className="flex h-screen items-center justify-center bg-background-dark">
        <Loader2 className="animate-spin text-brand-leaf" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-dark relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-leaf/10 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-leaf/10 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-2xl z-10">
        <StepIndicator currentStep={currentStep} steps={steps} />

        <Card className="w-full border border-border-dark shadow-2xl bg-card-dark/80 backdrop-blur-md">
          {/* STEP 0: WELCOME */}
          {currentStep === 0 && (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold text-text-dark/50">
                  Bem-vindo ao AirFinance
                </CardTitle>
                <CardDescription className="text-lg mt-2 text-text-dark">
                  Vamos configurar sua conta em poucos passos para você ter o controle total das
                  suas finanças.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  <div className="p-4 rounded-lg border border-brand-leaf/20 bg-brand-arrow/10 flex flex-col items-center text-center">
                    <Target className="h-8 w-8 text-brand-leaf mb-2" />
                    <h3 className="font-semibold text-brand-leaf">Organização</h3>
                    <p className="text-sm text-text-dark/80">
                      Centralize suas empresas e contas em um só lugar.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-brand-leaf/20 bg-brand-leaf/10 flex flex-col items-center text-center">
                    <TrendingUp className="h-8 w-8 text-brand-leaf mb-2" />
                    <h3 className="font-semibold text-brand-leaf">Crescimento</h3>
                    <p className="text-sm text-text-dark/80">
                      Acompanhe métricas e tome decisões inteligentes.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pb-8">
                <Button
                  size="lg"
                  onClick={() => setCurrentStep(1)}
                  className="w-full max-w-xs text-lg font-semibold shadow-lg hover:shadow-xl transition-all bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90"
                >
                  Começar Agora
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
            </>
          )}

          {/* STEP 1: CREATE COMPANY */}
          {currentStep === 1 && (
            <form onSubmit={companyForm.handleSubmit(handleCompanyNext)}>
              <CardHeader>
                <CardTitle className="text-text-dark">Crie sua Empresa</CardTitle>
                <CardDescription className="text-text-dark/70">
                  A empresa é a base para organizar suas finanças. Você poderá adicionar outras
                  depois.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-text-dark">
                    Nome da Empresa
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="Ex: Minha Loja Ltda"
                    className="bg-card-dark border-border-dark text-text-dark"
                    {...companyForm.register('name')}
                  />
                  {companyForm.formState.errors.name && (
                    <p className="text-sm text-red-400">
                      {String(companyForm.formState.errors.name.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj" className="text-text-dark">
                    CNPJ (Opcional)
                  </Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    className="bg-card-dark border-border-dark text-text-dark"
                    {...companyForm.register('cnpj')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-text-dark">
                    Tipo
                  </Label>
                  <Select
                    onValueChange={(v) => companyForm.setValue('type', v as 'matriz' | 'filial')}
                    defaultValue="matriz"
                  >
                    <SelectTrigger className="bg-card-dark border-border-dark text-text-dark">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-card-dark border-border-dark text-text-dark">
                      <SelectItem
                        value="matriz"
                        className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                      >
                        Matriz
                      </SelectItem>
                      <SelectItem
                        value="filial"
                        className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                      >
                        Filial
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="text-text-dark hover:bg-border-dark"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continuar
                </Button>
              </CardFooter>
            </form>
          )}

          {/* STEP 2: CREATE ACCOUNT */}
          {currentStep === 2 && (
            <form onSubmit={accountForm.handleSubmit(handleAccountNext)}>
              <CardHeader>
                <CardTitle className="text-text-dark">Adicione uma Conta</CardTitle>
                <CardDescription className="text-text-dark/70">
                  Cadastre onde seu dinheiro está guardado (Banco ou Carteira).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                          v as 'checking' | 'savings' | 'investment' | 'digital_wallet',
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
                          Conta Corrente
                        </SelectItem>
                        <SelectItem
                          value="savings"
                          className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                        >
                          Poupança
                        </SelectItem>
                        <SelectItem
                          value="investment"
                          className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                        >
                          Investimento
                        </SelectItem>
                        <SelectItem
                          value="digital_wallet"
                          className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                        >
                          Carteira Digital
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-text-dark">Saldo Inicial</Label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      className="bg-card-dark border-border-dark text-text-dark"
                      {...accountForm.register('initialBalance')}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {/* Cannot go back to step 1 properly without preserving state, but for MVP ok */}
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-text-dark hover:bg-border-dark"
                >
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continuar
                </Button>
              </CardFooter>
            </form>
          )}

          {/* STEP 3: FINISH */}
          {currentStep === 3 && (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-brand-leaf/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-brand-leaf" />
                </div>
                <CardTitle className="text-2xl text-text-dark">Tudo pronto!</CardTitle>
                <CardDescription className="text-text-dark/70">
                  Já configuramos o básico para você. O plano de categorias padrão foi aplicado
                  automaticamente.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center text-text-dark/70 space-y-2">
                <p>
                  Agora você pode explorar o painel, definir metas e criar transações recorrentes.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleComplete}
                  disabled={loading}
                  className="w-full bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ir para o Dashboard
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
