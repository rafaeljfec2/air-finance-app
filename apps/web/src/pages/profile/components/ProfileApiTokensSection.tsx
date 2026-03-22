import {
  Key,
  Plus,
  Copy,
  Check,
  Trash2,
  AlertTriangle,
  Clock,
  Shield,
  Activity,
  Calendar,
  Terminal,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';
import type { ApiTokenResponse, CreateApiTokenPayload } from '@/services/apiTokenService';

import { useProfileApiTokens } from '../hooks/useProfileApiTokens';

type ExpirationOption = CreateApiTokenPayload['expiration'];

const MAX_TOKENS = 10;

const EXPIRATION_OPTIONS: ReadonlyArray<{
  readonly value: ExpirationOption;
  readonly label: string;
}> = [
  { value: '30d', label: '30 dias' },
  { value: '60d', label: '60 dias' },
  { value: '90d', label: '90 dias' },
  { value: '1y', label: '1 ano' },
  { value: 'never', label: 'Sem expiração' },
] as const;

const STATUS_CONFIG = {
  active: {
    bar: 'bg-emerald-500',
    dot: 'bg-emerald-500',
    label: 'Ativo',
    labelClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
  },
  expired: {
    bar: 'bg-amber-500',
    dot: 'bg-amber-500',
    label: 'Expirado',
    labelClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
  },
  revoked: {
    bar: 'bg-gray-400 dark:bg-gray-600',
    dot: 'bg-gray-400 dark:bg-gray-600',
    label: 'Revogado',
    labelClass: 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800',
  },
} as const;

function getTokenStatus(token: ApiTokenResponse): 'active' | 'expired' | 'revoked' {
  if (token.revokedAt) return 'revoked';
  if (token.expiresAt && new Date(token.expiresAt) < new Date()) return 'expired';
  return 'active';
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Nunca';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return 'Agora';
  if (diffMinutes < 60) return `${diffMinutes}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 30) return `${diffDays}d`;
  return date.toLocaleDateString('pt-BR');
}

function formatExpirationDate(dateString: string | null): string {
  if (!dateString) return 'Nunca';
  const date = new Date(dateString);
  if (date < new Date()) return 'Expirado';
  return date.toLocaleDateString('pt-BR');
}

function TokenUsageBar({ active, total }: Readonly<{ active: number; total: number }>) {
  const percentage = total > 0 ? Math.min((active / total) * 100, 100) : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  function getBarColor(): string {
    if (isAtLimit) return 'bg-red-500';
    if (isNearLimit) return 'bg-amber-500';
    return 'bg-primary-500';
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">Tokens ativos</span>
        <span className="font-semibold text-text dark:text-text-dark">
          {active} / {total}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function TokenCard({
  token,
  onRevoke,
  isRevoking,
}: Readonly<{
  token: ApiTokenResponse;
  onRevoke: (id: string) => void;
  isRevoking: boolean;
}>) {
  const [showConfirm, setShowConfirm] = useState(false);
  const status = getTokenStatus(token);
  const cfg = STATUS_CONFIG[status];
  const isInactive = status !== 'active';

  return (
    <div
      className={`relative rounded-xl border overflow-hidden transition-colors ${
        isInactive
          ? 'border-gray-200 dark:border-gray-700/40 bg-gray-50/50 dark:bg-gray-800/30 opacity-60'
          : 'border-gray-200 dark:border-gray-700/50 bg-gray-50 dark:bg-gray-800/50 hover:border-primary-300 dark:hover:border-primary-800/50'
      }`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${cfg.bar}`} />

      <div className="pl-5 pr-4 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-semibold text-sm text-text dark:text-text-dark truncate">
                  {token.name}
                </p>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.labelClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {cfg.label}
                </span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                {token.tokenPrefix}...
              </p>
            </div>
          </div>

          {status === 'active' && !showConfirm && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowConfirm(true)}
              className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 gap-1.5 flex-shrink-0 -mt-0.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">Revogar</span>
            </Button>
          )}

          {showConfirm && (
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-red-500 dark:text-red-400 font-medium">Confirmar?</span>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  onRevoke(token.id);
                  setShowConfirm(false);
                }}
                disabled={isRevoking}
                className="gap-1 h-7 text-xs"
              >
                {isRevoking ? <Spinner size="sm" /> : <Trash2 className="h-3 w-3" />}
                Sim
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowConfirm(false)}
                className="h-7 text-xs"
              >
                Não
              </Button>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3 text-gray-400 dark:text-gray-500" />
            <span>Criado {formatRelativeTime(token.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="h-3 w-3 text-gray-400 dark:text-gray-500" />
            <span>Último uso: {formatRelativeTime(token.lastUsedAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-gray-400 dark:text-gray-500" />
            <span>Expira: {formatExpirationDate(token.expiresAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onCreate }: Readonly<{ onCreate: () => void }>) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-4 rounded-2xl bg-primary-100 dark:bg-primary-900/30 mb-5">
        <Terminal className="h-8 w-8 text-primary-500 dark:text-primary-400" />
      </div>
      <h3 className="text-lg font-bold text-text dark:text-text-dark mb-1.5">
        Nenhum token criado
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6 leading-relaxed">
        Crie tokens para integrar com APIs externas, automações e pipelines CI/CD de forma segura.
      </p>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-colors"
      >
        <Plus className="h-4 w-4" />
        Criar primeiro token
      </button>

      <div className="mt-8 w-full max-w-sm p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-mono leading-relaxed">
          curl -H &quot;Authorization: Bearer afk_...&quot; \<br />
          &nbsp;&nbsp;https://api.seudominio.com/endpoint
        </p>
      </div>
    </div>
  );
}

function CreateTokenModal({
  open,
  onClose,
  onCreate,
  isCreating,
}: Readonly<{
  open: boolean;
  onClose: () => void;
  onCreate: (payload: CreateApiTokenPayload) => Promise<void>;
  isCreating: boolean;
}>) {
  const [name, setName] = useState('');
  const [expiration, setExpiration] = useState<ExpirationOption>('90d');

  useEffect(() => {
    if (open) {
      setName('');
      setExpiration('90d');
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    await onCreate({ name: name.trim(), expiration });
    setName('');
    setExpiration('90d');
  };

  return (
    <Modal open={open} onClose={onClose} className="max-w-md bg-card dark:bg-card-dark p-0">
      <div className="flex flex-col min-h-0">
        <div className="flex items-center gap-3 px-6 pt-4 pb-3 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
            <Key className="h-5 w-5 text-primary-500 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text dark:text-text-dark">Criar API Token</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Gere um token para integrações externas e automações.
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label
              htmlFor="token-name"
              className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
            >
              Nome do token
            </label>
            <Input
              id="token-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: CI/CD Pipeline, Integração Zapier..."
              className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark focus:border-primary-500"
              maxLength={100}
            />
          </div>

          <div>
            <label
              htmlFor="token-expiration"
              className="block text-sm font-medium text-text dark:text-text-dark mb-1.5"
            >
              Expiração
            </label>
            <Select value={expiration} onValueChange={(v) => setExpiration(v as ExpirationOption)}>
              <SelectTrigger className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                {EXPIRATION_OPTIONS.find((o) => o.value === expiration)?.label}
              </SelectTrigger>
              <SelectContent className="bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark">
                {EXPIRATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value ?? 'never'}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="opacity-50 pointer-events-none">
            <p className="block text-sm font-medium text-text dark:text-text-dark mb-1.5">
              Escopos <span className="ml-2 text-xs text-gray-400">(em breve)</span>
            </p>
            <div className="p-3 rounded-lg border border-border dark:border-border-dark bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5" />
                Acesso total (herda permissões do usuário)
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!name.trim() || isCreating}
              className="w-full py-3 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? <Spinner size="sm" /> : <Key className="h-4 w-4" />}
              {isCreating ? 'Gerando...' : 'Gerar Token'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="w-full py-2.5 px-4 rounded-xl border border-border dark:border-border-dark text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-sm font-medium transition-colors disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function TokenCreatedModal({
  token,
  onClose,
}: Readonly<{
  token: string;
  onClose: () => void;
}>) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: 'Erro ao copiar',
        description:
          'Não foi possível copiar automaticamente. Selecione o token e copie manualmente.',
        type: 'error',
      });
    }
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      dismissible={false}
      className="max-w-md bg-card dark:bg-card-dark p-0"
    >
      <div className="flex flex-col min-h-0">
        <div className="flex items-center gap-3 px-6 pt-4 pb-3 border-b border-border dark:border-border-dark flex-shrink-0">
          <div className="p-2 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10">
            <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text dark:text-text-dark">
              Token criado com sucesso
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Copie e armazene o token em local seguro.
            </p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50/80 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              Copie o token agora. Por segurança, ele não será exibido novamente.
            </p>
          </div>

          <div className="relative">
            <Input
              readOnly
              value={token}
              className="pr-12 font-mono text-xs bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button
              type="button"
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Copiar token"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>

          <div className="space-y-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              Já copiei o token
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function ProfileApiTokensSection() {
  const {
    tokens,
    isLoading,
    isCreating,
    revokingTokenId,
    isCreateModalOpen,
    createdToken,
    openCreateModal,
    closeCreateModal,
    handleCreate,
    handleRevoke,
    clearCreatedToken,
  } = useProfileApiTokens();

  const activeTokens = tokens.filter(
    (t) => !t.revokedAt && !(t.expiresAt && new Date(t.expiresAt) < new Date()),
  );

  if (isLoading) {
    return (
      <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6">
        <div className="flex items-center justify-center py-12">
          <Spinner className="text-primary-500" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="relative overflow-hidden bg-card dark:bg-card-dark border-border dark:border-border-dark p-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-300 opacity-60" />

        <div className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex-shrink-0">
                <Key className="h-5 w-5 text-primary-500 dark:text-primary-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-text dark:text-text-dark">API Tokens</h2>
                  {tokens.length > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20">
                      {activeTokens.length} ativo{activeTokens.length === 1 ? '' : 's'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Tokens de acesso para integrações, automações e pipelines CI/CD.
                </p>
              </div>
            </div>

            {tokens.length > 0 && (
              <button
                type="button"
                onClick={openCreateModal}
                disabled={activeTokens.length >= MAX_TOKENS}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Novo Token</span>
              </button>
            )}
          </div>

          {tokens.length > 0 && (
            <div className="mb-5">
              <TokenUsageBar active={activeTokens.length} total={MAX_TOKENS} />
            </div>
          )}

          {tokens.length === 0 ? (
            <EmptyState onCreate={openCreateModal} />
          ) : (
            <div className="space-y-2.5">
              {tokens.map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  onRevoke={handleRevoke}
                  isRevoking={revokingTokenId === token.id}
                />
              ))}
            </div>
          )}

          {tokens.length > 0 && (
            <div className="mt-5 flex items-start gap-2.5 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/30">
              <Shield className="h-4 w-4 text-primary-500 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-primary-700 dark:text-primary-300 leading-relaxed">
                Envie o token no header{' '}
                <span className="font-mono font-semibold">Authorization: Bearer afk_...</span> para
                autenticar chamadas à API.
              </p>
            </div>
          )}
        </div>
      </Card>

      <CreateTokenModal
        open={isCreateModalOpen}
        onClose={closeCreateModal}
        onCreate={handleCreate}
        isCreating={isCreating}
      />

      {createdToken && (
        <TokenCreatedModal token={createdToken.plainToken} onClose={clearCreatedToken} />
      )}
    </>
  );
}
