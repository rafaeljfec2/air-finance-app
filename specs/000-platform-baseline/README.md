# Spec 000 — Platform baseline (SDD phases)

**Status:** baseline documented  
**Scope:** Monorepo boundaries, discovery docs, and constitution—no product feature delivery.

## Intent

Capture the outcome of **SDD init → discovery → constitution** so future feature specs (`001+`) link to a stable platform baseline.

## Artifacts

| Artifact | Path |
| --- | --- |
| Constitution | `memory/constitution.md` |
| Module map | `docs/MODULES.md` |
| Data ownership | `docs/DATA_MODEL.md` |
| API consumer contract | `docs/API.md` |
| Integrations boundary | `docs/INTEGRATIONS.md` |
| Local dev | `docs/DEVELOPMENT.md` |
| Frontend ops | `docs/RUNBOOK.md` |
| Product domain (existing) | `docs/BUSINESS_DOMAIN.md` |
| UI architecture (existing) | `docs/ARCHITECTURE.md`, `docs/FRONTEND_ARCHITECTURE.md` |

## Acceptance

- [x] Discovery docs reflect Yarn 4 + Turborepo + `apps/web` reality (no fictional `apps/api` in this repo).
- [x] Data model clarifies API-owned persistence vs client types.
- [x] Constitution encodes layering, testing, security, and deploy rules aligned with `.cursor/rules`.

## Next

Use **`/sdd-specify`** (or create `specs/001-<feature>/`) for the next **functional** change; link back to this baseline when touching cross-repo contracts.
