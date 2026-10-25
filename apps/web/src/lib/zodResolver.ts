import { zodResolver as hookformZodResolver } from '@hookform/resolvers/zod';
import type { FieldValues, Resolver } from 'react-hook-form';
import type { ZodTypeAny } from 'zod/v3';

/**
 * Adapter for @hookform/resolvers against Zod v3 schemas imported from `zod/v3`
 * while the installed package is Zod 4 (Snyk-fixed). Resolvers package types
 * bind to Zod 4's ZodType shape.
 */
export function zodResolver<TFieldValues extends FieldValues>(
  schema: ZodTypeAny,
): Resolver<TFieldValues> {
  return hookformZodResolver(schema as never) as Resolver<TFieldValues>;
}
