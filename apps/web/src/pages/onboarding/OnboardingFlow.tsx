import { Card } from '@/components/ui/card';
import { apiClient as api } from '@/services/apiClient';
import { AnimatePresence } from 'framer-motion';
import { Banknote, Building2, CheckCircle2, CreditCard, Sparkles, Tags } from 'lucide-react';
import { useState } from 'react';
import { AccountStep } from './components/AccountStep';
import { CategoriesStep } from './components/CategoriesStep';
import { CompanyStep } from './components/CompanyStep';
import { CreditCardStep } from './components/CreditCardStep';
import { FinishStep } from './components/FinishStep';
import { StepIndicator } from './components/StepIndicator';
import { WelcomeStep } from './components/WelcomeStep';
import type {
  AccountFormData,
  CategoryFormData,
  CompanyFormData,
  CreditCardFormData,
} from './schemas';

const STEPS = [
  { icon: Sparkles, label: 'Bem-vindo' },
  { icon: Building2, label: 'Perfil' },
  { icon: Banknote, label: 'Conta' },
  { icon: CreditCard, label: 'Cartão' },
  { icon: Tags, label: 'Categorias' },
  { icon: CheckCircle2, label: 'Conclusão' },
];

export interface OnboardingFlowProps {
  readonly onComplete: () => void | Promise<void>;
  readonly onSkip?: () => void;
  readonly showStepIndicator?: boolean;
}

function mapCompanyPayload(company: CompanyFormData): Record<string, unknown> {
  return {
    name: company.name,
    type: company.type ?? 'matriz',
    foundationDate: new Date().toISOString().split('T')[0],
  };
}

function mapAccountPayload(account: AccountFormData, companyId: string): Record<string, unknown> {
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
  payload.agency = account.agency?.trim() ? account.agency.trim() : '';
  payload.accountNumber = account.accountNumber?.trim() ? account.accountNumber.trim() : '';
  return payload;
}

export function OnboardingFlow({
  onComplete,
  onSkip,
  showStepIndicator = true,
}: Readonly<OnboardingFlowProps>) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: null as CompanyFormData | null,
    account: null as AccountFormData | null,
    creditCard: null as CreditCardFormData | null,
    categories: [] as CategoryFormData[],
  });

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
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

  const handleCreditCardSubmit = (data: CreditCardFormData | null) => {
    setFormData((prev) => ({ ...prev, creditCard: data }));
    handleNextStep();
  };

  const handleCategoriesSubmit = (data: CategoryFormData[]) => {
    setFormData((prev) => ({ ...prev, categories: data }));
    handleNextStep();
  };

  const createCompany = async (company: CompanyFormData): Promise<string> => {
    const payload = mapCompanyPayload(company);
    const response = await api.post('/companies', payload);
    return response.data.id ?? response.data._id;
  };

  const createAccount = async (account: AccountFormData, companyId: string): Promise<string> => {
    const payload = mapAccountPayload(account, companyId);
    const response = await api.post(`/companies/${companyId}/accounts`, payload);
    return response.data.id ?? response.data._id;
  };

  const createCreditCard = async (
    creditCard: CreditCardFormData,
    companyId: string,
  ): Promise<string> => {
    const payload = {
      name: creditCard.name,
      limit: creditCard.limit,
      closingDay: creditCard.closingDay,
      dueDay: creditCard.dueDay,
      color: creditCard.color ?? '#8A05BE',
      icon: creditCard.icon ?? 'CreditCard',
    };
    const response = await api.post(`/companies/${companyId}/credit-cards`, payload);
    return response.data.id ?? response.data._id;
  };

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

  const handleFinalCompletion = async (): Promise<void> => {
    setIsLoading(true);
    try {
      if (!formData.company) {
        throw new Error('Dados da empresa são obrigatórios');
      }
      const companyId = await createCompany(formData.company);
      if (formData.account) {
        await createAccount(formData.account, companyId);
      }
      if (formData.creditCard) {
        await createCreditCard(formData.creditCard, companyId);
      }
      if (formData.categories.length > 0) {
        await createCategories(formData.categories, companyId);
      }
      await api.post('/user/onboarding/complete');
      await onComplete();
    } catch (error) {
      console.error('Erro ao finalizar onboarding:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showStepIndicator && (
        <div className="mb-4 sm:mb-8">
          <StepIndicator currentStep={currentStep} steps={STEPS} />
        </div>
      )}
      <Card className="border border-border dark:border-border-dark shadow-2xl bg-card/80 dark:bg-card-dark/80 backdrop-blur-md overflow-hidden relative min-h-[400px] sm:min-h-[500px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {currentStep === 0 && <WelcomeStep onNext={handleNextStep} onSkip={onSkip} />}

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
            <CreditCardStep
              onNext={handleCreditCardSubmit}
              onBack={handlePrevStep}
              loading={isLoading}
              initialData={formData.creditCard}
            />
          )}

          {currentStep === 4 && (
            <CategoriesStep
              onNext={handleCategoriesSubmit}
              onBack={handlePrevStep}
              initialData={formData.categories}
            />
          )}

          {currentStep === 5 && (
            <FinishStep
              onComplete={handleFinalCompletion}
              onBack={handlePrevStep}
              loading={isLoading}
              summary={{
                companyName: formData.company?.name ?? '',
                accountName: formData.account?.name ?? '',
                creditCardName: formData.creditCard?.name ?? '',
                categoriesCount: formData.categories.length,
              }}
            />
          )}
        </AnimatePresence>
      </Card>
    </>
  );
}
