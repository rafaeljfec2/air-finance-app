import { buildRawEnv, parseEnvSafe, type Env } from './envSchema';

const getEnv = (): Env => parseEnvSafe(buildRawEnv(import.meta.env));

export const env = getEnv();
export type { Env };
export { parseEnv as parseEnvForTests, buildRawEnv, resolveAppEnv } from './envSchema';
