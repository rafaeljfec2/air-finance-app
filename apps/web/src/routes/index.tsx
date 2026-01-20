import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorPage } from '@/components/error/ErrorPage';
import { SuspenseLoader } from '@/components/SuspenseLoader';
import { OnboardingGuard } from '@/components/auth/OnboardingGuard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RequireGod } from '@/components/auth/RequireGod';
import { ConfirmError, ConfirmProcessing, ConfirmSuccess } from '@/pages/confirm-email';
import { EmailPendingPage } from '@/pages/email-pending';
import { Login } from '@/pages/login';
import { SignUpPage } from '@/pages/signup';
import { TermsOfService } from '@/pages/legal/TermsOfService';
import { PrivacyPolicy } from '@/pages/legal/PrivacyPolicy';
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

// Lazy Components
const AccountsPage = lazy(() =>
  import('@/pages/accounts').then((m) => ({ default: m.AccountsPage })),
);
const StatementSchedulePage = lazy(() =>
  import('@/pages/accounts/statement-schedule/index').then((m) => ({
    default: m.StatementSchedulePage,
  })),
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
const Dashboard = lazy(() =>
  import('@/pages/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })),
);
const HomePage = lazy(() => import('@/pages/home').then((m) => ({ default: m.HomePage })));
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
const PlannerPage = lazy(() => import('@/pages/planner').then((m) => ({ default: m.PlannerPage })));
const Profile = lazy(() => import('@/pages/profile').then((m) => ({ default: m.Profile })));
const Receivables = lazy(() =>
  import('@/pages/receivables').then((m) => ({ default: m.Receivables })),
);
const RecurringTransactionsPage = lazy(() =>
  import('@/pages/recurring-transactions').then((m) => ({ default: m.RecurringTransactionsPage })),
);
const Reports = lazy(() => import('@/pages/reports').then((m) => ({ default: m.Reports })));
const Settings = lazy(() => import('@/pages/settings').then((m) => ({ default: m.Settings })));
const NotificationsPage = lazy(() =>
  import('@/pages/settings/notifications').then((m) => ({ default: m.NotificationsPage })),
);
const PreferencesPage = lazy(() =>
  import('@/pages/settings/preferences').then((m) => ({ default: m.PreferencesPage })),
);
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
const SubscriptionManagementPage = lazy(() =>
  import('@/pages/settings/subscription').then((m) => ({ default: m.SubscriptionManagementPage })),
);
const FinancialHealthPage = lazy(() =>
  import('@/pages/financial-health/FinancialHealthPage').then((m) => ({
    default: m.FinancialHealthPage,
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

/**
 * Helper function to create protected routes with common wrappers
 */
function createProtectedRoute(
  path: string,
  Component: React.ComponentType<Record<string, unknown>>,
  options: {
    requireOnboarding?: boolean;
    requireGod?: boolean;
    errorCode?: number;
  } = {},
): RouteObject {
  const { requireOnboarding = false, requireGod = false, errorCode } = options;

  let element: React.ReactNode = (
    <Suspense fallback={<SuspenseLoader />}>
      <Component />
    </Suspense>
  );

  if (requireGod) {
    element = <RequireGod>{element}</RequireGod>;
  }

  if (requireOnboarding) {
    element = <OnboardingGuard>{element}</OnboardingGuard>;
  }

  element = (
    <ErrorBoundary>
      <ProtectedRoute>{element}</ProtectedRoute>
    </ErrorBoundary>
  );

  return {
    path,
    element,
    errorElement: errorCode ? <ErrorPage code={errorCode} /> : <ErrorPage />,
  };
}

/**
 * Helper function to create simple protected routes without onboarding
 */
function createSimpleProtectedRoute(
  path: string,
  Component: React.ComponentType<Record<string, unknown>>,
): RouteObject {
  return createProtectedRoute(path, Component);
}

/**
 * Helper function to create public routes
 */
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

export const router = createBrowserRouter([
  // ==================== PUBLIC ROUTES ====================
  createPublicRoute('/', LandingPageV2),
  createPublicRoute('/landing-v2', LandingPageV2),
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <SignUpPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/confirm',
    element: <ConfirmProcessing />,
  },
  {
    path: '/confirm/success',
    element: <ConfirmSuccess />,
  },
  {
    path: '/confirm/error',
    element: <ConfirmError />,
  },
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

  // ==================== PROTECTED ROUTES WITH ONBOARDING ====================
  createProtectedRoute('/onboarding', OnboardingPage, { errorCode: 500 }),
  createProtectedRoute('/home', HomePage, { requireOnboarding: true, errorCode: 500 }),
  createProtectedRoute('/dashboard', Dashboard, { requireOnboarding: true, errorCode: 500 }),
  createProtectedRoute('/financial-health', FinancialHealthPage, {
    requireOnboarding: true,
    errorCode: 500,
  }),
  createProtectedRoute('/transactions', Transactions, { requireOnboarding: true }),
  createProtectedRoute('/reports', Reports, { requireOnboarding: true }),

  // ==================== PROTECTED ROUTES (SIMPLE) ====================
  createSimpleProtectedRoute('/email-pending', EmailPendingPage),
  createSimpleProtectedRoute('/dependents', DependentsPage),
  createSimpleProtectedRoute('/categories', CategoriesPage),
  createSimpleProtectedRoute('/accounts', AccountsPage),
  createSimpleProtectedRoute('/accounts/:accountId/statement-schedule', StatementSchedulePage),
  createSimpleProtectedRoute('/business-logs', BusinessLogsPage),
  createSimpleProtectedRoute('/profile', Profile),
  createSimpleProtectedRoute('/import-ofx', ImportOfxPage),
  createSimpleProtectedRoute('/budget', BudgetPage),
  createSimpleProtectedRoute('/statement', Statement),
  createSimpleProtectedRoute('/transactions/new', NewTransaction),
  createSimpleProtectedRoute('/credit-cards', CreditCardsPage),
  createSimpleProtectedRoute('/goals', GoalsPage),
  createSimpleProtectedRoute('/recurring-transactions', RecurringTransactionsPage),
  createSimpleProtectedRoute('/income-sources', IncomeSourcesPage),
  createSimpleProtectedRoute('/companies', CompaniesPage),
  createSimpleProtectedRoute('/users', UsersPage),
  createSimpleProtectedRoute('/payables', Payables),
  createSimpleProtectedRoute('/receivables', Receivables),
  createSimpleProtectedRoute('/monthly-closing', MonthlyClosing),
  createSimpleProtectedRoute('/annual-result', AnnualResult),
  createSimpleProtectedRoute('/planner', PlannerPage),
  createSimpleProtectedRoute('/settings/preferences', PreferencesPage),
  createSimpleProtectedRoute('/settings/notifications', NotificationsPage),
  createSimpleProtectedRoute('/ai/classification', AiClassificationPage),

  // ==================== ADMIN ROUTES (REQUIRE GOD) ====================
  createProtectedRoute('/admin/openai-logs', OpenAILogsPage, { requireGod: true }),
  createProtectedRoute('/admin/plans', PlansAdminPage, { requireGod: true }),

  // ==================== SETTINGS ROUTES (SPECIAL HANDLING) ====================
  {
    path: '/settings',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <Settings />
      </Suspense>
    ),
  },
  {
    path: '/settings/subscription',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <SubscriptionManagementPage />
      </Suspense>
    ),
  },
  {
    path: '/settings/categories',
    element: <div>Categorias</div>,
  },
  {
    path: '/settings/accounts',
    element: <div>Contas bancárias</div>,
  },
  {
    path: '/settings/cards',
    element: <div>Cartões</div>,
  },
  {
    path: '/settings/goals',
    element: <div>Metas</div>,
  },
  {
    path: '/settings/reminders',
    element: <div>Lembretes</div>,
  },
  {
    path: '/settings/export',
    element: <div>Exportar dados</div>,
  },

  // ==================== PLACEHOLDER ROUTES ====================
  {
    path: '/privacy-policy',
    element: <div>Política de privacidade</div>,
  },
  {
    path: '/support',
    element: <div>Ajuda e suporte</div>,
  },

  // ==================== 404 ROUTE ====================
  {
    path: '*',
    element: <ErrorPage code={404} />,
  },
]);
