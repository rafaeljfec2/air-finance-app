import { ViewDefault } from '@/layouts/ViewDefault';

interface OpenAILogsErrorStateProps {
  error: Error;
}

export function OpenAILogsErrorState({ error }: Readonly<OpenAILogsErrorStateProps>) {
  return (
    <ViewDefault>
      <div className="container mx-auto px-4 sm:px-6 py-10">
        <div className="text-red-500">Erro ao carregar logs: {error.message}</div>
      </div>
    </ViewDefault>
  );
}
