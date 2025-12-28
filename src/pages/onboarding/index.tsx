import { Card } from '@/components/ui/card';
import { useActiveCompany } from '@/hooks/useActiveCompany';
import { useAuth } from '@/hooks/useAuth';
import { apiClient as api } from '@/services/apiClient';
import { useQueryClient } from '@tanstack/react-query';
import { AnimatePresence } from 'framer-motion';
import { Banknote, Building2, CheckCircle2, Flag, Repeat, Sparkles, Tags } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountStep } from './components/AccountStep';
import { CategoriesStep } from './components/CategoriesStep';
import { CompanyStep } from './components/CompanyStep';
import { FinishStep } from './components/FinishStep';
import { GoalsStep } from './components/GoalsStep';
import { RecurringStep } from './components/RecurringStep';
import { StepIndicator } from './components/StepIndicator';
import { WelcomeStep } from './components/WelcomeStep';
import type {
  AccountFormData,
  CategoryFormData,
  CompanyFormData,
  GoalFormData,
  RecurringTransactionFormData,
} from './schemas';

// Define steps configuration
const steps = [
  { icon: Sparkles, label: 'Bem-vindo' },
  { icon: Building2, label: 'Empresa' },
  { icon: Banknote, label: 'Conta' },
  { icon: Tags, label: 'Categorias' },
  { icon: Flag, label: 'Metas' },
  { icon: Repeat, label: 'Recorrentes' },
  { icon: CheckCircle2, label: 'Conclusão' },
];

export default function OnboardingPage() {
  const { user, refetchUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { clearActiveCompany } = useActiveCompany();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    company: null as CompanyFormData | null,
    account: null as AccountFormData | null,
    categories: [] as CategoryFormData[],
    goal: null as GoalFormData | null,
    recurringTransaction: null as RecurringTransactionFormData | null,
  });

  // Ensure user has verified email and hasn't completed onboarding
  useEffect(() => {
    // Redirect if email is not verified
    if (user && user.emailVerified !== true) {
      navigate('/dashboard');
      return;
    }

    // Redirect if onboarding is already completed
    if (user?.onboardingCompleted) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleCompanySubmit = (data: CompanyFormData) => {
    setFormData((prev) => ({ ...prev, company: data }));
    handleNextStep();
  };

  const handleAccountSubmit = (data: AccountFormData) => {
    setFormData((prev) => ({ ...prev, account: data }));
    handleNextStep();
  };

  const handleCategoriesSubmit = (data: CategoryFormData[]) => {
    setFormData((prev) => ({ ...prev, categories: data }));
    handleNextStep();
  };

  const handleGoalSubmit = (data: GoalFormData | null) => {
    setFormData((prev) => ({ ...prev, goal: data }));
    handleNextStep();
  };

  const handleRecurringSubmit = (data: RecurringTransactionFormData | null) => {
    setFormData((prev) => ({ ...prev, recurringTransaction: data }));
    handleNextStep();
  };

  /**
   * Maps company form data to backend API format
   */
  const mapCompanyPayload = (company: CompanyFormData): Record<string, unknown> => {
    const payload: Record<string, unknown> = {
      name: company.name,
      type: company.type,
      foundationDate: new Date().toISOString().split('T')[0],
      cnpj: '00000000000000', // Default placeholder
    };

    // Remove formatting from document (dots, slashes, hyphens) before sending
    if (company.document?.trim()) {
      payload.cnpj = company.document.replace(/\D/g, '');
    }

    return payload;
  };

  /**
   * Creates a company and returns its ID
   */
  const createCompany = async (company: CompanyFormData): Promise<string> => {
    const companyPayload = mapCompanyPayload(company);
    const response = await api.post('/companies', companyPayload);
    return response.data.id || response.data._id;
  };

  /**
   * Maps account form data to backend API format
   */
  const mapAccountPayload = (
    account: AccountFormData,
    companyId: string,
  ): Record<string, unknown> => {
    const payload: Record<string, unknown> = {
      companyId,
      name: account.name,
      type: account.type,
      institution: account.institution,
      initialBalance: account.initialBalance ?? 0,
      initialBalanceDate: new Date().toISOString(),
      color: account.color ?? '#8A05BE',
      icon: account.icon ?? 'Banknote',
    };

    // Backend requires agency and accountNumber to be non-empty strings
    // Use empty string as default if not provided
    if (account.agency?.trim()) {
      payload.agency = account.agency.trim();
    } else {
      payload.agency = '';
    }

    if (account.accountNumber?.trim()) {
      payload.accountNumber = account.accountNumber.trim();
    } else {
      payload.accountNumber = '';
    }

    return payload;
  };

  /**
   * Creates an account and returns its ID
   */
  const createAccount = async (account: AccountFormData, companyId: string): Promise<string> => {
    const accountPayload = mapAccountPayload(account, companyId);
    const response = await api.post(`/companies/${companyId}/accounts`, accountPayload);
    return response.data.id || response.data._id;
  };

  /**
   * Creates all categories for the company
   */
  const createCategories = async (
    categories: CategoryFormData[],
    companyId: string,
  ): Promise<void> => {
    await Promise.all(
      categories.map((category) =>
        api.post(`/companies/${companyId}/categories`, {
          ...category,
          companyId,
        }),
      ),
    );
  };

  /**
   * Creates a goal if provided
   */
  const createGoal = async (
    goal: GoalFormData,
    companyId: string,
    accountId?: string,
  ): Promise<void> => {
    await api.post('/goals', {
      ...goal,
      companyId,
      accountId: accountId || undefined,
    });
  };

  /**
   * Creates a recurring transaction if provided
   */
  const createRecurringTransaction = async (
    recurringTransaction: RecurringTransactionFormData,
    companyId: string,
    accountId?: string,
  ): Promise<void> => {
    await api.post('/recurring-transactions', {
      ...recurringTransaction,
      companyId,
      accountId: accountId || undefined,
    });
  };

  /**
   * Marks onboarding as complete and redirects to dashboard
   */
  const completeOnboarding = async (): Promise<void> => {
    const response = await api.post('/user/onboarding/complete');
    if (response.status === 201 || response.status === 200) {
      // Clear active company to ensure user selects company after onboarding
      clearActiveCompany();
      // Invalidate companies query to ensure fresh data is fetched after onboarding
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      await refetchUser();
      navigate('/dashboard');
    }
  };

  /**
   * Handles the final completion of the onboarding process
   * Creates all entities in sequence: company, account, categories, goal, recurring transaction
   */
  const handleFinalCompletion = async (): Promise<void> => {
    setIsLoading(true);

    try {
      if (!formData.company) {
        throw new Error('Dados da empresa são obrigatórios');
      }

      // 1. Create company
      const companyId = await createCompany(formData.company);

      // 2. Create account (optional)
      let accountId: string | undefined;
      if (formData.account) {
        accountId = await createAccount(formData.account, companyId);
      }

      // 3. Create categories
      if (formData.categories.length > 0) {
        await createCategories(formData.categories, companyId);
      }

      // 4. Create goal (optional)
      if (formData.goal) {
        await createGoal(formData.goal, companyId, accountId);
      }

      // 5. Create recurring transaction (optional)
      if (formData.recurringTransaction) {
        await createRecurringTransaction(formData.recurringTransaction, companyId, accountId);
      }

      // 6. Complete onboarding
      await completeOnboarding();
    } catch (error) {
      console.error('Erro ao finalizar onboarding:', error);
      // TODO: Show user-friendly error message (toast/alert)
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background dark:bg-background-dark min-h-screen w-full flex items-center justify-center p-2 sm:p-4 py-4 sm:py-8 relative overflow-hidden">
      <div className="max-w-4xl w-full z-10">
        <div className="mb-4 sm:mb-8">
          <StepIndicator currentStep={currentStep} steps={steps} />
        </div>

        <Card className="border border-border dark:border-border-dark shadow-2xl bg-card/80 dark:bg-card-dark/80 backdrop-blur-md overflow-hidden relative min-h-[400px] sm:min-h-[500px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {currentStep === 0 && <WelcomeStep onNext={handleNextStep} />}

            {currentStep === 1 && (
              <CompanyStep
                onNext={handleCompanySubmit}
                onBack={handlePrevStep}
                loading={isLoading}
                initialData={formData.company}
              />
            )}

            {currentStep === 2 && (
              <AccountStep
                onNext={handleAccountSubmit}
                onBack={handlePrevStep}
                loading={isLoading}
                initialData={formData.account}
              />
            )}

            {currentStep === 3 && (
              <CategoriesStep
                onNext={handleCategoriesSubmit}
                onBack={handlePrevStep}
                initialData={formData.categories}
              />
            )}

            {currentStep === 4 && (
              <GoalsStep
                onNext={handleGoalSubmit}
                onBack={handlePrevStep}
                accountName={formData.account?.name}
                initialData={formData.goal}
              />
            )}

            {currentStep === 5 && (
              <RecurringStep
                onNext={handleRecurringSubmit}
                onBack={handlePrevStep}
                accountName={formData.account?.name}
                initialData={formData.recurringTransaction}
              />
            )}

            {currentStep === 6 && (
              <FinishStep
                onComplete={handleFinalCompletion}
                onBack={handlePrevStep}
                loading={isLoading}
                summary={{
                  companyName: formData.company?.name ?? '',
                  accountName: formData.account?.name ?? '',
                  categoriesCount: formData.categories.length,
                  goalName: formData.goal?.name,
                  recurringCount: formData.recurringTransaction ? 1 : 0,
                }}
              />
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}
