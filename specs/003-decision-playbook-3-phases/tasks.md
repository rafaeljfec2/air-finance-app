# Tasks — Decision playbook 3 phases

> Derived from `plan.md`. All tasks completed in iteration 0.1.

| ID | Task | Files touched | Status |
| --- | --- | --- | --- |
| T-001 | Backend: criar `theme-phase.resolver.ts` + spec (mapping `alert/warn/ok → red/yellow/green`; `healthy → green`; `data_incomplete → null`; fallback via `DECISION_LADDER` quando KPI driver ausente) | `back-end-financeiro-nestjs/src/decision-engine/domain/theme-phase.resolver.ts`, `back-end-financeiro-nestjs/src/decision-engine/domain/theme-phase.resolver.spec.ts` | done |
| T-002 | Backend: estender `DecisionEngineOutput` (tipo `ThemePhase`) e `DecisionEngineResponseDto` com `theme_phase` opcional + atualizar Swagger | `back-end-financeiro-nestjs/src/decision-engine/domain/decision-engine.types.ts`, `back-end-financeiro-nestjs/src/decision-engine/dto/decision-engine-response.dto.ts` | done |
| T-003 | Backend: integrar `resolveThemePhase` em `DecisionEngineService.evaluate`; propagar no controller; estender testes (service.spec, controller.spec, e2e evaluate-auto) | `back-end-financeiro-nestjs/src/decision-engine/domain/decision-engine.service.ts`, `back-end-financeiro-nestjs/src/decision-engine/interfaces/http/decision-engine.controller.ts`, `back-end-financeiro-nestjs/src/decision-engine/domain/decision-engine.service.spec.ts`, `back-end-financeiro-nestjs/src/decision-engine/interfaces/http/decision-engine.controller.spec.ts`, `back-end-financeiro-nestjs/test/decision-engine-evaluate-auto.e2e-spec.ts` | done |
| T-004 | Frontend: estender Zod schema em `decisionEngineService.ts` com `theme_phase` nullable opcional + atualizar testes do serviço (cobre payload com fase, com null e sem o campo) | `apps/web/src/services/decisionEngineService.ts`, `apps/web/src/services/decisionEngineService.test.ts` | done |
| T-005 | Frontend: criar pasta `pages/decision/playbooks/` com `types.ts`, `index.ts` (`getPlaybook`, `ALL_PLAYBOOKS`) e os 9 catálogos PT-BR (`liquidityRisk`, `debtPressure`, `creditOveruse`, `highCommitment`, `lowSurplus`, `lowSavings`, `highFixedCost`, `healthy`, `dataIncomplete`) | `apps/web/src/pages/decision/playbooks/types.ts`, `.../index.ts`, `.../<slug>.ts` (×9) | done |
| T-006 | Frontend: `playbooks.test.ts` validando shape (cobertura dos 9 slugs; 3-5 ações por fase; `rule` e `expectedImpact` não-vazios; lista de termos proibidos `KPI`, `índice`, `taxa de`, `rotativo`, `severity`, `snapshot`; fallback `healthy` em slug desconhecido) | `apps/web/src/pages/decision/playbooks/playbooks.test.ts` | done |
| T-007 | Frontend: criar `DecisionPlaybookCard.tsx` com primitivos do DS (Card/Badge/CardHeader); 3 sub-blocos em acordeão acessível (fase ativa expandida); regra contínua destacada; resultado esperado; mobile-first + dark mode | `apps/web/src/pages/decision/components/DecisionPlaybookCard.tsx` | done |
| T-008 | Frontend: `DecisionPlaybookCard.test.tsx` (fase ativa renderizada e expandida; alterna acordeão; placeholder em `data_incomplete`; renderiza blocos `Regra simples` e `Resultado esperado`) | `apps/web/src/pages/decision/components/DecisionPlaybookCard.test.tsx` | done |
| T-009 | Frontend: integrar `DecisionPlaybookCard` após `DecisionSecondaryActions` em `pages/decision/index.tsx` mantendo `Strip` / `PrimaryBlock` / `SecondaryActions` intactos | `apps/web/src/pages/decision/index.tsx` | done |
| T-010 | QA: `yarn lint` + `yarn jest` (em `--runInBand`) no backend; `yarn typecheck` + `yarn lint` no monorepo + `yarn test run src/pages/decision/ src/services/decisionEngineService.test.ts src/hooks/__tests__/useDecisionEngineEvaluateAuto.test.tsx` no frontend | n/a | done |
| T-011 | SDD: gerar pasta `specs/003-decision-playbook-3-phases/` (`spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/openapi.yaml`, `contracts/decision-engine.types.ts`, `tasks.md`) | `specs/003-decision-playbook-3-phases/**` | done |

## Acceptance evidence

- Backend tests (`--runInBand`): **34/34 passing** across `theme-phase.resolver.spec.ts`, `decision-engine.service.spec.ts`, `decision-engine.controller.spec.ts`.
- Frontend tests: **55/55 passing** across `pages/decision/`, `services/decisionEngineService.test.ts`, `hooks/__tests__/useDecisionEngineEvaluateAuto.test.tsx`.
- Backend `eslint src/decision-engine`: clean.
- Frontend `eslint src/pages/decision src/services/decisionEngineService.ts`: clean.
- Monorepo `yarn typecheck` (turbo, 3 packages): clean.
