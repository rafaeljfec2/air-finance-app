import { Link } from 'react-router-dom';
import { PasswordRecoveryForm } from '../components/PasswordRecoveryForm';
import { ProtectedRoute } from '../components/ProtectedRoute';

export function PasswordRecoveryPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Recupere sua senha
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Digite seu email para receber as instruções de recuperação
            </p>
          </div>

          <PasswordRecoveryForm />

          <div className="text-center">
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
