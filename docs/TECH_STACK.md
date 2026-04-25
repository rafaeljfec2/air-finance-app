# Tech Stack

Exact dependency versions from `package.json` files across the monorepo. Updated from source.

## Monorepo root

| Tool | Version | Purpose |
| --- | --- | --- |
| Yarn | 4.13.0 | Package manager (via Corepack) |
| Turborepo | ^2.8.20 | Build orchestration and caching |
| Node.js | >=24.x | Runtime (engines field) |
| Husky | ^9.1.7 | Git hooks |
| lint-staged | ^16.2.7 | Pre-commit linting |
| Prettier | ^3.7.4 | Code formatting |

## Web app (`@air-finance/web`)

### Core

| Library | Version | Purpose |
| --- | --- | --- |
| React | ^18.2.0 | UI framework |
| React DOM | ^18.2.0 | DOM renderer |
| TypeScript | ^5.2.2 | Type system |
| Vite | ^5.1.0 | Build tool and dev server |

### Routing and data

| Library | Version | Purpose |
| --- | --- | --- |
| react-router-dom | ^6.22.1 | Client-side routing |
| @tanstack/react-query | ^5.17.19 | Server state management |
| Zustand | ^5.0.3 | Client UI state management |
| Axios | ^1.15.0 | HTTP client |

### Forms and validation

| Library | Version | Purpose |
| --- | --- | --- |
| react-hook-form | ^7.50.1 | Form state management |
| @hookform/resolvers | ^3.3.4 | Resolver adapters (zod) |
| Zod | ^3.22.4 | Schema validation |

### UI components

| Library | Version | Purpose |
| --- | --- | --- |
| Tailwind CSS | ^3.4.1 | Utility-first CSS |
| @headlessui/react | ^2.2.7 | Accessible headless components |
| @radix-ui/react-dropdown-menu | ^2.1.16 | Dropdown menu primitive |
| @radix-ui/react-popover | ^1.1.15 | Popover primitive |
| @radix-ui/react-select | ^2.2.2 | Select primitive |
| @radix-ui/react-switch | ^1.2.2 | Toggle switch primitive |
| @radix-ui/react-tabs | ^1.1.9 | Tabs primitive |
| @radix-ui/react-tooltip | ^1.2.4 | Tooltip primitive |
| class-variance-authority | ^0.7.1 | Component variant management |
| clsx | ^2.1.1 | Conditional class names |
| tailwind-merge | ^3.2.0 | Merge Tailwind classes |
| lucide-react | ^0.503.0 | Icon library |
| sonner | ^2.0.6 | Toast notifications |

### Charts and animation

| Library | Version | Purpose |
| --- | --- | --- |
| Recharts | ^2.15.3 | Data visualization |
| framer-motion | ^12.23.26 | Animation library |

### Utilities

| Library | Version | Purpose |
| --- | --- | --- |
| date-fns | ^3.3.1 | Date manipulation |
| crypto-js | ^4.2.0 | Client-side encryption |
| react-helmet-async | ^2.0.5 | Document head management (SEO) |
| react-window | ^1.8.11 | List virtualization |
| react-intersection-observer | ^10.0.0 | Intersection observer hook |
| react-day-picker | ^9.13.0 | Date picker component |
| flatpickr | ^4.6.13 | Date/time picker |

### Dev tools

| Library | Version | Purpose |
| --- | --- | --- |
| Vitest | ^1.2.2 | Test runner |
| @testing-library/react | ^14.2.1 | Component testing utilities |
| @testing-library/jest-dom | ^6.6.3 | DOM assertion matchers |
| ESLint | ^9.39.0 | Linting |
| PostCSS | ^8.4.35 | CSS processing |
| Autoprefixer | ^10.4.17 | Vendor prefix automation |
| @tailwindcss/forms | ^0.5.10 | Form styling plugin |
| @tailwindcss/typography | ^0.5.19 | Prose styling plugin |
| @tanstack/react-query-devtools | ^5.75.1 | Query debugging |
| vite-plugin-svgr | ^4.3.0 | SVG as React components |
| Terser | ^5.39.0 | JavaScript minifier |

## Mobile app (`@air-finance/mobile-webview`)

| Library | Version | Purpose |
| --- | --- | --- |
| Expo | ~55.0.6 | React Native framework |
| React | 19.2.3 | UI framework (Expo-managed) |
| React Native | 0.84.0 | Native runtime |
| react-native-webview | 13.16.1 | WebView component |
| react-native-safe-area-context | ~5.7.0 | Safe area handling |
| expo-secure-store | ~55.0.8 | Secure token storage |
| expo-status-bar | ~55.0.4 | Status bar control |
| TypeScript | ~5.9.2 | Type system |

## Shared package (`@air-finance/shared`)

| Library | Version | Purpose |
| --- | --- | --- |
| TypeScript | ^5.9.2 | Type system |
| ESLint | ^9.39.0 | Linting |

No runtime dependencies. Shared types, constants, and utilities are consumed at build time.

## Key resolution overrides (root)

Security and compatibility patches enforced via `resolutions` in root `package.json`:

| Package | Pinned version |
| --- | --- |
| axios | 1.15.0 |
| undici | 6.24.1 |
| node-forge | 1.4.0 |
| follow-redirects | 1.16.0 |
| tar | 7.5.11 |
