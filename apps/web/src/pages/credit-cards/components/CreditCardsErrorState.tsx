import { ViewDefault } from '@/layouts/ViewDefault';

interface CreditCardsErrorStateProps {
  error: Error;
}

export function CreditCardsErrorState({ error }: Readonly<CreditCardsErrorStateProps>) {
  return (
    <ViewDefault>
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="text-red-500">Erro ao carregar cartões: {error.message}</div>
      </div>
    </ViewDefault>
  );
}
