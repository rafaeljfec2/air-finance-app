# Tasks — Decision playbook 3 phases

> Derived from `plan.md`. All tasks completed in iteration 0.1.

| ID | Task | Files touched | Status |
| --- | --- | --- | --- |
| T-001 | Backend: create `theme-phase.resolver.ts` + spec (mapping `alert/warn/ok → red/yellow/green`; `healthy → green`; `data_incomplete → null`; fallback via `DECISION_LADDER` when driver KPI missing) | `back-end-financeiro-nestjs/src/decision-engine/domain/theme-phase.resolver.ts`, `back-end-financeiro-nestjs/src/decision-engine/domain/theme-phase.resolver.spec.ts` | done |
| T-002 | Backend: extend `DecisionEngineOutput` (`ThemePhase` type) and `DecisionEngineResponseDto` with optional `theme_phase` + update Swagger | `back-end-financeiro-nestjs/src/decision-engine/domain/decision-engine.types.ts`, `back-end-financeiro-nestjs/src/decision-engine/dto/decision-engine-response.dto.ts` | done |
| T-003 | Backend: integrate `resolveThemePhase` in `DecisionEngineService.evaluate`; propagate in controller; extend tests (service.spec, controller.spec, e2e evaluate-auto) | `back-end-financeiro-nestjs/src/decision-engine/domain/decision-engine.service.ts`, `back-end-financeiro-nestjs/src/decision-engine/interfaces/http/decision-engine.controller.ts`, `back-end-financeiro-nestjs/src/decision-engine/domain/decision-engine.service.spec.ts`, `back-end-financeiro-nestjs/src/decision-engine/interfaces/http/decision-engine.controller.spec.ts`, `back-end-financeiro-nestjs/test/decision-engine-evaluate-auto.e2e-spec.ts` | done |
| T-004 | Frontend: extend Zod schema in `decisionEngineService.ts` with optional nullable `theme_phase` + update service tests (covers payload with phase, null, and without field) | `apps/web/src/services/decisionEngineService.ts`, `apps/web/src/services/decisionEngineService.test.ts` | done |
| T-005 | Frontend: create `pages/decision/playbooks/` with `types.ts`, `index.ts` (`getPlaybook`, `ALL_PLAYBOOKS`) and 9 PT-BR catalogs (`liquidityRisk`, `debtPressure`, `creditOveruse`, `highCommitment`, `lowSurplus`, `lowSavings`, `highFixedCost`, `healthy`, `dataIncomplete`) | `apps/web/src/pages/decision/playbooks/types.ts`, `.../index.ts`, `.../<slug>.ts` (×9) | done |
| T-006 | Frontend: `playbooks.test.ts` validating shape (9 slug coverage; 3–5 actions per phase; non-empty `rule` and `expectedImpact`; forbidden-substring list; `healthy` fallback for unknown slug) | `apps/web/src/pages/decision/playbooks/playbooks.test.ts` | done |
| T-007 | Frontend: create `DecisionPlaybookCard.tsx` with DS primitives (Card/Badge/CardHeader); 3 accessible accordion sub-blocks (active phase expanded); highlighted ongoing rule; expected outcome; mobile-first + dark mode | `apps/web/src/pages/decision/components/DecisionPlaybookCard.tsx` | done |
| T-008 | Frontend: `DecisionPlaybookCard.test.tsx` (active phase rendered and expanded; toggles accordion; placeholder for `data_incomplete`; renders “Simple rule” and “Expected outcome” blocks) | `apps/web/src/pages/decision/components/DecisionPlaybookCard.test.tsx` | done |
| T-009 | Frontend: integrate `DecisionPlaybookCard` after `DecisionSecondaryActions` in `pages/decision/index.tsx` keeping `Strip` / `PrimaryBlock` / `SecondaryActions` intact | `apps/web/src/pages/decision/index.tsx` | done |
| T-010 | QA: `yarn lint` + `yarn jest` (with `--runInBand`) on backend; `yarn typecheck` + `yarn lint` in monorepo + `yarn test run src/pages/decision/ src/services/decisionEngineService.test.ts src/hooks/__tests__/useDecisionEngineEvaluateAuto.test.tsx` on frontend | n/a | done |
| T-011 | SDD: generate `specs/003-decision-playbook-3-phases/` folder (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/openapi.yaml`, `contracts/decision-engine.types.ts`, `tasks.md`) | `specs/003-decision-playbook-3-phases/**` | done |

## Acceptance evidence

- Backend tests (`--runInBand`): **34/34 passing** across `theme-phase.resolver.spec.ts`, `decision-engine.service.spec.ts`, `decision-engine.controller.spec.ts`.
- Frontend tests: **55/55 passing** across `pages/decision/`, `services/decisionEngineService.test.ts`, `hooks/__tests__/useDecisionEngineEvaluateAuto.test.tsx`.
- Backend `eslint src/decision-engine`: clean.
- Frontend `eslint src/pages/decision src/services/decisionEngineService.ts`: clean.
- Monorepo `yarn typecheck` (turbo, 3 packages): clean.
