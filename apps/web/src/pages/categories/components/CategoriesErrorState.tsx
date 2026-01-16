import { ViewDefault } from '@/layouts/ViewDefault';

interface CategoriesErrorStateProps {
  error: Error;
}

export function CategoriesErrorState({ error }: Readonly<CategoriesErrorStateProps>) {
  return (
    <ViewDefault>
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="text-red-500">Erro ao carregar categorias: {error.message}</div>
      </div>
    </ViewDefault>
  );
}
