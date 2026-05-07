# API (consumer view)

> This app is a **SPA client** of the Air Finance NestJS API. Contract source of truth: **OpenAPI/Swagger on the API**, not duplicated here.

## Base URL

| Environment | Configuration |
| --- | --- |
| Local | `VITE_API_URL` in `apps/web` (e.g. `http://localhost:3000`) — see app env files |
| Staging / Production | Set in Vercel / host: `VITE_API_URL` pointing to deployed API origin |

The API global prefix is **`/meu-financeiro/v1`** (see backend `main.ts`).

**Swagger UI** (on API host): `{API_ORIGIN}/meu-financeiro/v1/swagger`

## Authentication

- **JWT** delivered as **HttpOnly cookies** (access + refresh) for browser sessions; `apiClient` uses `withCredentials: true`.
- **Bearer** header may be used where the client explicitly attaches a token (see [AUTH_SESSION_IMPLEMENTATION.md](./AUTH_SESSION_IMPLEMENTATION.md)).
- Company-scoped routes use **`/companies/:companyId/...`**; backend validates membership.

## Conventions (as implemented by the API)

- **Versioning**: path prefix `meu-financeiro/v1` (not a separate `/v1` header).
- **Errors**: normalized by API global filters; UI should map to toasts / inline error states.
- **Pagination / filtering**: follow query params documented per endpoint in Swagger.
- **Rate limiting**: global throttler on API; sensitive routes have stricter limits (login, register, password reset).

## Endpoints by domain (high level)

| Domain | Typical path pattern | Notes |
| --- | --- | --- |
| Auth | `/auth/*` | Login, refresh, logout, OAuth callbacks |
| Company-scoped data | `/companies/:companyId/*` | Accounts, transactions, budget, goals, banking, dashboard, … |
| Decision Engine | `POST /companies/:companyId/decision-engine/evaluate` and `POST /companies/:companyId/decision-engine/evaluate-auto` | Returns `status`, `primary_issue`, `ordering_rationale`, `actions`, `issue_drivers`; `evaluate-auto` may also include `period_coverage` for month completeness context (see API OpenAPI/Swagger; SDD specs `specs/001-financial-decision-engine/` and `specs/002-decision-engine-composer/`) |
| Subscription | `/subscription/*` | Stripe checkout, plan changes (exact paths in API Swagger) |
| Health | `/health` (if exposed) | API process checks |

For a full route list, use the backend **`docs/API_ROUTES.md`** in `back-end-financeiro-nestjs` or Swagger.

## OpenAPI

- **Do not** maintain a second OpenAPI file in this repo unless generating a typed client from the API spec becomes a team decision.
- Prefer reading Swagger on the running API when designing new services in `apps/web/src/services/`.
