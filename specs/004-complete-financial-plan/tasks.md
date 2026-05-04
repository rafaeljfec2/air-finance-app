# Tasks — Complete Financial Plan

| ID | Status | Tarefa |
| --- | --- | --- |
| T-001 | ✅ | Backend: `InstallmentsSnapshotService` + spec (generaliza `getActiveInstallments` para empresa) |
| T-002 | ✅ | Backend: puros `behavior-analyzer`, `projection-builder`, `personal-rules-builder` + specs |
| T-003 | ✅ | Backend: `LLMNarrativeService` com cache via `AgentInsight` + fallback determinístico + spec |
| T-004 | ✅ | Backend: `CompletePlanService` (composer), Controller, DTO, Module + specs + e2e |
| T-005 | ✅ | Backend: registrar `CompletePlanModule` no `app.module.ts` e validar Swagger |
| T-006 | ✅ | Frontend: `completePlanService` (Zod) + `useCompletePlan` + tests |
| T-007 | ✅ | Frontend: `DecisionCompletePlanSection` + sub-cards (Diagnosis, Numbers, Projection, Installments, Behavior, Rules, Outcome) com tokens DS corretos + tests |
| T-008 | ✅ | Frontend: integrar seção em `pages/decision/index.tsx` abaixo do PlaybookCard e estender invalidação do botão Atualizar |
| T-009 | ✅ | Criar `specs/004-complete-financial-plan/` (spec, plan, research, data-model, contracts, tasks) |
| T-010 | ✅ | Rodar lint/typecheck/tests no backend e no frontend; validação visual mobile + dark |

---

## Critérios de aceitação por tarefa

- **T-001** — Snapshot agrupa por `baseDescription + accountId`, descarta transações sem padrão de parcela, classifica `accountType` por tipo da conta, prioriza por share. ≥ 5 testes.
- **T-002** — Pure functions com 100% de testes para top categorias, dias de pico, projeção 30/60/90 e regras por slug.
- **T-003** — Hash de contexto determinístico, hit usa cache, miss persiste com TTL 7d, fallback ativa para JSON inválido e exceção.
- **T-004** — Service orquestra composer + engine + snapshot + analyzers + LLM, controller usa guards, DTO documentado em Swagger, e2e válida shape e 400 em formato inválido.
- **T-005** — `CompletePlanModule` listado em `app.module.ts`. Build passa. Endpoint aparece em `/swagger`.
- **T-006** — `fetchCompletePlan` parseia, envia `referencePeriod`, rejeita payload inválido (Zod). 4+ testes vitest.
- **T-007** — Componente raiz isola loading/erro/sucesso. Tokens DS corretos (sem `text-foreground`, sem `bg-muted`). Mobile-first. 5 testes.
- **T-008** — Seção integrada após `DecisionPlaybookCard`. Botão Atualizar invalida `['decision-engine']` (cobre auto + complete-plan).
- **T-009** — Pasta `specs/004-complete-financial-plan/` com `spec.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/openapi.yaml`, `contracts/complete-plan.types.ts`, `tasks.md`.
- **T-010** — `yarn lint` + `yarn typecheck` + suites de teste passam nos dois repos. Snapshot do componente em mobile (375px) e dark validados manualmente pelo time.
