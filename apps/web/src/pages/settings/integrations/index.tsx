import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { ViewDefault } from '@/layouts/ViewDefault';
import { getCurrentUser } from '@/services/authService';
import { updateUser } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import { mapUserServiceToUserType } from '@/utils/userMapper';
import { Bot, ChevronLeft, Eye, EyeOff, Puzzle, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function IntegrationsPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const [integrations, setIntegrations] = useState<{
    openaiApiKey: string;
    openaiModel: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'gpt-5.2' | 'gpt-5-mini';
  }>({
    openaiApiKey: '',
    openaiModel: 'gpt-3.5-turbo',
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const fullUser = await getCurrentUser();
        // Cast to any because integrations might not be fully typed in the specific hook return type yet
        const int = (fullUser as { integrations?: { openaiApiKey?: string; openaiModel?: string } })
          .integrations;
        if (int) {
          setIntegrations({
            openaiApiKey: int.openaiApiKey || '',
            openaiModel: (int.openaiModel || 'gpt-3.5-turbo') as
              | 'gpt-3.5-turbo'
              | 'gpt-4'
              | 'gpt-4-turbo'
              | 'gpt-5.2'
              | 'gpt-5-mini',
          });
        }
      } catch (error) {
        console.error('Error fetching user integrations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [user?.id]);

  const handleChange = (key: string, value: string) => {
    setIntegrations((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      const updateData = {
        integrations: { ...integrations },
      };

      const updatedUser = await updateUser(user.id, updateData);
      setUser(mapUserServiceToUserType(updatedUser));
      toast({
        title: 'Sucesso',
        description: 'Integrações atualizadas com sucesso!',
        type: 'success',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar integrações',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ViewDefault>
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/settings')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-text dark:text-text-dark flex items-center gap-2">
            <Puzzle className="h-6 w-6 text-primary-500" />
            Integrações
          </h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner className="text-primary-500" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="h-5 w-5 text-primary-400" />
                  <h2 className="text-lg font-semibold text-text dark:text-text-dark">
                    OpenAI (Inteligência Artificial)
                  </h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  Configure suas chaves de API para permitir que a IA analise suas finanças.
                </p>

                {/* API Key */}
                <div>
                  <label
                    htmlFor="openai-api-key"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
                  >
                    OpenAI API Key
                  </label>
                  <div className="relative">
                    <Input
                      id="openai-api-key"
                      type={showApiKey ? 'text' : 'password'}
                      value={integrations.openaiApiKey}
                      onChange={(e) => handleChange('openaiApiKey', e.target.value)}
                      placeholder="sk-..."
                      className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Model */}
                <div>
                  <label
                    htmlFor="openai-model"
                    className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
                  >
                    Modelo Padrão
                  </label>
                  <Select
                    value={integrations.openaiModel}
                    onValueChange={(v) => handleChange('openaiModel', v)}
                  >
                    <SelectTrigger className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                      {integrations.openaiModel}
                    </SelectTrigger>
                    <SelectContent className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Rápido)</SelectItem>
                      <SelectItem value="gpt-4">GPT-4 (Preciso)</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-5.2">GPT-5.2 (Beta)</SelectItem>
                      <SelectItem value="gpt-5-mini">GPT-5 Mini</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="pt-4 flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    variant="success"
                    className="gap-2"
                  >
                    {isSaving ? <Spinner size="sm" /> : <Save className="w-4 h-4" />}
                    Salvar Integrações
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </ViewDefault>
  );
}
