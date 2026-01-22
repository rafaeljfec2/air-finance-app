import { Link, useNavigate } from 'react-router-dom';

export function LoginFooter() {
  const navigate = useNavigate();

  return (
    <div className="text-center space-y-2">
      <div className="mt-8 text-center text-sm text-text/60 dark:text-text-dark/60">
        Não tem conta?{' '}
        <button
          type="button"
          className="text-brand-arrow hover:underline font-medium"
          onClick={() => navigate('/signup')}
        >
          Criar conta
        </button>
      </div>
      <p className="text-xs text-text/60 dark:text-text-dark/60">
        Ao continuar, você concorda com nossos{' '}
        <Link
          to="/terms"
          className="text-brand-arrow hover:text-brand-arrow/80 dark:text-brand-leaf dark:hover:text-brand-leaf/80"
        >
          Termos de Serviço
        </Link>{' '}
        e{' '}
        <Link
          to="/privacy"
          className="text-brand-arrow hover:text-brand-arrow/80 dark:text-brand-leaf dark:hover:text-brand-leaf/80"
        >
          Política de Privacidade
        </Link>
      </p>
    </div>
  );
}
