import { ViewDefault } from '@/layouts/ViewDefault';

interface UsersErrorStateProps {
  error: Error;
}

export function UsersErrorState({ error }: Readonly<UsersErrorStateProps>) {
  return (
    <ViewDefault>
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="text-red-500">Erro ao carregar usuários: {error.message}</div>
      </div>
    </ViewDefault>
  );
}
