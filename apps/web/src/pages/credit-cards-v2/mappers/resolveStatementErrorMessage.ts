/**
 * Resolves a user-facing error message from unknown thrown/query errors.
 * Avoids surfacing "[object Object]" when a plain object was coerced via String().
 */
export function resolveStatementErrorMessage(
  error: unknown,
  fallback = 'Não foi possível carregar os lançamentos. Tente novamente.',
): string {
  if (typeof error === 'string') {
    const trimmed = error.trim();
    if (trimmed.length > 0 && trimmed !== '[object Object]') {
      return trimmed;
    }
    return fallback;
  }

  if (error instanceof Error) {
    const trimmed = error.message.trim();
    if (trimmed.length > 0 && trimmed !== '[object Object]') {
      return trimmed;
    }
    return fallback;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { readonly message?: unknown }).message;
    if (typeof message === 'string') {
      const trimmed = message.trim();
      if (trimmed.length > 0 && trimmed !== '[object Object]') {
        return trimmed;
      }
    }
  }

  return fallback;
}
