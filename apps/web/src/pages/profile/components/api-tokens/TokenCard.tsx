import { Activity, Calendar, Clock, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import type { ApiTokenResponse } from '@/services/apiTokenService';

import { STATUS_CONFIG } from './constants';
import { formatExpirationDate, formatRelativeTime, getTokenStatus } from './utils';

interface TokenCardProps {
  readonly token: ApiTokenResponse;
  readonly onRevoke: (id: string) => void;
  readonly isRevoking: boolean;
}

export function TokenCard({ token, onRevoke, isRevoking }: Readonly<TokenCardProps>) {
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
            <RevokeConfirmation
              onConfirm={() => {
                onRevoke(token.id);
                setShowConfirm(false);
              }}
              onCancel={() => setShowConfirm(false)}
              isRevoking={isRevoking}
            />
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

function RevokeConfirmation({
  onConfirm,
  onCancel,
  isRevoking,
}: Readonly<{
  onConfirm: () => void;
  onCancel: () => void;
  isRevoking: boolean;
}>) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <span className="text-xs text-red-500 dark:text-red-400 font-medium">Confirmar?</span>
      <Button
        size="sm"
        variant="destructive"
        onClick={onConfirm}
        disabled={isRevoking}
        className="gap-1 h-7 text-xs"
      >
        {isRevoking ? <Spinner size="sm" /> : <Trash2 className="h-3 w-3" />}
        Sim
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel} className="h-7 text-xs">
        Não
      </Button>
    </div>
  );
}
