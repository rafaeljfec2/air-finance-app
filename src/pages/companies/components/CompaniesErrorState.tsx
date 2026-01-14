import { ViewDefault } from '@/layouts/ViewDefault';

interface CompaniesErrorStateProps {
  error: Error;
}

export function CompaniesErrorState({ error }: Readonly<CompaniesErrorStateProps>) {
  return (
    <ViewDefault>
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="text-red-500">Erro ao carregar empresas: {error.message}</div>
      </div>
    </ViewDefault>
  );
}
