import { Key, Plus, Shield } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useProfileApiTokens } from '../../hooks/useProfileApiTokens';

import { MAX_TOKENS } from './constants';
import { CreateTokenModal } from './CreateTokenModal';
import { EmptyState } from './EmptyState';
import { TokenCard } from './TokenCard';
import { TokenCreatedModal } from './TokenCreatedModal';
import { TokenUsageBar } from './TokenUsageBar';
import { isTokenActive } from './utils';

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

  const activeCount = tokens.filter(isTokenActive).length;
  const hasTokens = tokens.length > 0;

  if (isLoading) {
    return (
      <Card className="bg-card dark:bg-card-dark border-border dark:border-border-dark p-6">
        <div className="space-y-4 py-2">
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-10 w-3/4 rounded-md" />
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="relative overflow-hidden bg-card dark:bg-card-dark border-border dark:border-border-dark p-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-primary-300 opacity-60" />

        <div className="p-6">
          <SectionHeader
            activeCount={activeCount}
            hasTokens={hasTokens}
            canCreate={activeCount < MAX_TOKENS}
            onCreateClick={openCreateModal}
          />

          {hasTokens && (
            <div className="mb-5">
              <TokenUsageBar active={activeCount} total={MAX_TOKENS} />
            </div>
          )}

          {hasTokens ? (
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
          ) : (
            <EmptyState onCreate={openCreateModal} />
          )}

          {hasTokens && <UsageTip />}
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

function SectionHeader({
  activeCount,
  hasTokens,
  canCreate,
  onCreateClick,
}: Readonly<{
  activeCount: number;
  hasTokens: boolean;
  canCreate: boolean;
  onCreateClick: () => void;
}>) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex-shrink-0">
          <Key className="h-5 w-5 text-primary-500 dark:text-primary-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-text dark:text-text-dark">API Tokens</h2>
            {hasTokens && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20">
                {activeCount} ativo{activeCount === 1 ? '' : 's'}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Tokens de acesso para integrações, automações e pipelines CI/CD.
          </p>
        </div>
      </div>

      {hasTokens && (
        <button
          type="button"
          onClick={onCreateClick}
          disabled={!canCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Novo Token</span>
        </button>
      )}
    </div>
  );
}

function UsageTip() {
  return (
    <div className="mt-5 flex items-start gap-2.5 p-3 rounded-lg bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/30">
      <Shield className="h-4 w-4 text-primary-500 dark:text-primary-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-primary-700 dark:text-primary-300 leading-relaxed">
        Envie o token no header{' '}
        <span className="font-mono font-semibold">Authorization: Bearer afk_...</span> para
        autenticar chamadas à API.
      </p>
    </div>
  );
}
