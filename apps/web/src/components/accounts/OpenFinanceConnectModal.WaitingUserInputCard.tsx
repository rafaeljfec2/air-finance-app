import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface WaitingUserInputCardProps {
  readonly authUrl?: string;
  readonly expiresAt?: string;
  readonly onOpenAuthUrl: (url: string) => void;
}

export function WaitingUserInputCard({
  authUrl,
  expiresAt,
  onOpenAuthUrl,
}: Readonly<WaitingUserInputCardProps>) {
  return (
    <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <CardTitle className="text-sm text-blue-900 dark:text-blue-100">
              Aguardando Autenticação
            </CardTitle>
            <CardDescription className="text-xs text-blue-800 dark:text-blue-200 mt-1">
              É necessário autenticar no site do banco
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {authUrl ? (
          <>
            <p className="text-sm text-blue-900 dark:text-blue-100">
              Clique no botão abaixo para ser redirecionado ao site do banco e completar a
              autenticação:
            </p>
            <Button
              onClick={() => onOpenAuthUrl(authUrl)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Autenticar no Banco
            </Button>
            {expiresAt && (
              <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
                Link expira em: {new Date(expiresAt).toLocaleString('pt-BR')}
              </p>
            )}
            <div className="pt-2 border-t border-blue-200 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                Complete a autenticação no site do banco. Após autenticar, volte para esta página e
                aguarde a conexão ser estabelecida.
              </p>
            </div>
          </>
        ) : (
          <p className="text-xs text-blue-800 dark:text-blue-200">
            Complete a autenticação no site do banco. Após autenticar, volte para esta página e
            aguarde a conexão ser estabelecida.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
