import { useNavigate } from 'react-router-dom';
import { ViewDefault } from '@/layouts/ViewDefault';

export function Transactions() {
  const navigate = useNavigate();

  return (
    <ViewDefault>
      <div className="container mx-auto px-4 py-8">
        <h1>Transações</h1>
      </div>
    </ViewDefault>
  );
} 