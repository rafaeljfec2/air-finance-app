import React from 'react';
import { useSettings } from '@/hooks/useSettings';
import { ViewDefault } from '@/layouts/ViewDefault';
import {
  ChevronRight,
  CreditCard,
  Download,
  Flag,
  Settings as SettingsIcon,
  Tag,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Settings() {
  const navigate = useNavigate();
  const { appVersion } = useSettings();

  const menuItems = [
    {
      section: 'Gerenciamento',
      items: [
        {
          icon: Tag,
          label: 'Categorias',
          description: 'Gerencie categorias de transações',
          onClick: () => navigate('/settings/categories'),
        },
        {
          icon: CreditCard,
          label: 'Contas bancárias',
          description: 'Gerencie suas contas',
          onClick: () => navigate('/settings/accounts'),
        },
        {
          icon: CreditCard,
          label: 'Cartões de crédito',
          description: 'Gerencie seus cartões',
          onClick: () => navigate('/settings/cards'),
        },
        {
          icon: Flag,
          label: 'Metas financeiras',
          description: 'Defina e acompanhe seus objetivos',
          onClick: () => navigate('/settings/goals'),
        },
      ],
    },
    {
      section: 'Dados',
      items: [
        {
          icon: Download,
          label: 'Exportar dados',
          description: 'Baixe seus dados em CSV/PDF',
          onClick: () => navigate('/settings/export'),
        },
      ],
    },
  ];

  return (
    <ViewDefault>
      <div className="flex-1 overflow-x-hidden overflow-y-auto bg-background dark:bg-background-dark">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex items-center gap-3 mb-8">
            <SettingsIcon className="h-8 w-8 text-primary-400" />
            <div>
              <h1 className="text-2xl font-bold text-text dark:text-text-dark">Configurações</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie as preferências do seu sistema
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            {menuItems.map((section) => (
              <section
                key={section.section}
                className="bg-card dark:bg-card-dark rounded-lg shadow overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-border dark:border-border-dark bg-gray-50/50 dark:bg-gray-800/50">
                  <h2 className="font-semibold text-text dark:text-text-dark">{section.section}</h2>
                </div>
                <div className="divide-y divide-border dark:divide-border-dark">
                  {section.items.map((item) => {
                    const handleKeyDown = (e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        item.onClick();
                      }
                    };

                    return (
                      <div
                        key={item.label}
                        onClick={item.onClick}
                        onKeyDown={handleKeyDown}
                        role="button"
                        tabIndex={0}
                        className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-primary-500">
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium text-text dark:text-text-dark">
                              {item.label}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            {/* Sobre */}
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">AirFinance v{appVersion}</p>
            </div>
          </div>
        </div>
      </div>
    </ViewDefault>
  );
}
