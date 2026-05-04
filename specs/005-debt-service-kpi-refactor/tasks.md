# Tasks — 005 Debt Service KPI Refactor

> Cada tarefa segue Red → Green → Refactor. Toda task começa por escrever spec falhando antes de tocar produção.

## Backend (`back-end-financeiro-nestjs`)

- **T-001 — Spec do `IndebtednessService.calculateMonthlyDebtService()`**
  - Cobrir: parcelas-only, parcelas + rotativo (com e sem dado de juros), cheque especial, renda zero.
  - Arquivo: `src/indebtedness/indebtedness.service.spec.ts` (novo bloco `describe`).

- **T-002 — Implementar `calculateMonthlyDebtService(companyId, referenceDate?)`**
  - Retorna `{ totalMonthlyDebtService: number, monthlyRevenue: number, percentage: number, components: { installments, revolvingCreditEstimate, overdraftEstimate } }`.
  - Estimativa rotativo: `15% * saldoVencidoFatura` quando dado de juros não disponível.
  - Reaproveitar `InstallmentsSnapshotService` para parcelas (injetar via construtor).

- **T-003 — Spec do composer com novo KPI**
  - `mapDebtServiceLevel`: novos thresholds (`>= 40` alert, `>= 25` warn).
  - `optionalDebtService`: passa a receber `MonthlyDebtServiceDto` em vez de `DebtToRevenueDto`.

- **T-004 — Atualizar composer**
  - `DecisionEngineSources.debtToRevenue` substituído por `monthlyDebtService` (interface interna).
  - `composer.composeBundle` chama `calculateMonthlyDebtService` em vez de `calculateDebtToRevenue` para o engine.
  - `DebtToRevenueDto` continua existindo no `IndebtednessService` para outras telas.

- **T-005 — Atualizar specs do `decision-engine` que mockam `debt_service_to_income`**
  - `primary-issue.resolver.spec.ts`, `theme-phase.resolver.spec.ts`, `decision-engine.service.spec.ts`, `complete-plan.service.spec.ts`.
  - Garantir que valores mockados refletem semântica de fluxo (0 a ~0.5), não estoque.

- **T-006 — Bumpar `agentVersion` do narrative**
  - Em `LLMNarrativeService` (ou onde está definido), incrementar versão para invalidar cache.
  - Spec garante que cache key muda.

- **T-007 — Smoke boot test** (lição aprendida da 004)
  - Confirmar via `nest start` real (não só `Test.createTestingModule`) que módulo sobe sem erros.

- **T-008 — Adicionar legenda no DTO Swagger**
  - `CompletePlanNumbersDto`: descrição do `committedPct` esclarecendo composição.

## Frontend (`air-finance-app/apps/web`)

- **T-009 — Legenda explicativa no `CompletePlanNumbersCard`**
  - Pequeno texto secundário abaixo do "Hoje você compromete X%" tipo "considera parcelas + juros do cartão + cheque especial".
  - Spec de snapshot/test atualizado.

## Validação final

- **T-010 — Quality gates**
  - `yarn lint` + `yarn test` + `yarn build` no backend.
  - `yarn lint` + `yarn typecheck` no monorepo web.
  - `nest start` real boota sem erro.
  - Browser E2E: meu usuário (com 11% em parcelas) sai de `Crítico` para `OK`/`Atenção` e narrativa coerente.

## Não fazer nessa fase

- Não tocar `IndebtednessController` (rota HTTP de `/debt-to-revenue` mantida intacta).
- Não criar KPI `total_debt_to_monthly_income` paralelo (decisão da spec).
- Não criar feature flag (rollout direto, decisão da spec).
- Não emitir notificação para usuários sobre a re-classificação.
