# Runbook

> Operations for **this monorepo** (SPA + WebView). Database and API process runbooks live in `back-end-financeiro-nestjs`.

## Environments

| Environment | URL | Notes |
| --- | --- | --- |
| Local web | Vite default (see `apps/web` dev script) | Requires API running at `VITE_API_URL` |
| Production | Vercel project for `@air-finance/web` | See [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) |

Staging URL and branch policy follow your org’s Vercel/Git settings (set explicitly in Vercel dashboard).

## Required environment variables (web)

Documented in [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md). Typical production:

| Name | Description |
| --- | --- |
| `VITE_API_URL` | Origin of Air Finance API (no trailing slash convention as per team) |
| `VITE_APP_NAME` | Display name |
| `VITE_APP_VERSION` | Release label |
| `ENABLE_EXPERIMENTAL_COREPACK` | `1` on Vercel for Yarn 4 via Corepack |

There is **no** `DATABASE_URL` in this package; persistence is entirely on the API.

## Deploy (frontend)

Per [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md):

- **Build**: `turbo run build --filter=@air-finance/web`
- **Output**: `apps/web/dist` (Vercel **Output Directory** `dist` when Root Directory is monorepo root—confirm against your Vercel project settings)
- **Install**: `corepack enable && yarn install`

## Smoke checks after deploy

1. Login and session refresh.
2. Company switcher loads and refetches data.
3. Critical routes: dashboard, transactions, accounts (no blank chunk errors).

## Observability (client)

- **Errors**: browser console + Vercel Runtime / Analytics as configured.
- **API health**: monitored on the API infrastructure, not in this repo.

## Rollback (Vercel)

Use Vercel **Instant Rollback** to the previous production deployment, or redeploy a known-good Git SHA from the dashboard.

## Related runbooks

| Concern | Where |
| --- | --- |
| API uptime, Mongo, Stripe webhooks | `back-end-financeiro-nestjs/docs/` |
| Banking / Connexto | `connexto-integration-bank/docs/` |
