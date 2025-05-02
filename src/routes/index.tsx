import { createBrowserRouter } from 'react-router-dom';
import { Login } from '@/pages/login';
import { Dashboard } from '@/pages/dashboard/Dashboard';
import { Statement } from '@/pages/statement';
import { NewTransaction } from '@/pages/transactions/new';
import { Transactions } from '@/pages/transactions';
import { Reports } from '@/pages/reports';
import { Profile } from '@/pages/profile';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import { ErrorPage } from '@/components/error/ErrorPage';
import { Settings } from '@/pages/settings';
import {LandingPage} from '@/pages/landing';
import {SignUpPage} from '@/pages/signup';
import ForgotPasswordPage from '@/pages/forgot-password';
import AiClassificationPage from '@/pages/ai-classification';
import ImportOfxPage from '@/pages/import-ofx'; 

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/auth/login',
    element: <Login />,
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
    path: '*',
    element: <ErrorPage code={404} />,
  },
]);
