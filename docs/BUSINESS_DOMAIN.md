# Business Domain -- Air Finance

Product context, business areas, and key rules for the Air Finance platform.

## Product overview

Air Finance is a SaaS financial management platform for individuals and businesses. It provides:

- Multi-company financial tracking from a single account
- Bank account and credit card management
- Transaction categorization (manual and AI-assisted)
- Budget planning and financial goals
- Open Finance integration for automatic bank statements
- Reports, insights, and dashboards
- Mobile access via Expo WebView app

The backend API runs on NestJS at `/meu-financeiro/v1`. The frontend consumes it via Axios with HttpOnly cookie authentication.

## Core business areas

### Dashboard

Aggregated KPIs, charts, and shortcuts. Entry point after login. Shows balances, recent transactions, spending by category, and goal progress.

### Transactions

Central record of all financial movements. Supports:

- Manual creation (income/expense)
- OFX file import
- AI-assisted categorization
- Installment tracking
- Recurring transactions
- Filtering by date range, category, account, type
- Payables and receivables views

### Accounts

Bank accounts with balances and statements. Supports:

- Manual account creation
- Open Finance connected accounts (automatic statements)
- Account detail view with balance history
- Statement schedule management

### Credit cards

Credit card management with:

- Card listing and details
- Bill tracking by period
- Bill payment recording

### Budget

Monthly budget planning with category-level allocation. Compares planned vs. actual spending.

### Goals

Financial goals with target amounts, deadlines, and progress tracking.

### Open Finance

Bank connection management via Open Finance providers:

- Consent flow
- Account linking
- Automatic statement fetching
- Connection status monitoring

### Reports and insights

- Monthly and annual financial reports
- AI-powered insights (when enabled)
- Monthly closing summary
- Annual result view
- Financial health assessment

### Recurring transactions

Automated recurring income/expense entries. Manages frequency, start/end dates, and auto-creation of individual transactions.

### Categories

User-managed transaction categories. Used across transactions, budgets, and reports.

### Income sources

Tracks sources of income for categorization and reporting.

## Multi-company model

A single user account can manage multiple companies (CNPJs). Key behaviors:

- Active company is selected in the UI via `CompanySelectionModal`
- `useCompanyStore` persists the active company selection (sanitized, no userIds)
- All API requests are scoped to the active company via backend guards
- Company switching is instant (client-side store update + query invalidation)
- Backend validates user-company membership on every request (see [SECURITY_FIX_REPORT.md](./SECURITY_FIX_REPORT.md))

## User roles and permissions

The system supports role-based access control:

| Role | Description |
| --- | --- |
| Owner | Full access, company management |
| Admin | Full access within company |
| User | Standard access, data entry and viewing |
| God | System-level admin (internal only, accesses `/admin/*` routes) |

Permissions are enforced by backend guards. The frontend uses `RequireGod` component for admin-only routes.

### Dependents (users)

Company owners can add dependent users who get access to the company's data. Managed via the `/users` and `/dependents` pages.

## Subscription and entitlements

Subscription is managed via Stripe on the backend. Frontend flows:

- **Pricing page** (`/pricing`): public, shows plan comparison
- **Profile subscription tab**: manage current plan, billing
- **Paywalls**: feature-gated UI prompts upgrade when plan limits are reached
- **Open Finance slots**: controlled by subscription plan (number of connected accounts)

Plan tiers and pricing details are in [PRICING_ANALYSIS.md](./PRICING_ANALYSIS.md).

## Onboarding flow

New users follow a guided onboarding before accessing the main app:

1. Account creation (email/password or Google OAuth)
2. Email verification (pending page with resend)
3. Onboarding wizard (company setup, initial configuration)
4. Dashboard access

Routes with `OnboardingGuard` redirect users who haven't completed onboarding. The `/onboarding` page guides them through required steps.

## Key business rules and invariants

1. **Company scoping**: All financial data (transactions, accounts, cards, budgets, goals) belongs to a company, not directly to a user. A user accesses data through their company membership.

2. **No cross-company data leakage**: Backend guards validate user-company membership on every request. localStorage never stores other users' IDs (see [SECURITY_FIX_REPORT.md](./SECURITY_FIX_REPORT.md)).

3. **Balance integrity**: Account balances are computed from transaction history. Direct balance manipulation is not allowed outside of reconciliation flows.

4. **Subscription gating**: Features like Open Finance connections are limited by subscription plan. The backend enforces slot limits; the frontend shows appropriate upgrade prompts.

5. **Category consistency**: Categories are shared within a company. Deleting a category requires handling existing transactions that reference it.

6. **Recurring transaction automation**: Recurring rules generate individual transactions. The generated transactions are standalone records -- deleting the rule does not retroactively remove generated entries.

7. **Authentication invariants**: Access tokens expire in 24h, refresh tokens in 7 days. Refresh tokens are single-use (rotated on each refresh). See [AUTH_SESSION_IMPLEMENTATION.md](./AUTH_SESSION_IMPLEMENTATION.md).

## SEO pages

Public-facing SEO content pages live under `pages/seo/` and are accessible without authentication. They use `react-helmet-async` for metadata and target search keywords around personal financial management.

Current SEO pages:

- `/gestao-financeira-cpf` -- main landing
- `/gestao-financeira-cpf/controle-financeiro-pessoal`
- `/gestao-financeira-cpf/organizacao-financeira-pessoal`
- `/gestao-financeira-cpf/categorizacao-automatica-gastos`
- `/gestao-financeira-cpf/gestao-financeira-com-inteligencia-artificial`
- `/gestao-financeira-cpf/score-credito-e-financas-pessoais`
