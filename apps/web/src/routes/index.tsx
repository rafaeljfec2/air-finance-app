import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';

import { OnboardingGuard } from '@/components/auth/OnboardingGuard';
import { RequireGod } from '@/components/auth/RequireGod';
import { ErrorPage } from '@/components/error/ErrorPage';
import { SuspenseLoader } from '@/components/SuspenseLoader';
import { ProtectedLayout } from '@/layouts/ProtectedLayout';
import { AuthCallbackPage } from '@/pages/auth-callback';
import { ConfirmError, ConfirmProcessing, ConfirmSuccess } from '@/pages/confirm-email';
import { EmailPendingPage } from '@/pages/email-pending';
import { PrivacyPolicy } from '@/pages/legal/PrivacyPolicy';
import { TermsOfService } from '@/pages/legal/TermsOfService';
import { Login } from '@/pages/login';
import { SignUpPage } from '@/pages/signup';

// Lazy Components
const AccountsPage = lazy(() =>
  import('@/pages/accounts').then((m) => ({ default: m.AccountsPage })),
);
const StatementSchedulePage = lazy(() =>
  import('@/pages/accounts/statement-schedule/index').then((m) => ({
    default: m.StatementSchedulePage,
  })),
);
const AccountDetailsPage = lazy(() =>
  import('@/pages/accounts/details').then((m) => ({
    default: m.AccountDetailsPage,
  })),
);
const OpenFinancePage = lazy(() =>
  import('@/pages/openfinance').then((m) => ({ default: m.OpenFinancePage })),
);
const AiClassificationPage = lazy(() =>
  import('@/pages/ai-classification').then((m) => ({ default: m.AiClassificationPage })),
);
const AnnualResult = lazy(() =>
  import('@/pages/annual-result').then((m) => ({ default: m.AnnualResult })),
);
const BudgetPage = lazy(() => import('@/pages/budget').then((m) => ({ default: m.BudgetPage })));
const BusinessLogsPage = lazy(() =>
  import('@/pages/business-logs').then((m) => ({ default: m.BusinessLogsPage })),
);
const CategoriesPage = lazy(() =>
  import('@/pages/categories').then((m) => ({ default: m.CategoriesPage })),
);
const CompaniesPage = lazy(() =>
  import('@/pages/companies').then((m) => ({ default: m.CompaniesPage })),
);
const CreditCardsPage = lazy(() =>
  import('@/pages/credit-cards').then((m) => ({ default: m.CreditCardsPage })),
);
const CreditCardBillsPage = lazy(() =>
  import('@/pages/credit-cards/bills/CreditCardBillsGodGate').then((m) => ({
    default: m.CreditCardBillsGodGate,
  })),
);
const CreditCardsV2Page = lazy(() =>
  import('@/pages/credit-cards-v2').then((m) => ({
    default: m.CreditCardsV2Page,
  })),
);
const InsightsPage = lazy(() =>
  import('@/pages/insights').then((m) => ({ default: m.InsightsPage })),
);
const Dashboard = lazy(() =>
  import('@/pages/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })),
);
const HomePage = lazy(() => import('@/pages/home').then((m) => ({ default: m.HomePage })));
const HomePageV2 = lazy(() => import('@/pages/home-v2').then((m) => ({ default: m.HomePageV2 })));
const DependentsPage = lazy(() =>
  import('@/pages/dependents').then((m) => ({ default: m.DependentsPage })),
);
const ForgotPasswordPage = lazy(() =>
  import('@/pages/forgot-password').then((m) => ({ default: m.ForgotPasswordPage })),
);
const GoalsPage = lazy(() => import('@/pages/goals').then((m) => ({ default: m.GoalsPage })));
const ImportOfxPage = lazy(() =>
  import('@/pages/import-ofx').then((m) => ({ default: m.ImportOfxPage })),
);
const IncomeSourcesPage = lazy(() =>
  import('@/pages/income-sources').then((m) => ({ default: m.IncomeSourcesPage })),
);
const MonthlyClosing = lazy(() =>
  import('@/pages/monthly-closing').then((m) => ({ default: m.MonthlyClosing })),
);
const NewPasswordPage = lazy(() =>
  import('@/pages/new-password').then((m) => ({ default: m.NewPasswordPage })),
);
const Payables = lazy(() => import('@/pages/payables').then((m) => ({ default: m.Payables })));
const PaymentsPage = lazy(() =>
  import('@/pages/payments').then((m) => ({ default: m.PaymentsPage })),
);
const NewPaymentPage = lazy(() =>
  import('@/pages/payments/new').then((m) => ({ default: m.NewPayment })),
);
const PlannerPage = lazy(() => import('@/pages/planner').then((m) => ({ default: m.PlannerPage })));
const Profile = lazy(() => import('@/pages/profile').then((m) => ({ default: m.Profile })));
const Receivables = lazy(() =>
  import('@/pages/receivables').then((m) => ({ default: m.Receivables })),
);
const RecurringTransactionsPage = lazy(() =>
  import('@/pages/recurring-transactions').then((m) => ({
    default: m.RecurringTransactionsPage,
  })),
);
const Reports = lazy(() => import('@/pages/reports').then((m) => ({ default: m.Reports })));
const Settings = lazy(() => import('@/pages/settings').then((m) => ({ default: m.Settings })));
const OpenAILogsPage = lazy(() =>
  import('@/pages/admin/openai-logs').then((m) => ({ default: m.OpenAILogsPage })),
);
const PlansAdminPage = lazy(() =>
  import('@/pages/admin/plans').then((m) => ({ default: m.PlansAdminPage })),
);
const Statement = lazy(() => import('@/pages/statement').then((m) => ({ default: m.Statement })));
const Transactions = lazy(() =>
  import('@/pages/transactions').then((m) => ({ default: m.Transactions })),
);
const NewTransaction = lazy(() =>
  import('@/pages/transactions/new').then((m) => ({ default: m.NewTransaction })),
);
const UsersPage = lazy(() => import('@/pages/users').then((m) => ({ default: m.UsersPage })));
const OnboardingPage = lazy(() =>
  import('@/pages/onboarding').then((m) => ({ default: m.default })),
);
const PricingPage = lazy(() => import('@/pages/pricing').then((m) => ({ default: m.PricingPage })));
const FinancialHealthPage = lazy(() =>
  import('@/pages/financial-health/FinancialHealthPage').then((m) => ({
    default: m.FinancialHealthPage,
  })),
);
const FinancialDecisionPage = lazy(() =>
  import('@/pages/decision').then((m) => ({
    default: m.FinancialDecisionPage,
  })),
);

// SEO Pages
const GestaoFinanceiraCPFPage = lazy(() =>
  import('@/pages/seo/gestao-financeira-cpf').then((m) => ({
    default: m.GestaoFinanceiraCPFPage,
  })),
);
const ControleFinanceiroPessoalPage = lazy(() =>
  import('@/pages/seo/gestao-financeira-cpf/controle-financeiro-pessoal').then((m) => ({
    default: m.ControleFinanceiroPessoalPage,
  })),
);
const OrganizacaoFinanceiraPessoalPage = lazy(() =>
  import('@/pages/seo/gestao-financeira-cpf/organizacao-financeira-pessoal').then((m) => ({
    default: m.OrganizacaoFinanceiraPessoalPage,
  })),
);
const CategorizacaoAutomaticaGastosPage = lazy(() =>
  import('@/pages/seo/gestao-financeira-cpf/categorizacao-automatica-gastos').then((m) => ({
    default: m.CategorizacaoAutomaticaGastosPage,
  })),
);
const GestaoFinanceiraComIAPage = lazy(() =>
  import('@/pages/seo/gestao-financeira-cpf/gestao-financeira-com-inteligencia-artificial').then(
    (m) => ({
      default: m.GestaoFinanceiraComIAPage,
    }),
  ),
);
const ScoreCreditoFinancasPessoaisPage = lazy(() =>
  import('@/pages/seo/gestao-financeira-cpf/score-credito-e-financas-pessoais').then((m) => ({
    default: m.ScoreCreditoFinancasPessoaisPage,
  })),
);

const LandingPageV2 = lazy(() =>
  import('@/pages/landing-v2').then((m) => ({
    default: m.LandingPageV2,
  })),
);

const LandingPageV3 = lazy(() =>
  import('@/pages/landing-v3').then((m) => ({
    default: m.LandingPageV3,
  })),
);

const PierreFinanceConfigPage = lazy(() =>
  import('@/pages/pierre-finance-config').then((m) => ({
    default: m.PierreFinanceConfigPage,
  })),
);

function createPublicRoute(
  path: string,
  Component: React.ComponentType<Record<string, unknown>>,
  suspense: boolean = true,
): RouteObject {
  const element = suspense ? (
    <Suspense fallback={<SuspenseLoader />}>
      <Component />
    </Suspense>
  ) : (
    <Component />
  );

  return { path, element };
}

function onboardingRoute(path: string, element: React.ReactNode): RouteObject {
  return {
    path,
    element: <OnboardingGuard>{element}</OnboardingGuard>,
    errorElement: <ErrorPage code={500} />,
  };
}

function simpleRoute(path: string, element: React.ReactNode): RouteObject {
  return { path, element };
}

function godRoute(path: string, element: React.ReactNode): RouteObject {
  return {
    path,
    element: <RequireGod>{element}</RequireGod>,
  };
}

const PROTECTED_ROUTE_IMPORTS: Array<() => Promise<unknown>> = [
  () => import('@/pages/dashboard/Dashboard'),
  () => import('@/pages/home'),
  () => import('@/pages/home-v2'),
  () => import('@/pages/financial-health/FinancialHealthPage'),
  () => import('@/pages/decision'),
  () => import('@/pages/transactions'),
  () => import('@/pages/reports'),
  () => import('@/pages/payments'),
  () => import('@/pages/categories'),
  () => import('@/pages/accounts'),
  () => import('@/pages/accounts/details'),
  () => import('@/pages/openfinance'),
  () => import('@/pages/profile'),
  () => import('@/pages/budget'),
  () => import('@/pages/credit-cards'),
  () => import('@/pages/credit-cards/bills/CreditCardBillsGodGate'),
  () => import('@/pages/credit-cards-v2'),
  () => import('@/pages/insights'),
  () => import('@/pages/goals'),
  () => import('@/pages/recurring-transactions'),
  () => import('@/pages/users'),
  () => import('@/pages/companies'),
  () => import('@/pages/statement'),
  () => import('@/pages/transactions/new'),
  () => import('@/pages/import-ofx'),
  () => import('@/pages/dependents'),
  () => import('@/pages/income-sources'),
  () => import('@/pages/payables'),
  () => import('@/pages/receivables'),
  () => import('@/pages/payments/new'),
  () => import('@/pages/monthly-closing'),
  () => import('@/pages/annual-result'),
  () => import('@/pages/planner'),
  () => import('@/pages/ai-classification'),
  () => import('@/pages/settings'),
  () => import('@/pages/onboarding'),
  () => import('@/pages/business-logs'),
  () => import('@/pages/accounts/statement-schedule/index'),
  () => import('@/pages/admin/openai-logs'),
  () => import('@/pages/admin/plans'),
];

export function preloadProtectedRoutes(): void {
  PROTECTED_ROUTE_IMPORTS.forEach((load) => void load());
}

export const router = createBrowserRouter(
  [
    // ==================== PUBLIC ROUTES ====================
    createPublicRoute('/', LandingPageV3),
    createPublicRoute('/landing-v2', LandingPageV2),
    createPublicRoute('/landing-v3', LandingPageV3),
    createPublicRoute('/pierre-finance-config', PierreFinanceConfigPage),
    { path: '/login', element: <Login /> },
    { path: '/register', element: <SignUpPage /> },
    { path: '/signup', element: <SignUpPage />, errorElement: <ErrorPage /> },
    { path: '/confirm', element: <ConfirmProcessing /> },
    { path: '/confirm/success', element: <ConfirmSuccess /> },
    { path: '/confirm/error', element: <ConfirmError /> },
    createPublicRoute('/forgot-password', ForgotPasswordPage),
    createPublicRoute('/new-password', NewPasswordPage),
    {
      path: '/reset-password/:token',
      element: (
        <Suspense fallback={<SuspenseLoader />}>
          <ForgotPasswordPage />
        </Suspense>
      ),
    },
    { path: '/auth/callback', element: <AuthCallbackPage /> },
    createPublicRoute('/pricing', PricingPage),
    createPublicRoute('/terms', TermsOfService, false),
    createPublicRoute('/privacy', PrivacyPolicy, false),

    // ==================== SEO PAGES ====================
    createPublicRoute('/gestao-financeira-cpf', GestaoFinanceiraCPFPage),
    createPublicRoute(
      '/gestao-financeira-cpf/controle-financeiro-pessoal',
      ControleFinanceiroPessoalPage,
    ),
    createPublicRoute(
      '/gestao-financeira-cpf/organizacao-financeira-pessoal',
      OrganizacaoFinanceiraPessoalPage,
    ),
    createPublicRoute(
      '/gestao-financeira-cpf/categorizacao-automatica-gastos',
      CategorizacaoAutomaticaGastosPage,
    ),
    createPublicRoute(
      '/gestao-financeira-cpf/gestao-financeira-com-inteligencia-artificial',
      GestaoFinanceiraComIAPage,
    ),
    createPublicRoute(
      '/gestao-financeira-cpf/score-credito-e-financas-pessoais',
      ScoreCreditoFinancasPessoaisPage,
    ),

    // ==================== PROTECTED ROUTES (shared layout) ====================
    {
      element: <ProtectedLayout />,
      errorElement: <ErrorPage />,
      children: [
        // --- Routes with onboarding guard ---
        onboardingRoute('/onboarding', <OnboardingPage />),
        onboardingRoute('/home', <HomePage />),
        onboardingRoute('/home-v2', <HomePageV2 />),
        onboardingRoute('/dashboard', <Dashboard />),
        onboardingRoute('/financial-health', <FinancialHealthPage />),
        onboardingRoute('/decision', <FinancialDecisionPage />),
        onboardingRoute('/transactions', <Transactions />),
        onboardingRoute('/reports', <Reports />),
        onboardingRoute('/payments', <PaymentsPage />),

        // --- Simple protected routes ---
        simpleRoute('/email-pending', <EmailPendingPage />),
        simpleRoute('/dependents', <DependentsPage />),
        simpleRoute('/categories', <CategoriesPage />),
        simpleRoute('/accounts', <AccountsPage />),
        simpleRoute('/accounts/:accountId/statement-schedule', <StatementSchedulePage />),
        simpleRoute('/accounts/details', <AccountDetailsPage />),
        simpleRoute('/openfinance', <OpenFinancePage />),
        simpleRoute('/business-logs', <BusinessLogsPage />),
        simpleRoute('/profile', <Profile />),
        simpleRoute('/import-ofx', <ImportOfxPage />),
        simpleRoute('/budget', <BudgetPage />),
        simpleRoute('/statement', <Statement />),
        simpleRoute('/transactions/new', <NewTransaction />),
        simpleRoute('/credit-cards', <CreditCardsPage />),
        simpleRoute('/credit-cards/bills', <CreditCardBillsPage />),
        simpleRoute('/credit-cards-v2', <CreditCardsV2Page />),
        simpleRoute('/insights', <InsightsPage />),
        simpleRoute('/goals', <GoalsPage />),
        simpleRoute('/recurring-transactions', <RecurringTransactionsPage />),
        simpleRoute('/income-sources', <IncomeSourcesPage />),
        simpleRoute('/companies', <CompaniesPage />),
        simpleRoute('/users', <UsersPage />),
        simpleRoute('/payables', <Payables />),
        simpleRoute('/payments/new', <NewPaymentPage />),
        simpleRoute('/receivables', <Receivables />),
        simpleRoute('/monthly-closing', <MonthlyClosing />),
        simpleRoute('/annual-result', <AnnualResult />),
        simpleRoute('/planner', <PlannerPage />),
        simpleRoute('/ai/classification', <AiClassificationPage />),
        simpleRoute('/settings', <Settings />),

        // --- Settings redirects ---
        {
          path: '/settings/preferences',
          element: <Navigate to="/profile?tab=preferences" replace />,
        },
        {
          path: '/settings/notifications',
          element: <Navigate to="/profile?tab=preferences" replace />,
        },
        {
          path: '/settings/integrations',
          element: <Navigate to="/profile?tab=developer" replace />,
        },
        {
          path: '/settings/api-tokens',
          element: <Navigate to="/profile?tab=developer" replace />,
        },
        {
          path: '/settings/subscription',
          element: <Navigate to="/profile?tab=subscription" replace />,
        },
        { path: '/settings/categories', element: <div>Categorias</div> },
        { path: '/settings/accounts', element: <div>Contas bancárias</div> },
        { path: '/settings/cards', element: <div>Cartões</div> },
        { path: '/settings/goals', element: <div>Metas</div> },
        { path: '/settings/reminders', element: <div>Lembretes</div> },
        { path: '/settings/export', element: <div>Exportar dados</div> },

        // --- God routes ---
        godRoute('/admin/openai-logs', <OpenAILogsPage />),
        godRoute('/admin/plans', <PlansAdminPage />),
      ],
    },

    // ==================== PLACEHOLDER ROUTES ====================
    { path: '/privacy-policy', element: <div>Política de privacidade</div> },
    { path: '/support', element: <div>Ajuda e suporte</div> },

    // ==================== 404 ROUTE ====================
    { path: '*', element: <ErrorPage code={404} /> },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
    },
  },
);
