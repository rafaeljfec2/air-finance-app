# Plan — Spec 000 (baseline)

## Goal

Document platform boundaries and SDD artifacts without shipping application code.

## Approach

1. Align auto-generated SDD skeletons with the real monorepo (web + mobile-webview + shared).
2. Record API consumer perspective and integration boundaries.
3. Encode constitution in `memory/constitution.md`.
4. Index docs in `docs/README.md`.

## Out of scope

- Backend or Connexto code changes.
- New UI routes or features.

## Verification

- [x] Docs render in repo; links resolve relative to `docs/`.
- [x] No references to non-existent `apps/api` as this repo’s module.

## Risks

- **Drift**: when API prefix or env names change, update `docs/API.md` and `VERCEL_DEPLOY.md` together.
