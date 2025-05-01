import { ViewDefault } from '@/layouts/ViewDefault';
import { ErrorPage } from '@/components/error/ErrorPage';

export function Transactions() {
  return (
    <ViewDefault>
      <ErrorPage code={404} error={new Error('Esta funcionalidade está em desenvolvimento.')} />
    </ViewDefault>
  );
}
