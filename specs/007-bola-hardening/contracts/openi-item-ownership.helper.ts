/**
 * Contract: Openi item ownership (Connexto)
 */

export interface OpeniItemOwnershipHelper {
  assertOpeniItemBelongsToTenant(tenantId: string, itemId: string): Promise<void>;
}

/** HTTP: item not owned by tenant → 404 Not Found */
