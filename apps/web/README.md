# Air Finance Web App

Personal finance web application built with React, TypeScript, and Vite, part of the Air Finance monorepo.

> **Note**: This is the `@air-finance/web` workspace in the Air Finance monorepo. For the full monorepo layout, see the [main README](../../README.md).

## 🚀 Technologies

- **React 18** — JavaScript library for building user interfaces
- **TypeScript** — JavaScript superset with static typing
- **Vite** — High-performance build tool and dev server
- **React Router v6** — Declarative routing
- **Tailwind CSS** — Utility-first CSS framework (mobile-first)
- **Zustand** — Lightweight global state management
- **React Query** (@tanstack/react-query) — Server state management
- **Lucide React** — Icon library
- **Class Variance Authority (CVA)** — Component variant system
- **@air-finance/shared** — Monorepo shared package (types, constants, utils)

## 📱 Features

- ✅ Company management and multi-company support
- ✅ Bank account registration and management
- ✅ Credit card management
- ✅ Automatic and manual transaction categorization
- ✅ Financial dashboard with real-time metrics
- ✅ Detailed reports and analytics
- ✅ OFX statement import
- ✅ Financial goals management
- ✅ Accounts payable and receivable
- ✅ AI-powered automatic classification
- ✅ Light/dark theme
- ✅ Responsive design (mobile-first)
- ✅ Custom toast notifications
- ✅ Safe area support (iOS/Android)

## 🚀 How to run (monorepo)

### Prerequisites

- Node.js 22+
- Yarn 4.0.0 (via Corepack)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/rafaeljfec2/air-finance-app.git
cd air-finance-app

# 2. Enable Corepack for Yarn 4
corepack enable

# 3. Install all dependencies
yarn install

# 4. Start the development server
yarn dev:web
```

The app will be available at `http://localhost:3000`

## 📦 Available scripts

### Monorepo scripts (run from repo root)

```bash
yarn dev:web           # Start web app only
yarn dev:mobile        # Start mobile app only
yarn build             # Build all workspaces
yarn lint              # Lint all workspaces
yarn typecheck         # Type-check all workspaces
```

### Workspace scripts (run in apps/web/)

```bash
yarn dev               # Development server
yarn build             # Production build
yarn preview           # Preview production build
yarn lint              # ESLint
yarn format            # Prettier
yarn test              # Vitest
yarn type-check        # Type checking
```

## 🔗 Shared dependencies

### @air-finance/shared

Shared package containing:

- **Types**: Common TypeScript types (API responses, errors, pagination)
- **Constants**: API constants, storage keys, configuration
- **Utils**: Storage, formatting, and helper utilities

```typescript
// Usage example
import { API_CONFIG, STORAGE_KEYS } from '@air-finance/shared/constants';
import { ApiResponse, ApiError } from '@air-finance/shared/types';
import { StorageManager } from '@air-finance/shared/utils';
```

## 📚 Documentation

- **[Monorepo README](../../README.md)** — Monorepo overview
- **[Deploy guide](../../VERCEL_DEPLOY.md)** — Vercel deployment
- **[Migration guide](../../MIGRATION.md)** — Monorepo migration
- **[Frontend architecture](./docs/FRONTEND_ARCHITECTURE.md)** — Full architecture
- **[Creating pages](./docs/CREATING_PAGES.md)** — Guide for new screens
- **[Design system](./docs/DESIGN_SYSTEM.md)** — Design system
- **[Mobile first](./docs/MOBILE_FIRST_GUIDE.md)** — Responsive patterns

## 🚀 Deploy

Automated Vercel deployment for the `main` branch.

**Configuration**:

- Root Directory: `.` (monorepo root)
- Build Command: `turbo run build --filter=@air-finance/web`
- Output: `apps/web/dist`

See [VERCEL_DEPLOY.md](../../VERCEL_DEPLOY.md) for details.

## 👥 Authors

- **Rafael de Jesus Ferreira** — Development and maintenance

## 📄 License

MIT License — See [LICENSE](../../LICENSE) for details
