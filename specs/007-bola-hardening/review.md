# Review — 007 BOLA Hardening

**Verdict:** PASS WITH NOTES

## Security Checklist (BOLA)

- [x] Banking routes validate account ownership via `AccountOwnershipGuard`
- [x] User GET/PUT scoped; company-role requires `USERS_CHANGE_ROLE`
- [x] Notifications derive userId from JWT
- [x] Subscription checkout/cancel bound to authenticated user
- [x] Companies list scoped to membership (god bypass)
- [x] Connexto tenant admin protected by `ServiceAuthGuard`
- [x] Tenant diagnostics controller removed from module registration
- [x] Openi itemId validated against tenant in controller + statement
- [x] Webhook signature required in production when secret missing → fail closed
- [x] Categorization mutating endpoints with companyId use `CompanyPermissionGuard`
- [x] Dashboard / Openi / Pierre use `CompanyGuard`
- [x] Transaction create validates accountId within companyId
- [x] Frontend credit card statement uses company-scoped path

## Notes

- `CONNEXTO_SERVICE_API_KEY` must be set in Connexto environments using tenant admin API
- `current-account` legacy module now requires JWT + user scope
- Full pentest / E2E BOLA suite recommended for production sign-off
- `x-tenant-id` caller mapping (T-042) deferred — mitigated by service auth on admin routes

## Quality Gates

Run per repo after deploy:

- `back-end-financeiro-nestjs`: `yarn test`, `yarn lint`, `yarn build`
- `connexto-integration-bank`: `yarn test`, `yarn lint`, `yarn build`
- `air-finance-app`: `yarn vitest run`, `yarn typecheck`, `yarn lint`
