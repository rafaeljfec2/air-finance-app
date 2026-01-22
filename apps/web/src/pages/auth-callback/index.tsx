import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth';
import { getCurrentUser } from '@/services/authService';
import { SuspenseLoader } from '@/components/SuspenseLoader';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateAuthState } = useAuthStore();
  const [wasLinked, setWasLinked] = useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      const success = searchParams.get('success');
      const error = searchParams.get('error');
      const linked = searchParams.get('linked');

      if (success === 'true') {
        try {
          // Token já está em cookie HttpOnly, apenas busca dados do usuário
          const user = await getCurrentUser();

          // Atualiza o estado de autenticação
          // O token está em cookie HttpOnly, então passamos null aqui
          // O apiClient já usa cookies automaticamente
          updateAuthState(user, null);

          // Se foi vinculação, mostra mensagem antes de redirecionar
          if (linked === 'true') {
            setWasLinked(true);
            // Redireciona após 3 segundos
            setTimeout(() => {
              navigate('/home', { replace: true });
            }, 3000);
          } else {
            // Redireciona imediatamente para home
            navigate('/home', { replace: true });
          }
        } catch (err) {
          console.error('Erro ao processar callback OAuth:', err);
          navigate('/login?error=oauth_failed', { replace: true });
        }
      } else if (error) {
        // Erro no OAuth - redireciona para login com mensagem
        const errorMessage = decodeURIComponent(error);
        navigate(`/login?error=${encodeURIComponent(errorMessage)}`, { replace: true });
      } else {
        // Sem parâmetros válidos
        navigate('/login', { replace: true });
      }
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
              <p className="text-text/70 dark:text-text-dark/70">
                Sua conta Google foi vinculada à sua conta existente. Agora você pode fazer login
                usando o Google ou sua senha.
              </p>
            </div>
            <Button
              onClick={() => navigate('/home', { replace: true })}
              className="w-full bg-brand-arrow hover:bg-brand-arrow/90 dark:bg-brand-leaf dark:hover:bg-brand-leaf/90 text-white"
            >
              Continuar
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <SuspenseLoader />;
}
