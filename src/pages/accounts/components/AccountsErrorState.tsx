import { Button } from '@/components/ui/button';
import { ViewDefault } from '@/layouts/ViewDefault';
import { AxiosError } from 'axios';

interface AccountsErrorStateProps {
  error: Error;
}

export function AccountsErrorState({ error }: Readonly<AccountsErrorStateProps>) {
  const isCompanyNotFound = error instanceof AxiosError && error.response?.status === 404;

  if (isCompanyNotFound) {
    return (
      <ViewDefault>
        <div className="container mx-auto px-2 sm:px-6 py-10 flex flex-col items-center justify-center min-h-[40vh]">
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-6 rounded shadow-md max-w-lg w-full text-center">
            <h2 className="text-lg font-semibold mb-2">Nenhuma empresa selecionada</h2>
            <p className="mb-4">
              Para cadastrar contas bancárias, você precisa criar uma empresa primeiro.
            </p>
            <Button
              className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                globalThis.location.href = '/companies';
              }}
            >
              Criar empresa
            </Button>
          </div>
        </div>
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="text-red-500">Erro ao carregar contas: {error.message}</div>
      </div>
    </ViewDefault>
  );
}
