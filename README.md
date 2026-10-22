# Air Finance Monorepo

Monorepo for the Air Finance system, containing the web app and the mobile app.

## Project structure

```
air-finance-monorepo/
├── apps/
│   ├── web/                    # React + Vite frontend
│   └── mobile-webview/         # Expo + WebView mobile app
├── packages/
│   └── shared/                 # Shared code
│       ├── types/              # TypeScript types
│       ├── constants/          # Constants and configs
│       └── utils/              # Utilities
├── package.json                # Root package.json
├── turbo.json                  # Turborepo configuration
└── .yarnrc.yml                 # Yarn configuration
```

## Technologies

- **Monorepo**: Yarn Workspaces + Turborepo
- **Web**: React 18, TypeScript, Vite, TailwindCSS
- **Mobile**: Expo, React Native, WebView
- **Shared**: TypeScript, constants, utils

## Prerequisites

- Node.js >= 18.0.0
- Yarn >= 4.0.0

## Installation

```bash
# Install Yarn 4 (if needed)
corepack enable
corepack prepare yarn@4.0.0 --activate

# Install all dependencies
yarn install
```

## Available scripts

### Development

```bash
# Run all apps in dev mode
yarn dev

# Run web only
yarn dev:web

# Run mobile only
yarn dev:mobile
```

### Build

```bash
# Build all projects
yarn build
```

### Linting and type check

```bash
# Lint all projects
yarn lint

# Auto-fix lint issues
yarn lint:fix

# Type-check all projects
yarn typecheck
```

### Cleanup

```bash
# Remove node_modules and cache
yarn clean
```

## Workspaces

### @air-finance/web

Web frontend built with React, TypeScript, and Vite.

**Main features:**

- Full financial management
- Budgets and goals
- Credit cards
- Reports and dashboards
- Multi-company

**Scripts:**

```bash
yarn workspace @air-finance/web dev
yarn workspace @air-finance/web build
yarn workspace @air-finance/web lint
```

**Documentation:** [apps/web/README.md](apps/web/README.md)

### @air-finance/mobile-webview

Native mobile app using Expo and WebView to load the web app.

**Main features:**

- Loads the web app via WebView
- Stores authentication tokens
- iOS and Android support
- Push notifications (future)

**Scripts:**

```bash
yarn workspace @air-finance/mobile-webview start
yarn workspace @air-finance/mobile-webview android
yarn workspace @air-finance/mobile-webview ios
```

**Documentation:** [apps/mobile-webview/README.md](apps/mobile-webview/README.md)

### @air-finance/shared

Package shared between web and mobile.

**Contents:**

- Common TypeScript types
- API and storage constants
- Storage and formatting utilities

## Adding dependencies

```bash
# Add a dependency to a specific workspace
yarn workspace @air-finance/web add <package>
yarn workspace @air-finance/mobile-webview add <package>
yarn workspace @air-finance/shared add <package>

# Add a dev dependency to a specific workspace
yarn workspace @air-finance/web add -D <package>

# Add a dependency at the repo root
yarn add -W <package>
```

## Local development

### Web app

1. Configure the `.env` file in `apps/web/`
2. Run `yarn dev:web`
3. Open `http://localhost:5173`

### Mobile app

1. Make sure the web app is running
2. Run `yarn dev:mobile`
3. Scan the QR code with Expo Go

## Turborepo

The project uses Turborepo to:

- Parallelize build, lint, and test tasks
- Cache results for faster builds
- Manage dependencies between workspaces

### Configuration

Configuration lives in `turbo.json`. Main tasks:

- `dev`: Development mode (persistent, no cache)
- `build`: Production build (cached)
- `lint`: Linting (with dependencies)
- `type-check`: Type checking

## CI/CD

The project is set up for CI/CD with GitHub Actions:

- Automatic builds on PRs
- Automatic deploy on merge to main
- Type and lint checks

## Branch structure

- `main` — Production
- `develop` — Development
- `feature/*` — Features
- `fix/*` — Fixes

## Versioning

The project follows [Semantic Versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH`
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

## Contributing

1. Create a branch from `develop`
2. Make your changes
3. Run `yarn lint:fix` and `yarn typecheck`
4. Open a PR to `develop`

## License

Proprietary — All rights reserved

## Support

For support, contact the development team.
