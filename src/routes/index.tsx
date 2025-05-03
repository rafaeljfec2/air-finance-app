import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { PasswordRecoveryPage } from '../features/auth/pages/PasswordRecoveryPage';
import { ResetPasswordPage } from '../features/auth/pages/ResetPasswordPage';
import { ProtectedRoute } from '../features/auth/components/ProtectedRoute';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { ErrorBoundary } from '../components/error/ErrorBoundary';
import { ErrorPage } from '../components/error/ErrorPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { Statement } from '@/pages/statement';
import { NewTransaction } from '@/pages/transactions/new';
import { Transactions } from '@/pages/transactions';
import { Reports } from '@/pages/reports';
import { Profile } from '@/pages/profile';
import { Settings } from '@/pages/settings';
import { LandingPage } from '@/pages/landing';
import { SignUpPage } from '@/pages/signup';
import { ForgotPasswordPage } from '@/pages/forgot-password';
import { AiClassificationPage } from '@/pages/ai-classification';
import { ImportOfxPage } from '@/pages/import-ofx';
import { BudgetPage } from '@/pages/budget';
import { AccountsPage } from '@/pages/accounts';
import { CategoriesPage } from '@/pages/categories';
import { DependentsPage } from '@/pages/dependents';
import { CreditCardsPage } from '@/pages/credit-cards';
import { GoalsPage } from '@/pages/goals';
import { IncomeSourcesPage } from '@/pages/income-sources';
import { CompaniesPage } from '@/pages/companies';
import { UsersPage } from '@/pages/users';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
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
    errorElement: <ErrorPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/password-recovery',
    element: <PasswordRecoveryPage />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPasswordPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ErrorBoundary>
        <ProtectedRoute>
          <DashboardPage />
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
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
    errorElement: <ErrorPage />,
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
    path: '*',
    element: <ErrorPage code={404} />,
  },
]);
