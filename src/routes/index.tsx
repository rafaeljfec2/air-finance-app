import { OnboardingGuard } from '@/components/auth/OnboardingGuard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { RequireGod } from '@/components/auth/RequireGod';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorPage } from '@/components/error/ErrorPage';
import { SuspenseLoader } from '@/components/SuspenseLoader';
import { ConfirmError, ConfirmProcessing, ConfirmSuccess } from '@/pages/confirm-email';
import { EmailPendingPage } from '@/pages/email-pending';
import { LandingPage } from '@/pages/landing';
import { Login } from '@/pages/login';
import { SignUpPage } from '@/pages/signup';
import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Lazy Components
const AccountsPage = lazy(() =>
  import('@/pages/accounts').then((m) => ({ default: m.AccountsPage })),
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
// ... existing imports ...
const OpenAILogsPage = lazy(() =>
  import('@/pages/admin/openai-logs').then((m) => ({ default: m.OpenAILogsPage })),
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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <SignUpPage />,
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
  {
    path: '/email-pending',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <EmailPendingPage />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <ForgotPasswordPage />
      </Suspense>
    ),
  },
  {
    path: '/new-password',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <NewPasswordPage />
      </Suspense>
    ),
  },
  {
    path: '/reset-password/:token',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <ForgotPasswordPage />
      </Suspense>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <OnboardingGuard>
            <Suspense fallback={<SuspenseLoader />}>
              <OnboardingPage />
            </Suspense>
          </OnboardingGuard>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <OnboardingGuard>
            <Suspense fallback={<SuspenseLoader />}>
              <Dashboard />
            </Suspense>
          </OnboardingGuard>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: '/financial-health',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <OnboardingGuard>
            <Suspense fallback={<SuspenseLoader />}>
              <FinancialHealthPage />
            </Suspense>
          </OnboardingGuard>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: '/dependents',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <DependentsPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/categories',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <CategoriesPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: '/accounts',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <AccountsPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/business-logs',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <BusinessLogsPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/profile',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <Profile />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/import-ofx',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <ImportOfxPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/budget',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <BudgetPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/statement',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <Statement />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/transactions/new',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <NewTransaction />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/transactions',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <OnboardingGuard>
            <Suspense fallback={<SuspenseLoader />}>
              <Transactions />
            </Suspense>
          </OnboardingGuard>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/reports',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <OnboardingGuard>
            <Suspense fallback={<SuspenseLoader />}>
              <Reports />
            </Suspense>
          </OnboardingGuard>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/settings',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <Settings />
      </Suspense>
    ),
  },
  {
    path: '/pricing',
    element: (
      <Suspense fallback={<SuspenseLoader />}>
        <PricingPage />
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
  {
    path: '/privacy-policy',
    element: <div>Política de privacidade</div>,
  },
  {
    path: '/support',
    element: <div>Ajuda e suporte</div>,
  },
  {
    path: '/ai/classification',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <AiClassificationPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },

  {
    path: '/credit-cards',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <CreditCardsPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/goals',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <GoalsPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/recurring-transactions',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <RecurringTransactionsPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/income-sources',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <IncomeSourcesPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/companies',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <CompaniesPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/users',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <UsersPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/payables',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <Payables />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/receivables',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <Receivables />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/monthly-closing',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <MonthlyClosing />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/annual-result',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <AnnualResult />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/planner',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <PlannerPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/settings/preferences',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <PreferencesPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/settings/notifications',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Suspense fallback={<SuspenseLoader />}>
            <NotificationsPage />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/admin/openai-logs',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <RequireGod>
            <Suspense fallback={<SuspenseLoader />}>
              <OpenAILogsPage />
            </Suspense>
          </RequireGod>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage code={404} />,
  },
]);
