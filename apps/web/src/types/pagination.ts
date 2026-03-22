export interface PaginatedResponse<T> {
  readonly data: T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
}

export interface PaginationParams {
  readonly page?: number;
  readonly limit?: number;
}

export function isPaginatedEnvelope(value: unknown): value is {
  readonly data: unknown[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
} {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    Array.isArray(o.data) &&
    typeof o.total === 'number' &&
    typeof o.page === 'number' &&
    typeof o.limit === 'number' &&
    typeof o.totalPages === 'number'
  );
}
