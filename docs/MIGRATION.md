# Monorepo Migration Record

This document records the migration from a single-app repository to the current Turborepo monorepo structure.

## What changed

### Before (single app)

```
air-finance-app/
├── src/          # React + Vite web app
├── package.json  # Single package (Yarn 1.x)
└── ...
```

### After (monorepo)

```
air-finance-app/
├── apps/
│   ├── web/                   # @air-finance/web (migrated from root)
│   └── mobile-webview/        # @air-finance/mobile-webview (new)
├── packages/
│   └── shared/                # @air-finance/shared (new)
├── turbo.json
└── package.json               # Yarn 4 workspaces
```

## Workspaces created

### @air-finance/web

- Original `air-finance-app` code moved to `apps/web/`
- Package renamed to `@air-finance/web`
- Added dependency on `@air-finance/shared`
- All functionality preserved

### @air-finance/mobile-webview

- New Expo 55 app with React Native WebView
- Loads the web app inside a native container
- Auth hooks for WebView/native bridge

### @air-finance/shared

- Common types (API responses, errors, pagination)
- Constants (API URLs, endpoints, storage keys)
- Utilities (StorageManager with adapter pattern)

## Tooling changes

| Aspect | Before | After |
| --- | --- | --- |
| Package manager | Yarn 1.x | Yarn 4 (Berry) via Corepack |
| Build orchestration | N/A | Turborepo |
| Dependency management | Single `package.json` | Yarn workspaces |
| Lock file | Per-project | Single `yarn.lock` at root |
| TypeScript | Single `tsconfig.json` | Per-workspace with shared base |

## Script changes

| Before | After | Description |
| --- | --- | --- |
| `yarn dev` | `yarn dev` | Runs all workspaces via Turbo |
| -- | `yarn dev:web` | Web app only |
| -- | `yarn dev:mobile` | Mobile app with tunnel |
| `yarn build` | `yarn build` | Builds all workspaces |
| `yarn lint` | `yarn lint` | Lints all workspaces |
| -- | `yarn typecheck` | Type-checks all workspaces |

## Adding dependencies

```bash
yarn workspace @air-finance/web add <package>
yarn workspace @air-finance/mobile-webview add <package>
yarn workspace @air-finance/shared add <package>
yarn add -W -D <package>   # Root dev dependency
```

## Troubleshooting

### "Package not found in lockfile"

```bash
rm -f yarn.lock
yarn install
```

### "Cannot find module @air-finance/shared"

```bash
yarn install
yarn workspace @air-finance/shared type-check
```

### Port conflicts

Set `VITE_PORT` in `apps/web/.env` to change the dev server port.

### Mobile not connecting to backend

1. Ensure backend and web app are running
2. Use the machine's local IP instead of `localhost`
3. Update `WEBSITE_URL` in `apps/mobile-webview/src/constants/webview.ts`
