# Air Finance App — Claude Code Briefing

> This file is read by Claude Code on every turn. For the full project briefing (stack, commands, patterns, modes), follow the redirect below.

## Primary source of truth

**Read `AGENTS.md` at the project root.** It contains the universal briefing: identity, stack, structure, commands, protocols, non-negotiable patterns, and PR workflow.

```
@AGENTS.md
```

You MUST read `AGENTS.md` before any substantive code action.

## Documentation map (read before working in an area)

| Working on... | Read first |
| --- | --- |
| Any file | `.cursor/rules/general.mdc` |
| `apps/web/src/pages/**` | `docs/CREATING_PAGES.md` + `docs/FRONTEND_ARCHITECTURE.md` |
| `apps/web/src/components/**` | `docs/DESIGN_SYSTEM.md` + `docs/FRONTEND_ARCHITECTURE.md` |
| `apps/web/src/services/**` | `docs/AUTH_SESSION_IMPLEMENTATION.md` (if auth) |
| `apps/web/src/layouts/**` | `docs/MOBILE_FIRST_GUIDE.md` + `docs/FRONTEND_ARCHITECTURE.md` |
| Responsive / mobile | `docs/MOBILE_FIRST_GUIDE.md` |
| Domain / business | `.cursor/rules/domain.mdc` + `docs/BUSINESS_DOMAIN.md` |
| Architecture decisions | `.cursor/rules/architecture.mdc` |
| Deploy | `docs/VERCEL_DEPLOY.md` |
| Monorepo migration | `docs/MIGRATION.md` |
| Security | `docs/SECURITY_FIX_REPORT.md` |
| Dependency versions | `docs/TECH_STACK.md` |
| Subscription / pricing | `docs/PRICING_ANALYSIS.md` |

## Skills available locally

Skills live in `.cursor/skills/<name>/SKILL.md` (repo-local) and `~/.cursor/skills/<name>/SKILL.md` (global).

| Skill | Typical trigger |
| --- | --- |
| `frontend-dev` | Creating pages, routes, services, hooks, components |
| `cognitive-complexity-guard` | Sonar S3776, deep nesting, refactoring complex functions |
| `senior-code-reviewer` | Code review, PR review, quality assessment |
| `principal-engineering-workflow` | Any implementation (feature, bugfix, refactor) |
| `error-plan-then-fix` | Error output, stack traces, build failures |
| `pr-creator-ado` | Creating pull requests |
| `create-adr` | "document decision", "record trade-off", "ADR" |
| `create-rfc` | "RFC for...", "propose big change" |
| `create-technical-design-doc` | "TDD for feature Y", "design doc" |

## Cursor rules (`.cursor/rules/*.mdc`) — manual read required

Claude Code does not auto-load `.mdc` files. You MUST manually read the appropriate `.mdc` file based on the task scope:

| Scope | Rule file |
| --- | --- |
| Any file in the project | `.cursor/rules/general.mdc` |
| `apps/**/*.tsx`, `apps/**/*.ts` | `.cursor/rules/architecture.mdc` |
| Business domain / features | `.cursor/rules/domain.mdc` |

Use the `Read` tool to load them before modifying files in the corresponding scope.

## Precedence hierarchy

1. **SDD Protocol** (`.cursor/rules/general.mdc`) — always wins.
2. **Architecture / Domain rules** — second.
3. **Documentation** (`docs/`) — reference patterns and conventions.
4. **Skills** — consultative, never override rules.
5. **AGENTS.md / CLAUDE.md** — operational briefing, aligned with rules.

## Non-negotiable patterns

- **Mobile-first**: All UI starts from small viewport, enhanced with `sm:`, `md:`, `lg:` breakpoints.
- **TypeScript strict**: Never use `any`. Use explicit types or `unknown` with narrowing.
- **Nullish coalescing**: Always use `??` instead of `||` for defaults.
- **Props readonly**: Mark component props interfaces as `readonly` (SonarQube typescript:S6759).
- **No unnecessary comments**: Code should be self-documenting.
- **Layouts**: Authenticated pages use `ViewDefault`; public pages use `LayoutAuth`.
- **State**: Server state via TanStack Query; client UI state via Zustand; form state via react-hook-form + zod.
- **Services**: HTTP calls go through `apiClient.ts`; feature services in `services/`.
- **Async**: Use `Promise.all` for independent work; `Promise.allSettled` for partial failure tolerance.

## Communication

- Code language: English (US).
- Chat language with dev: PT-BR.
- Test descriptions: English.
- Commit messages: Conventional, English (e.g., `feat(scope): summary`).

## Commands (run from monorepo root)

```bash
yarn dev          # All dev tasks via Turbo
yarn dev:web      # Web app only
yarn build        # Production build
yarn lint         # ESLint across workspaces
yarn typecheck    # TypeScript check
```
