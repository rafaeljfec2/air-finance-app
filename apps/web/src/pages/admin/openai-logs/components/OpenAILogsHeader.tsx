import { Bot, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function OpenAILogsHeader() {
  return (
    <div className="flex items-center gap-4 mb-6 sm:mb-8">
      <Link to="/settings" className="p-2 hover:bg-muted rounded-full transition-colors">
        <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </Link>
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Bot className="h-8 w-8 text-primary-400" />
          <h1 className="text-2xl font-bold text-text dark:text-text-dark">Logs da OpenAI</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Histórico de interações com a API da OpenAI
        </p>
      </div>
    </div>
  );
}
