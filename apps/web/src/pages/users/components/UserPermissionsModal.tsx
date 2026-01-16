import { Modal } from '@/components/ui/Modal';
import { ROLE_PERMISSIONS } from '@/constants/permissions';
import { Check, Shield } from 'lucide-react';
import { useMemo } from 'react';

interface UserPermissionsModalProps {
  open: boolean;
  onClose: () => void;
  role: string;
  userName: string;
}

export function UserPermissionsModal({
  open,
  onClose,
  role,
  userName,
}: UserPermissionsModalProps) {
  const permissions = useMemo(() => {
    return ROLE_PERMISSIONS[role] || [];
  }, [role]);

  const groupedPermissions = useMemo(() => {
    const groups: Record<string, string[]> = {};
    
    permissions.forEach((perm) => {
      const [resource, action] = perm.split(':');
      const resourceName = resource.charAt(0).toUpperCase() + resource.slice(1).replace('-', ' ');
      
      if (!groups[resourceName]) {
        groups[resourceName] = [];
      }
      
      groups[resourceName].push(action);
    });

    return groups;
  }, [permissions]);

  const getRoleLabel = (r: string) => {
    switch (r) {
      case 'god': return 'God';
      case 'owner': return 'Dono';
      case 'admin': return 'Administrador';
      case 'editor': return 'Editor';
      case 'viewer': return 'Visualizador';
      default: return r;
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Permissões: ${userName}`}
      className="max-w-3xl"
    >
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Função atual: <span className="font-medium text-primary-600 dark:text-primary-400">{getRoleLabel(role)}</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groupedPermissions).map(([resource, actions]) => (
          <div 
            key={resource} 
            className="bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-3 border-b border-border dark:border-border-dark pb-2">
              <Shield className="h-4 w-4 text-primary-500" />
              <h3 className="font-semibold text-text dark:text-text-dark">{resource}</h3>
            </div>
            <ul className="space-y-2">
              {actions.map((action) => (
                <li key={action} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span>{formatAction(action)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      {permissions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma permissão atribuída para esta função.
        </div>
      )}
    </Modal>
  );
}

function formatAction(action: string): string {
  const map: Record<string, string> = {
    create: 'Criar',
    read: 'Visualizar',
    update: 'Editar',
    delete: 'Excluir',
    remove: 'Remover',
    invite: 'Convidar',
    changeRole: 'Alterar Função',
    export: 'Exportar',
  };
  return map[action] || action;
}
