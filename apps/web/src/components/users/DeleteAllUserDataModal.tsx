import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/toast';
import { useUsers } from '@/hooks/useUsers';
import { AlertTriangle, Loader2 } from 'lucide-react';
import React, { useState } from 'react';

interface DeleteAllUserDataModalProps {
  open: boolean;
  onClose: () => void;
}

export function DeleteAllUserDataModal({ open, onClose }: Readonly<DeleteAllUserDataModalProps>) {
  const [email, setEmail] = useState('');
  const { deleteAllUserDataByEmail, isDeletingAllDataByEmail, deleteAllDataByEmailError } =
    useUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, insira o email do usuário',
        type: 'error',
      });
      return;
    }

    deleteAllUserDataByEmail(email.trim(), {
      onSuccess: () => {
        toast({
          title: 'Sucesso',
          description: 'Todos os dados do usuário foram deletados com sucesso',
          type: 'success',
        });
        setEmail('');
        onClose();
      },
      onError: (error) => {
        console.error('Erro ao deletar dados do usuário:', error);
        // Error message is already displayed via deleteAllDataByEmailError
      },
    });
  };

  const handleClose = () => {
    setEmail('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Deletar Todos os Dados do Usuário"
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-lg bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">
                Ação Irreversível
              </h3>
              <p className="text-sm text-red-600 dark:text-red-300">
                Esta ação irá deletar permanentemente todos os dados do usuário, incluindo empresas,
                contas, transações, categorias, metas e outras informações relacionadas. Esta
                operação não pode ser desfeita.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userEmail" className="text-text dark:text-text-dark">
            Email do Usuário
          </Label>
          <Input
            id="userEmail"
            type="email"
            placeholder="usuario@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark"
            disabled={isDeletingAllDataByEmail}
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Digite o email do usuário cujos dados deseja deletar
          </p>
        </div>

        {deleteAllDataByEmailError && (
          <div className="rounded-lg bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 p-3">
            <p className="text-sm text-red-600 dark:text-red-300">
              {deleteAllDataByEmailError instanceof Error
                ? deleteAllDataByEmailError.message
                : 'Erro ao deletar dados do usuário'}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeletingAllDataByEmail}
            className="border-border dark:border-border-dark text-text dark:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={isDeletingAllDataByEmail || !email.trim()}
          >
            {isDeletingAllDataByEmail && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Deletar Todos os Dados
          </Button>
        </div>
      </form>
    </Modal>
  );
}
