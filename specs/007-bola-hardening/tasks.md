# Tasks — 007 BOLA Hardening

> Red → Green → Refactor per SDD protocol.

## Hotfix P0

- **T-H01 [BE]** — Spec current-account requires JWT → implement JwtAuthGuard + user scope
- **T-H02 [CONN]** — Remove TenantDiagnosticsController from module
- **T-H03 [CONN]** — ServiceAuthGuard on TenantController
- **T-H04 [CONN]** — Webhook fail closed without OPENI_WEBHOOK_SECRET in production

## Backend Guards

- **T-010 [BE]** — AccountOwnershipGuard spec + implementation + banking controllers
- **T-011 [BE]** — User module scoped GET/PUT/POST/company-role
- **T-012 [BE]** — Notifications + subscription JWT ownership
- **T-013 [BE]** — Companies list scoped to user.companyIds

## Connexto

- **T-020 [CONN]** — assertOpeniItemBelongsToTenant + openi.controller + statement
- **T-021 [CONN]** — Webhook findItemByItemId tenant scope

## Frontend

- **T-030 [FE]** — paymentService + bankingIntegrationService company paths
- **T-031 [FE]** — creditCardService statement path
- **T-032 [FE]** — ai-classification uses stores/company.ts

## Depth

- **T-040 [BE]** — CompanyPermissionGuard on categorization, banking-openi, banking-pierre, dashboard
- **T-041 [BE]** — Transaction create accountId scope validation

## Validation

- **T-043** — BOLA matrix tests green; lint/typecheck/build all repos
- **T-REVIEW** — review.md verdict
