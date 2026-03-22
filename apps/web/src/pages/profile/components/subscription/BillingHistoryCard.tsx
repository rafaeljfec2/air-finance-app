import { ReceiptText } from 'lucide-react';

import { Card } from '@/components/ui/card';

export function BillingHistoryCard() {
  return (
    <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6">
      <div className="flex items-center gap-2 mb-4">
        <ReceiptText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <h3 className="text-lg font-bold text-text dark:text-text-dark">Histórico de Cobranças</h3>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/30">
        <ReceiptText className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
        <p>Nenhuma fatura gerada recentemente.</p>
      </div>
    </Card>
  );
}
