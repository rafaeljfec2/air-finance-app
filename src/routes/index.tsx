import { createBrowserRouter } from 'react-router-dom';
import { Login } from '@/pages/login';
import { SignUpPage } from '@/pages/signup';
import { ForgotPasswordPage } from '@/pages/forgot-password';
import { NewPasswordPage } from '@/pages/new-password';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorPage } from '@/components/error/ErrorPage';
import { Statement } from '@/pages/statement';
import { NewTransaction } from '@/pages/transactions/new';
import { Transactions } from '@/pages/transactions';
import { Reports } from '@/pages/reports';
import { Profile } from '@/pages/profile';
import { Settings } from '@/pages/settings';
import { LandingPage } from '@/pages/landing';
import { AiClassificationPage } from '@/pages/ai-classification';
import { ImportOfxPage } from '@/pages/import-ofx';
import { BudgetPage } from '@/pages/budget';
import { AccountsPage } from '@/pages/accounts';
import { CategoriesPage } from '@/pages/categories';
import { DependentsPage } from '@/pages/dependents';
import { CreditCardsPage } from '@/pages/credit-cards';
import { GoalsPage } from '@/pages/goals';
import { IncomeSourcesPage } from '@/pages/incomeSources';
import { CompaniesPage } from '@/pages/companies';
import { UsersPage } from '@/pages/users';
import { Payables } from '@/pages/payables';
import { Receivables } from '@/pages/receivables';
import { MonthlyClosing } from '@/pages/monthly-closing';
import { AnnualResult } from '@/pages/annual-result';

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
    path: '*',
    element: <ErrorPage code={404} />,
  },
]);
