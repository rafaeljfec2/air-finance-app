import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    Wallet
} from 'lucide-react';
import { useEffect, useState } from 'react';
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

function StepIndicator({ currentStep, steps }: { currentStep: number; steps: any[] }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border dark:bg-border-dark -z-10" />
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center gap-2 bg-transparent px-2">
             <div 
               className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors
                 ${index <= currentStep 
                   ? 'bg-brand-arrow text-white border-brand-arrow dark:bg-brand-leaf dark:border-brand-leaf dark:text-brand-arrow' 
                   : 'bg-card dark:bg-card-dark border-border dark:border-border-dark text-muted-foreground'}`}
             >
               <step.icon size={20} />
             </div>
             <span className={`text-xs font-medium ${index <= currentStep ? 'text-brand-arrow dark:text-brand-leaf' : 'text-muted-foreground'}`}>
               {step.label}
             </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [createdCompanyId, setCreatedCompanyId] = useState<string | null>(null);

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

        // Check for existing companies
        const { data: companies } = await apiClient.get('/user/me/companies');
        if (companies && companies.length > 0) {
           setCreatedCompanyId(companies[0].id);
           // Assume if company exists, we might be at account step
           // Check for accounts for this company
           try {
             const { data: accounts } = await apiClient.get(`/companies/${companies[0].id}/accounts`);
             if (accounts && accounts.length > 0) {
                setCurrentStep(3); // Skip to Categories/Complete
                // Ideally check categories too, but let's assume if ACcount exists, go to next.
             } else {
                setCurrentStep(2); // Go to Account Step
             }
           } catch (e) {
             setCurrentStep(2);
           }
        } else {
           setCurrentStep(0); // Welcome
        }
      } catch (error) {
        console.error("Error checking check state", error);
      } finally {
        setLoading(false);
      }
    };
    checkState();
  }, []);

  const steps = [
    { icon:  CheckCircle2, label: 'Boas-vindas' },
    { icon: Building2, label: 'Empresa' },
    { icon: Wallet, label: 'Conta' },
    { icon: Tags, label: 'Conclusão' },
  ];

  // --- Forms ---
  const companyForm = useForm({ resolver: zodResolver(CompanySchema) });
  const accountForm = useForm({ resolver: zodResolver(AccountSchema) });

  // --- Handlers ---

  const handleCreateCompany = async (data: any) => {
    try {
      setLoading(true);
      const res = await apiClient.post('/companies', {
        ...data,
        userIds: [user?.id],
        // Default values for required fields not in form
        email: user?.email, 
        foundationDate: new Date().toISOString(),
      });
      setCreatedCompanyId(res.data.id);
      toast.success('Empresa criada com sucesso!');
      setCurrentStep(2);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao criar empresa.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (data: any) => {
    if (!createdCompanyId) return;
    try {
      setLoading(true);
      await apiClient.post(`/companies/${createdCompanyId}/accounts`, {
        ...data,
        color: '#000000', // Default
        icon: 'Wallet',   // Default
        companyId: createdCompanyId,
        initialBalanceDate: new Date().toISOString(),
      });
      toast.success('Conta criada com sucesso!');
      setCurrentStep(3);
    } catch (error) {
       console.error(error);
      toast.error('Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setLoading(true);
      // Create standard categories automatically here? 
      // For now, just mark as complete.
      await apiClient.post('/user/onboarding/complete');
      toast.success('Bem-vindo ao AirFinance!');
      // Force reload or redirect
      window.location.href = '/dashboard'; 
    } catch (error) {
      toast.error('Erro ao finalizar onboarding.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && currentStep === 0 && !user) { 
      // Initial loading state
      return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-brand-arrow/5 dark:from-background-dark dark:via-background-dark dark:to-brand-leaf/5 relative overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-arrow/10 dark:bg-brand-leaf/10 rounded-full filter blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-arrow/10 dark:bg-brand-leaf/10 rounded-full filter blur-3xl transform translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-2xl z-10">
        <StepIndicator currentStep={currentStep} steps={steps} />
        
        <Card className="w-full border border-border dark:border-border-dark shadow-2xl bg-card/80 dark:bg-card-dark/80 backdrop-blur-md">
          {/* STEP 0: WELCOME */}
          {currentStep === 0 && (
             <>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Bem-vindo ao AirFinance
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Vamos configurar sua conta em poucos passos para você ter o controle total das suas finanças.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                   <div className="p-4 rounded-lg border bg-blue-500/10 border-blue-200/20 flex flex-col items-center text-center">
                      <Target className="h-8 w-8 text-blue-500 mb-2"/>
                      <h3 className="font-semibold text-blue-700 dark:text-blue-400">Organização</h3>
                      <p className="text-sm text-blue-600/80 dark:text-blue-400/80">Centralize suas empresas e contas em um só lugar.</p>
                   </div>
                   <div className="p-4 rounded-lg border bg-green-500/10 border-green-200/20 flex flex-col items-center text-center">
                      <TrendingUp className="h-8 w-8 text-green-500 mb-2"/>
                      <h3 className="font-semibold text-green-700 dark:text-green-400">Crescimento</h3>
                      <p className="text-sm text-green-600/80 dark:text-green-400/80">Acompanhe métricas e tome decisões inteligentes.</p>
                   </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center pb-8">
                <Button size="lg" onClick={() => setCurrentStep(1)} className="w-full max-w-xs text-lg font-semibold shadow-lg hover:shadow-xl transition-all">
                  Começar Agora
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </CardFooter>
             </>
          )}

          {/* STEP 1: CREATE COMPANY */}
          {currentStep === 1 && (
            <form onSubmit={companyForm.handleSubmit(handleCreateCompany)}>
              <CardHeader>
                <CardTitle>Crie sua Empresa</CardTitle>
                <CardDescription>
                  A empresa é a base para organizar suas finanças. Você poderá adicionar outras depois.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input id="companyName" placeholder="Ex: Minha Loja Ltda" {...companyForm.register('name')} />
                  {companyForm.formState.errors.name && <p className="text-sm text-red-500">{String(companyForm.formState.errors.name.message)}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ (Opcional)</Label>
                  <Input id="cnpj" placeholder="00.000.000/0000-00" {...companyForm.register('cnpj')} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select onValueChange={(v) => companyForm.setValue('type', v as any)} defaultValue="matriz">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="matriz">Matriz</SelectItem>
                      <SelectItem value="filial">Filial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                 <Button variant="ghost" type="button" onClick={() => setCurrentStep(0)}>Voltar</Button>
                 <Button type="submit" disabled={loading}>
                   {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   Continuar
                 </Button>
              </CardFooter>
            </form>
          )}

           {/* STEP 2: CREATE ACCOUNT */}
           {currentStep === 2 && (
            <form onSubmit={accountForm.handleSubmit(handleCreateAccount)}>
              <CardHeader>
                <CardTitle>Adicione uma Conta</CardTitle>
                <CardDescription>
                  Cadastre onde seu dinheiro está guardado (Banco ou Carteira).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="accountName">Nome da Conta</Label>
                  <Input id="accountName" placeholder="Ex: Conta Principal ou Caixa Físico" {...accountForm.register('name')} />
                   {accountForm.formState.errors.name && <p className="text-sm text-red-500">{String(accountForm.formState.errors.name.message)}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Tipo</Label>
                        <Select onValueChange={(v) => accountForm.setValue('type', v as any)} defaultValue="checking">
                            <SelectTrigger>
                            <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectItem value="checking">Conta Corrente</SelectItem>
                            <SelectItem value="savings">Poupança</SelectItem>
                            <SelectItem value="investment">Investimento</SelectItem>
                            <SelectItem value="digital_wallet">Carteira Digital</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label>Instituição</Label>
                         <Input placeholder="Ex: Nubank, Itau..." {...accountForm.register('institution')} />
                          {accountForm.formState.errors.institution && <p className="text-sm text-red-500">{String(accountForm.formState.errors.institution.message)}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label>Saldo Inicial</Label>
                         <Input type="number" step="0.01" placeholder="0,00" {...accountForm.register('initialBalance')} />
                    </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                 {/* Cannot go back to step 1 properly without preserving state, but for MVP ok */}
                 <Button variant="ghost" type="button" onClick={() => setCurrentStep(1)}>Voltar</Button>
                 <Button type="submit" disabled={loading}>
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
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl">Tudo pronto!</CardTitle>
                    <CardDescription>
                       Já configuramos o básico para você. O plano de categorias padrão foi aplicado automaticamente.
                    </CardDescription>
                 </CardHeader>
                 <CardContent className="text-center text-muted-foreground space-y-2">
                    <p>Agora você pode explorar o painel, definir metas e criar transações recorrentes.</p>
                 </CardContent>
                 <CardFooter className="flex justify-center">
                     <Button size="lg" onClick={handleComplete} disabled={loading} className="w-full">
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
