import { useNavigate } from 'react-router-dom';
import { ExclamationTriangleIcon, HomeIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface ErrorPageProps {
  error?: Error | null;
  code?: number;
}

export function ErrorPage({ error, code = 404 }: ErrorPageProps) {
  const navigate = useNavigate();

  const errorMessages: Record<number, { title: string; message: string }> = {
    404: {
      title: 'Página não encontrada',
      message: 'Desculpe, não encontramos a página que você está procurando.',
    },
    500: {
      title: 'Erro interno',
      message: 'Ocorreu um erro inesperado. Nossa equipe foi notificada.',
    },
  };

  const errorInfo = errorMessages[code] || {
    title: 'Erro inesperado',
    message: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Ícone de Erro */}
        <div className="mx-auto h-24 w-24 text-yellow-500 mb-8">
          <ExclamationTriangleIcon />
        </div>

        {/* Código do Erro */}
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">{code}</h1>

        {/* Título do Erro */}
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          {errorInfo.title}
        </h2>

        {/* Mensagem de Erro */}
        <p className="text-gray-600 dark:text-gray-400 mb-8">{errorInfo.message}</p>

        {/* Detalhes Técnicos (apenas em desenvolvimento) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-sm font-mono text-red-600 dark:text-red-400 break-all">
              {error.message}
            </p>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 w-full sm:w-auto"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Voltar ao início
          </button>

          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700 w-full sm:w-auto"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Tentar novamente
          </button>
        </div>
      </div>
    </div>
  );
}
