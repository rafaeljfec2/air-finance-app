import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { getCurrentUser } from '@/services/authService';
import { SuspenseLoader } from '@/components/SuspenseLoader';
import { CheckCircle2, AlertCircle, LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateAuthState } = useAuthStore();
  const [wasLinked, setWasLinked] = useState(false);
  const [needsLink, setNeedsLink] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [linkMessage, setLinkMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const success = searchParams.get('success');
      const error = searchParams.get('error');
      const linked = searchParams.get('linked');
      const needsLinkParam = searchParams.get('needsLink');
      const needsLoginParam = searchParams.get('needsLogin');
      const message = searchParams.get('message');

      // Caso 1: Precisa vincular (usuário está logado)
      if (needsLinkParam === 'true') {
        try {
          // Busca dados do usuário logado
          const currentUser = await getCurrentUser();
          updateAuthState(currentUser, null);
          setNeedsLink(true);
          setLinkMessage(message ? decodeURIComponent(message) : null);
          // Redireciona após 5 segundos
          setTimeout(() => {
            navigate('/home', { replace: true });
          }, 5000);
          return;
        } catch (err) {
          console.error('Erro ao buscar usuário logado:', err);
          // Se não conseguir buscar usuário, redireciona para login
          navigate('/login?error=session_expired', { replace: true });
          return;
        }
      }

      // Caso 2: Precisa fazer login primeiro (usuário não está logado)
      if (needsLoginParam === 'true') {
        const decodedError = error ? decodeURIComponent(error) : null;
        setNeedsLogin(true);
        setErrorMessage(decodedError);
        // Redireciona após 5 segundos
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 5000);
        return;
      }

      // Caso 3: Sucesso normal
      if (success === 'true') {
        try {
          // Token já está em cookie HttpOnly, apenas busca dados do usuário
          const currentUser = await getCurrentUser();

          // Atualiza o estado de autenticação
          // O token está em cookie HttpOnly, então passamos null aqui
          // O apiClient já usa cookies automaticamente
          updateAuthState(currentUser, null);

          // Se foi vinculação (primeira vez), mostra mensagem e redireciona automaticamente
          if (linked === 'true') {
            setWasLinked(true);
            // Redireciona automaticamente após 2.5 segundos (tempo suficiente para ler a mensagem)
            setTimeout(() => {
              navigate('/home', { replace: true });
            }, 2500);
          } else {
            // Login normal (segunda vez em diante) - redireciona imediatamente
            navigate('/home', { replace: true });
          }
        } catch (err) {
          console.error('Erro ao processar callback OAuth:', err);
          navigate('/login?error=oauth_failed', { replace: true });
        }
        return;
      }

      // Caso 4: Erro genérico
      if (error) {
        // Erro no OAuth - redireciona para login com mensagem
        const decodedError = decodeURIComponent(error);
        navigate(`/login?error=${encodeURIComponent(decodedError)}`, { replace: true });
        return;
      }

      // Caso 5: Sem parâmetros válidos
      navigate('/login', { replace: true });
    };

    handleCallback();
  }, [searchParams, navigate, updateAuthState]);

  // Mostra mensagem de vinculação bem-sucedida
  if (wasLinked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-brand-arrow/5 dark:from-background-dark dark:via-background-dark dark:to-brand-leaf/5">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 w-16 h-16 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-2">
                Conta vinculada com sucesso!
              </h2>
              <p className="text-text/70 dark:text-text-dark/70 mb-4">
                Sua conta Google foi vinculada à sua conta existente. Agora você pode fazer login
                usando o Google ou sua senha.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-text/50 dark:text-text-dark/50">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Redirecionando automaticamente...</span>
              </div>
            </div>
            <Button
              onClick={() => navigate('/home', { replace: true })}
              className="w-full bg-brand-arrow hover:bg-brand-arrow/90 dark:bg-brand-leaf dark:hover:bg-brand-leaf/90 text-white"
            >
              Continuar agora
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Mostra mensagem quando precisa vincular (usuário está logado)
  if (needsLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-brand-arrow/5 dark:from-background-dark dark:via-background-dark dark:to-brand-leaf/5">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 w-16 h-16 flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-2">
                Vínculo de Conta Necessário
              </h2>
              <p className="text-text/70 dark:text-text-dark/70">
                {linkMessage ||
                  'Uma conta com este e-mail já existe. Para vincular sua conta Google, você precisa fazer login com sua senha primeiro nas configurações da sua conta.'}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => navigate('/home', { replace: true })}
                className="w-full bg-brand-arrow hover:bg-brand-arrow/90 dark:bg-brand-leaf dark:hover:bg-brand-leaf/90 text-white"
              >
                Ir para Início
              </Button>
              <Button
                onClick={() => navigate('/settings', { replace: true })}
                variant="outline"
                className="w-full"
              >
                Ir para Configurações
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mostra mensagem quando precisa fazer login primeiro (usuário não está logado)
  if (needsLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-brand-arrow/5 dark:from-background-dark dark:via-background-dark dark:to-brand-leaf/5">
        <div className="max-w-md w-full mx-4">
          <div className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 w-16 h-16 flex items-center justify-center">
                <LogIn className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text dark:text-text-dark mb-2">
                Login Necessário
              </h2>
              <p className="text-text/70 dark:text-text-dark/70">
                {errorMessage ||
                  'Uma conta com este e-mail já existe. Por favor, faça login com sua senha primeiro para vincular sua conta Google.'}
              </p>
            </div>
            <Button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full bg-brand-arrow hover:bg-brand-arrow/90 dark:bg-brand-leaf dark:hover:bg-brand-leaf/90 text-white"
            >
              Ir para Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <SuspenseLoader />;
}
