import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { env } from '@/utils/env';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function ConfirmProcessing() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
        // Redirect to backend for validation
       const baseUrl = env.VITE_API_URL || 'http://localhost:3000/api';
       // Ensure base URL ends with /v1
       const cleanBaseUrl = baseUrl.replace(/\/$/, '');
       const finalUrl = cleanBaseUrl.endsWith('/v1') ? cleanBaseUrl : `${cleanBaseUrl}/v1`;
       
       window.location.href = `${finalUrl}/auth/confirm?token=${token}`;
    } else {
        // No token, invalid access
        navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-white dark:from-background-dark dark:to-gray-900 px-4">
      <Card className="w-full max-w-md bg-card/50 dark:bg-card-dark/50 border-border dark:border-border-dark backdrop-blur-sm p-8 flex flex-col items-center text-center">
        <Logo className="mb-6 w-16 h-16" />
        <Loader2 className="h-12 w-12 animate-spin text-primary-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Verificando e-mail...</h2>
        <p className="text-muted-foreground">Aguarde um momento.</p>
      </Card>
    </div>
  );
}

export function ConfirmSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-white dark:from-background-dark dark:to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/50 dark:bg-card-dark/50 border-border dark:border-border-dark backdrop-blur-sm p-8 flex flex-col items-center text-center">
            <Logo className="mb-6 w-16 h-16" />
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-4">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">E-mail verificado!</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sua conta foi ativada com sucesso. Você já pode acessar o sistema.
            </p>
            <Button 
                onClick={() => navigate('/login')} 
                className="w-full bg-brand-arrow hover:bg-brand-arrow/90 text-white"
            >
            Ir para Login
            </Button>
        </Card>
      </motion.div>
    </div>
  );
}

export function ConfirmError() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-white dark:from-background-dark dark:to-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="bg-card/50 dark:bg-card-dark/50 border-border dark:border-border-dark backdrop-blur-sm p-8 flex flex-col items-center text-center">
            <Logo className="mb-6 w-16 h-16" />
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 mb-4">
                <XCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Falha na verificação</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
            Não foi possível verificar seu e-mail. O link pode ter expirado ou é inválido.
            </p>
            <div className="flex flex-col w-full gap-3">
                <Button 
                    onClick={() => navigate('/login')} 
                    variant="outline"
                    className="w-full"
                >
                Voltar ao Login
                </Button>
            </div>
        </Card>
      </motion.div>
    </div>
  );
}
