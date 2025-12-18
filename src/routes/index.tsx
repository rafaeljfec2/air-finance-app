import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorPage } from '@/components/error/ErrorPage';
import { AccountsPage } from '@/pages/accounts';
import { AiClassificationPage } from '@/pages/ai-classification';
import { AnnualResult } from '@/pages/annual-result';
import { BudgetPage } from '@/pages/budget';
import { CategoriesPage } from '@/pages/categories';
import { CompaniesPage } from '@/pages/companies';
import { CreditCardsPage } from '@/pages/credit-cards';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { DependentsPage } from '@/pages/dependents';
import { ForgotPasswordPage } from '@/pages/forgot-password';
import { GoalsPage } from '@/pages/goals';
import { ImportOfxPage } from '@/pages/import-ofx';
import { RecurringTransactionsPage } from '@/pages/recurring-transactions';
import { IncomeSourcesPage } from '@/pages/income-sources';
import { LandingPage } from '@/pages/landing';
import { Login } from '@/pages/login';
import { MonthlyClosing } from '@/pages/monthly-closing';
import { NewPasswordPage } from '@/pages/new-password';
import { Payables } from '@/pages/payables';
import { PlannerPage } from '@/pages/planner';
import { Profile } from '@/pages/profile';
import { Receivables } from '@/pages/receivables';
import { Reports } from '@/pages/reports';
import { Settings } from '@/pages/settings';
import { NotificationsPage } from '@/pages/settings/notifications';
import { PreferencesPage } from '@/pages/settings/preferences';
import { SignUpPage } from '@/pages/signup';
import { Statement } from '@/pages/statement';
import { Transactions } from '@/pages/transactions';
import { NewTransaction } from '@/pages/transactions/new';
import { UsersPage } from '@/pages/users';
import { createBrowserRouter } from 'react-router-dom';

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
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/new-password',
    element: <NewPasswordPage />,
  },
  {
    path: '/reset-password/:token',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: '/dependents',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <DependentsPage />
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
          <CategoriesPage />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
  },
  {
    path: '/accounts',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <AccountsPage />
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
          <Profile />
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
          <ImportOfxPage />
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
          <BudgetPage />
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
          <Statement />
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
          <NewTransaction />
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
          <Transactions />
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
          <Reports />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/settings',
    element: <Settings />,
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
    element: <AiClassificationPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/credit-cards',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <CreditCardsPage />
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
          <GoalsPage />
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
          <RecurringTransactionsPage />
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
          <IncomeSourcesPage />
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
          <CompaniesPage />
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
          <UsersPage />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/ai/classification',
    element: <AiClassificationPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/payables',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <Payables />
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
          <Receivables />
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
          <MonthlyClosing />
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
          <AnnualResult />
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
          <PlannerPage />
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
          <PreferencesPage />
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
          <NotificationsPage />
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
