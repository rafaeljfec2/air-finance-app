# Technical Plan — 007 BOLA Hardening

**Feature:** `007-bola-hardening`  
**Repos:** backend, connexto, frontend

## Implementation Order

1. Hotfix P0 (current-account auth, tenant diagnostics, service auth, webhook secret)
2. AccountOwnershipGuard + banking controllers
3. User / notifications / subscription / companies
4. Connexto Openi ownership + statement itemId
5. Frontend path normalization + company store
6. CompanyPermissionGuard on Openi/Pierre/categorization/dashboard
7. Review + quality gates

## Key Files

| Area | Files |
| --- | --- |
| Account guard | `back-end-financeiro-nestjs/src/common/guards/account-ownership.guard.ts` |
| Banking | `integrations/banking/controllers/*.ts` |
| User | `user/user.controller.ts`, `user/user.service.ts` |
| Notifications | `notification/notification.controller.ts` |
| Subscription | `subscription/subscription.controller.ts`, `subscription.service.ts` |
| Companies | `company/company.controller.ts`, `company.service.ts` |
| Connexto | `tenant/`, `banking/openi/`, `providers/openi/services/openi-statement.service.ts` |
| Frontend | `services/paymentService.ts`, `bankingIntegrationService.ts`, `creditCardService.ts` |

## Reuse

- `CompanyPermissionGuard` — company-scoped routes with RBAC
- `CompanyGuard` — membership only
- `GodRoleGuard` — admin-only legacy modules
