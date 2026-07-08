/**
 * Contract: AccountOwnershipGuard (backend NestJS)
 * Resolves account from route param and validates JWT user membership.
 */

export interface AccountOwnershipRequest {
  params: { accountId?: string };
  user?: { id: string; companyIds?: string[] };
  account?: { _id: string; companyId: string };
}

export interface AccountOwnershipGuardContract {
  canActivate(context: unknown): Promise<boolean>;
}

/** HTTP: cross-tenant account access → 404 Not Found */
