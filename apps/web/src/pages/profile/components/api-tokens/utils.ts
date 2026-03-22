import type { ApiTokenResponse } from '@/services/apiTokenService';

import type { TokenStatus } from './constants';

export function getTokenStatus(token: ApiTokenResponse): TokenStatus {
  if (token.revokedAt) return 'revoked';
  if (token.expiresAt && new Date(token.expiresAt) < new Date()) return 'expired';
  return 'active';
}

export function isTokenActive(token: ApiTokenResponse): boolean {
  return getTokenStatus(token) === 'active';
}

export function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Nunca';

  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMinutes < 1) return 'Agora';
  if (diffMinutes < 60) return `${diffMinutes}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 30) return `${diffDays}d`;
  return new Date(dateString).toLocaleDateString('pt-BR');
}

export function formatExpirationDate(dateString: string | null): string {
  if (!dateString) return 'Nunca';

  const date = new Date(dateString);
  if (date < new Date()) return 'Expirado';
  return date.toLocaleDateString('pt-BR');
}
