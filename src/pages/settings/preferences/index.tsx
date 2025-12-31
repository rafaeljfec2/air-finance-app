import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import { ViewDefault } from '@/layouts/ViewDefault';
import { getCurrentUser } from '@/services/authService';
import { updateUser } from '@/services/userService';
import { useAuthStore } from '@/stores/auth';
import { useTheme } from '@/stores/useTheme';
import {
    Calendar,
    ChevronLeft,
    DollarSign,
    Globe,
    Palette,
    Save
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function PreferencesPage() {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const { setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [preferences, setPreferences] = useState({
    currency: 'BRL',
    language: 'pt-BR',
    theme: 'system',
    dateFormat: 'DD/MM/YYYY',
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const fullUser = await getCurrentUser();
        if (fullUser.preferences) {
          setPreferences({
            currency: fullUser.preferences.currency || 'BRL',
            language: fullUser.preferences.language || 'pt-BR',
            theme: fullUser.preferences.theme || 'system',
            dateFormat: fullUser.preferences.dateFormat || 'DD/MM/YYYY',
          });
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [user?.id]);

  const handleChange = (key: string, value: string) => {
    setPreferences((prev) => ({ ...prev, [key]: value }));
    
    // Immediate theme update for preview
    if (key === 'theme') {
      setTheme(value === 'dark');
    }
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setIsSaving(true);
    try {
      // Fetch current user to avoid overwriting other fields with stale data if we were to send a partial object,
      // but updateUser usually accepts partials? The service implementation might vary. 
      // Safe bet: send updating fields to backend.
      
      const updateData = {
        preferences: {
            ...preferences
        } as any // Cast to avoidance strict TS enum mismatch during build
      };

      const updatedUser = await updateUser(user.id, updateData);
      setUser(updatedUser);
      toast({
        title: 'Sucesso',
        description: 'Preferências atualizadas com sucesso!',
        type: 'success',
      });
    } catch (error) {
       console.error(error);
       toast({
        title: 'Erro',
        description: 'Erro ao salvar preferências',
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
            <Palette className="h-6 w-6 text-primary-500" />
            Preferências
          </h1>
        </div>

        <div className="max-w-3xl mx-auto">
          <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6">
           {isLoading ? (
             <div className="flex justify-center py-8"><Spinner className="text-primary-500" /></div>
           ) : (
             <div className="space-y-6">
                {/* Currency */}
                <div>
                   <label className="block text-sm font-medium text-text dark:text-text-dark mb-2 flex items-center gap-2">
                     <DollarSign className="w-4 h-4 text-gray-500" /> Moeda Padrão
                   </label>
                   <Select 
                     value={preferences.currency} 
                     onValueChange={(v) => handleChange('currency', v)}
                   >
                     <SelectTrigger className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                       {preferences.currency}
                     </SelectTrigger>
                     <SelectContent className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                       <SelectItem value="BRL">BRL - Real Brasileiro</SelectItem>
                       <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                       <SelectItem value="EUR">EUR - Euro</SelectItem>
                     </SelectContent>
                   </Select>
                </div>

                {/* Language */}
                <div>
                   <label className="block text-sm font-medium text-text dark:text-text-dark mb-2 flex items-center gap-2">
                     <Globe className="w-4 h-4 text-gray-500" /> Idioma
                   </label>
                   <Select 
                     value={preferences.language} 
                     onValueChange={(v) => handleChange('language', v)}
                   >
                     <SelectTrigger className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                        {preferences.language === 'pt-BR' ? 'Português' : preferences.language === 'en-US' ? 'English' : 'Español'}
                     </SelectTrigger>
                     <SelectContent className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                       <SelectItem value="pt-BR">Português</SelectItem>
                       <SelectItem value="en-US">English</SelectItem>
                       <SelectItem value="es-ES">Español</SelectItem>
                     </SelectContent>
                   </Select>
                </div>

                {/* Theme */}
                <div>
                   <label className="block text-sm font-medium text-text dark:text-text-dark mb-2 flex items-center gap-2">
                     <Palette className="w-4 h-4 text-gray-500" /> Tema
                   </label>
                   <Select 
                     value={preferences.theme} 
                     onValueChange={(v) => handleChange('theme', v)}
                   >
                     <SelectTrigger className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                        {preferences.theme === 'light' ? 'Claro' : preferences.theme === 'dark' ? 'Escuro' : 'Sistema'}
                     </SelectTrigger>
                     <SelectContent className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                       <SelectItem value="light">Claro</SelectItem>
                       <SelectItem value="dark">Escuro</SelectItem>
                       <SelectItem value="system">Sistema</SelectItem>
                     </SelectContent>
                   </Select>
                </div>

                {/* Date Format */}
                <div>
                   <label className="block text-sm font-medium text-text dark:text-text-dark mb-2 flex items-center gap-2">
                     <Calendar className="w-4 h-4 text-gray-500" /> Formato de Data
                   </label>
                   <Select 
                     value={preferences.dateFormat} 
                     onValueChange={(v) => handleChange('dateFormat', v)}
                   >
                     <SelectTrigger className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                        {preferences.dateFormat}
                     </SelectTrigger>
                     <SelectContent className="bg-background dark:bg-background-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                       <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                       <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                       <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
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
                    {isSaving ? <Spinner size="sm"/> : <Save className="w-4 h-4" />}
                    Salvar Preferências
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
