import React from 'react';
import { XCircle } from 'lucide-react';

export const CardEmpty: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 py-8 gap-2">
    <XCircle size={32} />
    <span className="text-sm">Sem dados para o período.</span>
  </div>
);
