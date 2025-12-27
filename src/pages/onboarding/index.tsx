import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ColorPicker } from '@/components/ui/color-picker';
import { DatePicker } from '@/components/ui/DatePicker';
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
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/services/apiClient';
import { formatDateToLocalISO, parseLocalDate } from '@/utils/date';
import { formatCNPJ, formatCPF, unformatDocument } from '@/utils/formatDocument';
import { formatCurrencyInput, parseCurrency } from '@/utils/formatters';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Gift,
  Landmark,
  Loader2,
  Plus,
  Repeat,
  ShoppingCart,
  Tags,
  Target,
  Trash2,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// --- Schemas ---

function validateCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(digits.charAt(i), 10) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== Number.parseInt(digits.charAt(9), 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(digits.charAt(i), 10) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== Number.parseInt(digits.charAt(10), 10)) return false;

  return true;
}

function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  let weight = 2;
  for (let i = 11; i >= 0; i--) {
    sum += Number.parseInt(digits.charAt(i), 10) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  let digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== Number.parseInt(digits.charAt(12), 10)) return false;

  sum = 0;
  weight = 2;
  for (let i = 12; i >= 0; i--) {
    sum += Number.parseInt(digits.charAt(i), 10) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  digit = 11 - (sum % 11);
  if (digit > 9) digit = 0;
  if (digit !== Number.parseInt(digits.charAt(13), 10)) return false;

  return true;
}

const CompanySchema = z
  .object({
    name: z.string().min(3, 'Nome da empresa deve ter pelo menos 3 caracteres'),
    documentType: z.enum(['cnpj', 'cpf']).default('cnpj'),
    document: z.string().min(1, 'CNPJ ou CPF é obrigatório'),
    type: z.enum(['matriz', 'filial']).default('matriz'),
  })
  .refine(
    (data) => {
      if (!data.document) return true;
      if (data.documentType === 'cpf') {
        return validateCPF(data.document);
      }
      return validateCNPJ(data.document);
    },
    {
      message: 'CNPJ ou CPF inválido',
      path: ['document'],
    },
  );

const AccountSchema = z.object({
  name: z.string().min(3, 'Nome da conta deve ter pelo menos 3 caracteres'),
  type: z.enum(['checking', 'savings', 'investment', 'digital_wallet']).default('checking'),
  initialBalance: z.coerce.number().default(0),
  institution: z.string().min(2, 'Informe a instituição'),
  agency: z.string().optional(),
  accountNumber: z.string().optional(),
});

const CategorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['income', 'expense']),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida'),
  icon: z.string().min(1, 'Ícone é obrigatório'),
});

const GoalSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  description: z.string().optional(),
  targetAmount: z.number().min(0.01, 'Valor alvo deve ser maior que zero'),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data limite inválida'),
  accountId: z.string().optional(), // Will be set on complete
  categoryId: z.string().optional(),
});

const RecurringTransactionSchema = z
  .object({
    description: z.string().min(1, 'Descrição é obrigatória'),
    value: z.number().min(0.01, 'Valor deve ser maior que zero'),
    type: z.enum(['Income', 'Expense']),
    category: z.string().min(1, 'Categoria é obrigatória'),
    accountId: z.string().optional(), // Will be set on complete
    startDate: z.string().min(1, 'Data inicial é obrigatória'),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    repeatUntil: z.string().min(1, 'Data final é obrigatória'),
  })
  .refine(
    (data) => {
      if (data.repeatUntil && data.startDate) {
        return new Date(data.repeatUntil) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: 'Data final deve ser posterior à data inicial',
      path: ['repeatUntil'],
    },
  );

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
type CategoryFormData = z.infer<typeof CategorySchema>;
type GoalFormData = z.infer<typeof GoalSchema>;
type RecurringTransactionFormData = z.infer<typeof RecurringTransactionSchema>;

export default function OnboardingPage() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<CompanyFormData | null>(null);
  const [accountData, setAccountData] = useState<AccountFormData | null>(null);
  const [categoriesData, setCategoriesData] = useState<CategoryFormData[]>([]);
  const [goalData, setGoalData] = useState<GoalFormData | null>(null);
  const [recurringTransactionData, setRecurringTransactionData] =
    useState<RecurringTransactionFormData | null>(null);

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
    { icon: Tags, label: 'Categorias' },
    { icon: Target, label: 'Metas' },
    { icon: Repeat, label: 'Transações Recorrentes' },
    { icon: CheckCircle2, label: 'Conclusão' },
  ];

  // --- Forms ---
  const companyForm = useForm<CompanyFormData>({
    resolver: zodResolver(CompanySchema),
    defaultValues: {
      documentType: 'cnpj',
    },
  });
  const accountForm = useForm<AccountFormData>({ resolver: zodResolver(AccountSchema) });
  const goalForm = useForm<GoalFormData>({
    resolver: zodResolver(GoalSchema),
    defaultValues: {
      targetAmount: 0,
    },
  });
  const recurringTransactionForm = useForm<RecurringTransactionFormData>({
    resolver: zodResolver(RecurringTransactionSchema),
    defaultValues: {
      type: 'Expense',
      frequency: 'monthly',
      value: 0,
      startDate: formatDateToLocalISO(new Date()),
      repeatUntil: formatDateToLocalISO(
        new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      ),
      category: '',
      description: '',
    },
  });

  const documentType = companyForm.watch('documentType');
  const [goalTargetAmountInput, setGoalTargetAmountInput] = useState('');
  const [recurringTransactionValueInput, setRecurringTransactionValueInput] = useState('');

  // Category form state
  const [currentCategoryForm, setCurrentCategoryForm] = useState<CategoryFormData>({
    name: '',
    type: 'expense',
    color: '#8A05BE',
    icon: 'Tags',
  });
  const [categoryFormErrors, setCategoryFormErrors] = useState<Record<string, string>>({});

  const iconOptions = [
    { value: 'Tags', icon: Tags },
    { value: 'TrendingUp', icon: TrendingUp },
    { value: 'TrendingDown', icon: TrendingDown },
    { value: 'Wallet', icon: Wallet },
    { value: 'ShoppingCart', icon: ShoppingCart },
    { value: 'Gift', icon: Gift },
    { value: 'Landmark', icon: Landmark },
  ] as const;

  const categoryTypes = [
    { value: 'income', label: 'Receita', icon: TrendingUp },
    { value: 'expense', label: 'Despesa', icon: TrendingDown },
  ] as const;

  const handleAddCategory = () => {
    const errors: Record<string, string> = {};
    if (!currentCategoryForm.name.trim()) {
      errors.name = 'Nome obrigatório';
    }
    setCategoryFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setCategoriesData([...categoriesData, { ...currentCategoryForm }]);
    setCurrentCategoryForm({
      name: '',
      type: 'expense',
      color: '#8A05BE',
      icon: 'Tags',
    });
    setCategoryFormErrors({});
  };

  const handleRemoveCategory = (index: number) => {
    setCategoriesData(categoriesData.filter((_, i) => i !== index));
  };

  // --- Handlers ---

  const handleCompanyNext = (data: CompanyFormData) => {
    setCompanyData(data);
    setCurrentStep(2);
  };

  const handleAccountNext = (data: AccountFormData) => {
    setAccountData(data);
    setCurrentStep(3);
  };

  const handleCategoriesNext = (data: CategoryFormData[]) => {
    setCategoriesData(data);
    setCurrentStep(4);
  };

  const handleGoalNext = (data: GoalFormData | null) => {
    setGoalData(data);
    setCurrentStep(5);
  };

  const handleRecurringTransactionNext = (data: RecurringTransactionFormData | null) => {
    setRecurringTransactionData(data);
    setCurrentStep(6);
  };

  const handleComplete = async () => {
    if (!companyData || !accountData) {
      toast.error('Por favor, preencha todos os dados necessários.');
      return;
    }

    try {
      setLoading(true);

      // Remove formatting from document before submitting
      const documentValue = companyData.document ? unformatDocument(companyData.document) : '';

      // Create company
      const companyResponse = await apiClient.post('/companies', {
        name: companyData.name,
        cnpj: documentValue, // Backend uses cnpj field for both CPF and CNPJ
        type: companyData.type,
        userIds: [user?.id],
        email: user?.email,
        foundationDate: new Date().toISOString(),
      });

      const createdCompanyId = companyResponse.data.id;

      // Create account
      const accountResponse = await apiClient.post(`/companies/${createdCompanyId}/accounts`, {
        ...accountData,
        color: '#000000', // Default
        icon: 'Wallet', // Default
        companyId: createdCompanyId,
        initialBalanceDate: new Date().toISOString(),
      });

      const createdAccountId = accountResponse.data.id;

      // Create categories
      const createdCategoryIds: string[] = [];
      if (categoriesData.length > 0) {
        for (const category of categoriesData) {
          const categoryResponse = await apiClient.post(
            `/companies/${createdCompanyId}/categories`,
            {
              ...category,
              companyId: createdCompanyId,
            },
          );
          createdCategoryIds.push(categoryResponse.data.id);
        }
      }

      // Create goal (if provided)
      if (goalData) {
        await apiClient.post(`/companies/${createdCompanyId}/goals`, {
          name: goalData.name,
          description: goalData.description,
          targetAmount: goalData.targetAmount,
          deadline: goalData.deadline,
          accountId: createdAccountId,
          companyId: createdCompanyId,
          currentAmount: 0,
          status: 'active',
          categoryId: goalData.categoryId || createdCategoryIds[0] || undefined,
        });
      }

      // Create recurring transaction (if provided)
      // Note: category field expects category name (string), not ID
      if (recurringTransactionData && recurringTransactionData.category) {
        await apiClient.post(`/companies/${createdCompanyId}/recurring-transactions`, {
          ...recurringTransactionData,
          accountId: createdAccountId,
          companyId: createdCompanyId,
          startDate: new Date(recurringTransactionData.startDate).toISOString(),
          repeatUntil: new Date(recurringTransactionData.repeatUntil).toISOString(),
        });
      }

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
                  <Label htmlFor="documentType" className="text-text-dark">
                    Tipo de Documento
                  </Label>
                  <Select
                    value={documentType}
                    onValueChange={(value) => {
                      companyForm.setValue('documentType', value as 'cnpj' | 'cpf');
                      companyForm.setValue('document', ''); // Clear document when type changes
                    }}
                  >
                    <SelectTrigger className="bg-card-dark border-border-dark text-text-dark">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent className="bg-card-dark border-border-dark text-text-dark">
                      <SelectItem
                        value="cnpj"
                        className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                      >
                        CNPJ
                      </SelectItem>
                      <SelectItem
                        value="cpf"
                        className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                      >
                        CPF
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="document" className="text-text-dark">
                    {documentType === 'cnpj' ? 'CNPJ' : 'CPF'}
                  </Label>
                  <Input
                    id="document"
                    placeholder={documentType === 'cnpj' ? '00.000.000/0000-00' : '000.000.000-00'}
                    className="bg-card-dark border-border-dark text-text-dark"
                    {...companyForm.register('document')}
                    onChange={(e) => {
                      const value = e.target.value;
                      const formatted =
                        documentType === 'cnpj' ? formatCNPJ(value) : formatCPF(value);
                      companyForm.setValue('document', formatted, { shouldValidate: true });
                    }}
                    value={companyForm.watch('document') ?? ''}
                  />
                  {companyForm.formState.errors.document && (
                    <p className="text-sm text-red-400">
                      {String(companyForm.formState.errors.document.message)}
                    </p>
                  )}
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
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continuar
                  <ChevronRight className="ml-2 h-4 w-4" />
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
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-text-dark hover:bg-border-dark"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Continuar
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </form>
          )}

          {/* STEP 3: CATEGORIES */}
          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle className="text-text-dark">Categorias</CardTitle>
                <CardDescription className="text-text-dark/70">
                  Crie categorias para organizar suas transações. Você pode adicionar quantas quiser
                  ou usar as categorias padrão.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories List */}
                {categoriesData.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-text-dark">
                      Categorias Criadas ({categoriesData.length})
                    </Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {categoriesData.map((category, index) => {
                        const iconOption = iconOptions.find((opt) => opt.value === category.icon);
                        const IconComponent = iconOption?.icon ?? Tags;
                        const typeOption = categoryTypes.find(
                          (type) => type.value === category.type,
                        );
                        const TypeIcon = typeOption?.icon ?? TrendingDown;
                        return (
                          <div
                            key={`category-${index}-${category.name}`}
                            className="flex items-center justify-between p-3 bg-card-dark/50 border border-border-dark rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: category.color }}
                              >
                                <IconComponent className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <div className="text-text-dark font-medium">{category.name}</div>
                                <div className="flex items-center gap-1 text-xs text-text-dark/60">
                                  <TypeIcon className="h-3 w-3" />
                                  {categoryTypes.find((t) => t.value === category.type)?.label}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              type="button"
                              size="sm"
                              onClick={() => handleRemoveCategory(index)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Category Form */}
                <div className="space-y-4 border-t border-border-dark pt-4">
                  <Label className="text-text-dark">Adicionar Nova Categoria</Label>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryName" className="text-text-dark">
                        Nome da Categoria
                      </Label>
                      <Input
                        id="categoryName"
                        placeholder="Ex: Alimentação, Transporte..."
                        className="bg-card-dark border-border-dark text-text-dark"
                        value={currentCategoryForm.name}
                        onChange={(e) =>
                          setCurrentCategoryForm({ ...currentCategoryForm, name: e.target.value })
                        }
                      />
                      {categoryFormErrors.name && (
                        <p className="text-sm text-red-400">{categoryFormErrors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-text-dark">Tipo</Label>
                      <Select
                        value={currentCategoryForm.type}
                        onValueChange={(value) =>
                          setCurrentCategoryForm({
                            ...currentCategoryForm,
                            type: value as 'income' | 'expense',
                          })
                        }
                      >
                        <SelectTrigger className="bg-card-dark border-border-dark text-text-dark">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card-dark border-border-dark text-text-dark">
                          {categoryTypes.map((opt) => {
                            const TypeIcon = opt.icon;
                            return (
                              <SelectItem
                                key={opt.value}
                                value={opt.value}
                                className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                              >
                                <div className="flex items-center gap-2">
                                  <TypeIcon className="h-4 w-4" />
                                  {opt.label}
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-text-dark">Cor</Label>
                        <ColorPicker
                          value={currentCategoryForm.color}
                          onChange={(color) =>
                            setCurrentCategoryForm({ ...currentCategoryForm, color })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-text-dark">Ícone</Label>
                        <IconPicker
                          value={currentCategoryForm.icon}
                          onChange={(icon) =>
                            setCurrentCategoryForm({ ...currentCategoryForm, icon })
                          }
                          options={iconOptions.map((opt) => ({
                            value: opt.value,
                            icon: opt.icon,
                          }))}
                        />
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleAddCategory}
                      variant="outline"
                      className="w-full border-border-dark text-text-dark hover:bg-border-dark"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Categoria
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-text-dark hover:bg-border-dark"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => {
                      setCategoriesData([]);
                      setCurrentStep(4);
                    }}
                    className="text-text-dark hover:bg-border-dark"
                  >
                    Pular
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (categoriesData.length > 0) {
                        handleCategoriesNext(categoriesData);
                      } else {
                        // Create default categories if none were added
                        const defaultCategories: CategoryFormData[] = [
                          { name: 'Alimentação', type: 'expense', color: '#EF4444', icon: 'Tags' },
                          { name: 'Transporte', type: 'expense', color: '#3B82F6', icon: 'Tags' },
                          { name: 'Moradia', type: 'expense', color: '#10B981', icon: 'Tags' },
                          { name: 'Salário', type: 'income', color: '#22C55E', icon: 'TrendingUp' },
                        ];
                        handleCategoriesNext(defaultCategories);
                      }
                    }}
                    className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90"
                  >
                    {categoriesData.length > 0 ? 'Continuar' : 'Usar Categorias Padrão'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          )}

          {/* STEP 4: GOALS */}
          {currentStep === 4 && (
            <form onSubmit={goalForm.handleSubmit((data) => handleGoalNext(data))}>
              <CardHeader>
                <CardTitle className="text-text-dark">Metas</CardTitle>
                <CardDescription className="text-text-dark/70">
                  Defina uma meta financeira para acompanhar seu progresso. Você pode pular esta
                  etapa.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goalName" className="text-text-dark">
                    Nome da Meta
                  </Label>
                  <Input
                    id="goalName"
                    placeholder="Ex: Reserva de emergência, Viagem..."
                    className="bg-card-dark border-border-dark text-text-dark"
                    {...goalForm.register('name')}
                  />
                  {goalForm.formState.errors.name && (
                    <p className="text-sm text-red-400">
                      {String(goalForm.formState.errors.name.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalDescription" className="text-text-dark">
                    Descrição (Opcional)
                  </Label>
                  <Input
                    id="goalDescription"
                    placeholder="Descreva sua meta..."
                    className="bg-card-dark border-border-dark text-text-dark"
                    {...goalForm.register('description')}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalTargetAmount" className="text-text-dark">
                    Valor Alvo
                  </Label>
                  <Input
                    id="goalTargetAmount"
                    type="text"
                    placeholder="R$ 0,00"
                    value={goalTargetAmountInput}
                    onChange={(e) => {
                      const formatted = formatCurrencyInput(e.target.value);
                      setGoalTargetAmountInput(formatted);
                      goalForm.setValue('targetAmount', parseCurrency(formatted));
                    }}
                    className="bg-card-dark border-border-dark text-text-dark"
                  />
                  {goalForm.formState.errors.targetAmount && (
                    <p className="text-sm text-red-400">
                      {String(goalForm.formState.errors.targetAmount.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalDeadline" className="text-text-dark">
                    Data Limite
                  </Label>
                  <DatePicker
                    value={goalForm.watch('deadline') || undefined}
                    onChange={(date) => {
                      const dateString = date ? formatDateToLocalISO(date) : '';
                      goalForm.setValue('deadline', dateString);
                    }}
                    placeholder="Selecionar data limite"
                    className="bg-card-dark border-border-dark text-text-dark"
                  />
                  {goalForm.formState.errors.deadline && (
                    <p className="text-sm text-red-400">
                      {String(goalForm.formState.errors.deadline.message)}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goalAccountId" className="text-text-dark">
                    Conta
                  </Label>
                  <Input
                    id="goalAccountId"
                    value={accountData?.name || 'Será usada a conta criada anteriormente'}
                    disabled
                    className="bg-card-dark/50 border-border-dark text-text-dark/50"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-text-dark hover:bg-border-dark"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => handleGoalNext(null)}
                    className="text-text-dark hover:bg-border-dark"
                  >
                    Pular
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90"
                  >
                    Continuar
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </form>
          )}

          {/* STEP 5: RECURRING TRANSACTIONS */}
          {currentStep === 5 && (
            <form
              onSubmit={recurringTransactionForm.handleSubmit((data) =>
                handleRecurringTransactionNext(data),
              )}
            >
              <CardHeader>
                <CardTitle className="text-text-dark">Transações Recorrentes</CardTitle>
                <CardDescription className="text-text-dark/70">
                  Configure transações que se repetem automaticamente. Você pode pular esta etapa.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recurringDescription" className="text-text-dark">
                    Descrição
                  </Label>
                  <Input
                    id="recurringDescription"
                    placeholder="Ex: Aluguel, Internet, Salário..."
                    className="bg-card-dark border-border-dark text-text-dark"
                    {...recurringTransactionForm.register('description')}
                  />
                  {recurringTransactionForm.formState.errors.description && (
                    <p className="text-sm text-red-400">
                      {String(recurringTransactionForm.formState.errors.description.message)}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recurringType" className="text-text-dark">
                      Tipo
                    </Label>
                    <Select
                      value={recurringTransactionForm.watch('type')}
                      onValueChange={(value) =>
                        recurringTransactionForm.setValue('type', value as 'Income' | 'Expense')
                      }
                    >
                      <SelectTrigger className="bg-card-dark border-border-dark text-text-dark">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card-dark border-border-dark text-text-dark">
                        <SelectItem
                          value="Income"
                          className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                        >
                          Receita
                        </SelectItem>
                        <SelectItem
                          value="Expense"
                          className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                        >
                          Despesa
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recurringValue" className="text-text-dark">
                      Valor
                    </Label>
                    <Input
                      id="recurringValue"
                      type="text"
                      placeholder="R$ 0,00"
                      value={recurringTransactionValueInput}
                      onChange={(e) => {
                        const formatted = formatCurrencyInput(e.target.value);
                        setRecurringTransactionValueInput(formatted);
                        recurringTransactionForm.setValue('value', parseCurrency(formatted));
                      }}
                      className="bg-card-dark border-border-dark text-text-dark"
                    />
                    {recurringTransactionForm.formState.errors.value && (
                      <p className="text-sm text-red-400">
                        {String(recurringTransactionForm.formState.errors.value.message)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recurringCategory" className="text-text-dark">
                    Categoria
                  </Label>
                  <Input
                    id="recurringCategory"
                    placeholder="Ex: Alimentação, Transporte..."
                    className="bg-card-dark border-border-dark text-text-dark"
                    {...recurringTransactionForm.register('category')}
                  />
                  <p className="text-xs text-text-dark/50">
                    Nome da categoria (pode ser uma das categorias criadas anteriormente ou nova)
                  </p>
                  {recurringTransactionForm.formState.errors.category && (
                    <p className="text-sm text-red-400">
                      {String(recurringTransactionForm.formState.errors.category.message)}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recurringFrequency" className="text-text-dark">
                      Frequência
                    </Label>
                    <Select
                      value={recurringTransactionForm.watch('frequency')}
                      onValueChange={(value) =>
                        recurringTransactionForm.setValue(
                          'frequency',
                          value as 'daily' | 'weekly' | 'monthly' | 'yearly',
                        )
                      }
                    >
                      <SelectTrigger className="bg-card-dark border-border-dark text-text-dark">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card-dark border-border-dark text-text-dark">
                        <SelectItem
                          value="daily"
                          className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                        >
                          Diária
                        </SelectItem>
                        <SelectItem
                          value="weekly"
                          className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                        >
                          Semanal
                        </SelectItem>
                        <SelectItem
                          value="monthly"
                          className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                        >
                          Mensal
                        </SelectItem>
                        <SelectItem
                          value="yearly"
                          className="text-text-dark hover:bg-border-dark focus:bg-border-dark"
                        >
                          Anual
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recurringAccountId" className="text-text-dark">
                      Conta
                    </Label>
                    <Input
                      id="recurringAccountId"
                      value={accountData?.name || 'Será usada a conta criada anteriormente'}
                      disabled
                      className="bg-card-dark/50 border-border-dark text-text-dark/50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recurringStartDate" className="text-text-dark">
                      Data Inicial
                    </Label>
                    <DatePicker
                      value={recurringTransactionForm.watch('startDate') || undefined}
                      onChange={(date) => {
                        const dateString = date ? formatDateToLocalISO(date) : '';
                        recurringTransactionForm.setValue('startDate', dateString);
                      }}
                      placeholder="Selecionar data inicial"
                      className="bg-card-dark border-border-dark text-text-dark"
                    />
                    {recurringTransactionForm.formState.errors.startDate && (
                      <p className="text-sm text-red-400">
                        {String(recurringTransactionForm.formState.errors.startDate.message)}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recurringRepeatUntil" className="text-text-dark">
                      Data Final
                    </Label>
                    <DatePicker
                      value={recurringTransactionForm.watch('repeatUntil') || undefined}
                      onChange={(date) => {
                        const dateString = date ? formatDateToLocalISO(date) : '';
                        recurringTransactionForm.setValue('repeatUntil', dateString);
                      }}
                      placeholder="Selecionar data final"
                      minDate={
                        recurringTransactionForm.watch('startDate')
                          ? parseLocalDate(recurringTransactionForm.watch('startDate'))
                          : undefined
                      }
                      className="bg-card-dark border-border-dark text-text-dark"
                    />
                    {recurringTransactionForm.formState.errors.repeatUntil && (
                      <p className="text-sm text-red-400">
                        {String(recurringTransactionForm.formState.errors.repeatUntil.message)}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="text-text-dark hover:bg-border-dark"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => handleRecurringTransactionNext(null)}
                    className="text-text-dark hover:bg-border-dark"
                  >
                    Pular
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90"
                  >
                    Continuar
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </form>
          )}

          {/* STEP 6: FINISH */}
          {currentStep === 6 && (
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
              <CardFooter className="flex justify-between">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="text-text-dark hover:bg-border-dark"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  size="lg"
                  onClick={handleComplete}
                  disabled={loading}
                  className="bg-brand-leaf text-brand-arrow hover:bg-brand-leaf/90"
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
