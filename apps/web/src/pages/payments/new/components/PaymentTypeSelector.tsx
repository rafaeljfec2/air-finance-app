import React from 'react';
import { QrCode, Landmark, Barcode, FileText } from 'lucide-react';
import type { PaymentType } from '@/services/paymentService';

interface PaymentTypeSelectorProps {
  readonly onSelect: (type: PaymentType) => void;
}

interface TypeCard {
  readonly type: PaymentType;
  readonly title: string;
  readonly description: string;
  readonly icon: React.ElementType;
  readonly color: string;
}

const TYPES: readonly TypeCard[] = [
  {
    type: 'PIX',
    title: 'PIX',
    description: 'Transferencia instantanea por chave PIX',
    icon: QrCode,
    color: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  },
  {
    type: 'TED',
    title: 'TED',
    description: 'Transferencia bancaria com dados completos',
    icon: Landmark,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
  },
  {
    type: 'BOLETO',
    title: 'Boleto',
    description: 'Pagamento por codigo de barras',
    icon: Barcode,
    color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20',
  },
  {
    type: 'DARF',
    title: 'DARF',
    description: 'Tributos federais (IRPJ, CSLL, PIS, etc)',
    icon: FileText,
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20',
  },
];

export function PaymentTypeSelector({ onSelect }: PaymentTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Tipo de pagamento</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Selecione como deseja realizar o pagamento
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TYPES.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.type}
              onClick={() => onSelect(card.type)}
              className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm transition-all text-left"
            >
              <div className={`p-2.5 rounded-lg ${card.color}`}>
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{card.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {card.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
