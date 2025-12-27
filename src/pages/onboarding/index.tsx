import { Card } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { apiClient as api } from '@/services/apiClient';
import { AnimatePresence } from 'framer-motion';
import {
  Banknote,
  Building2,
  CheckCircle2,
  Flag,
  Repeat,
  Sparkles,
  Tags
} from 'lucide-react';
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

  // Ensure user hasn't completed onboarding
  useEffect(() => {
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

  const handleFinalCompletion = async () => {
    setIsLoading(true);
    try {
      // 1. Create Company
      if (!formData.company) throw new Error('Dados da empresa faltando');
      const companyRes = await api.post('/companies', formData.company);
      const companyId = companyRes.data._id;

      // 2. Create Account
      let accountId = '';
      if (formData.account) {
        const accountRes = await api.post('/accounts', {
          ...formData.account,
          companyId,
          initialBalanceDate: new Date().toISOString(),
        });
        accountId = accountRes.data._id;
      }

      // 3. Create Categories
      for (const cat of formData.categories) {
        await api.post(`/categories`, {
          ...cat,
          companyId,
        });
      }

      // 4. Create Goal (Optional)
      if (formData.goal) {
        await api.post(`/goals`, {
          ...formData.goal,
          companyId,
          accountId: accountId || undefined, // Attach to created account if exists
        });
      }

      // 5. Create Recurring Transaction (Optional)
      if (formData.recurringTransaction) {
        await api.post(`/recurring-transactions`, {
          ...formData.recurringTransaction,
          companyId,
          accountId: accountId || undefined,
        });
      }

      // 6. Mark Onboarding as Complete
      const completeRes = await api.post('/user/onboarding/complete');
      if (completeRes.status === 201 || completeRes.status === 200) {
        await refetchUser(); // Update local user state
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao finalizar onboarding:', error);
      // Here you might want to show a toast error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-background via-brand-leaf/5 to-brand-arrow/10 min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-leaf/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-arrow/10 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-4xl w-full z-10">
        <StepIndicator currentStep={currentStep} steps={steps} />

        <Card className="border border-border-dark/50 shadow-2xl bg-card/80 dark:bg-card-dark/80 backdrop-blur-md overflow-hidden relative min-h-[500px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {currentStep === 0 && <WelcomeStep onNext={handleNextStep} />}

            {currentStep === 1 && (
              <CompanyStep
                onNext={handleCompanySubmit}
                onBack={handlePrevStep}
                loading={isLoading}
              />
            )}

            {currentStep === 2 && (
              <AccountStep
                onNext={handleAccountSubmit}
                onBack={handlePrevStep}
                loading={isLoading}
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
              />
            )}

            {currentStep === 5 && (
              <RecurringStep
                onNext={handleRecurringSubmit}
                onBack={handlePrevStep}
                accountName={formData.account?.name}
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
