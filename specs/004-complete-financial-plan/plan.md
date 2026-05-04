# Plano de implementação — Complete Financial Plan

> Espelha o plano executado (sem o frontmatter). Mantém o histórico do que foi entregue.

## Arquitetura (híbrida)

```
UI (DecisionPage)
  └── GET evaluate-auto  → DecisionEngine
  └── GET complete-plan  → CompletePlanController
                              └── CompletePlanService (determinístico)
                                    ├── DecisionEngineComposerService → DecisionEngineService
                                    ├── InstallmentsSnapshotService
                                    ├── DashboardService (summary, expensesByCategory)
                                    ├── IndebtednessService
                                    └── LLMNarrativeService → InsightCache + LLMProvider (gpt-4o-mini)
```

- **Determinístico**: números, fases, projeção, parcelas, regras, comportamento.
- **LLM**: apenas `diagnosis` e `expectedOutcome`. Cacheado em `AgentInsight` por hash de contexto (TTL 7 dias).
- **UI**: nova seção lazy-loaded abaixo do `DecisionPlaybookCard`.

---

## Backend — `back-end-financeiro-nestjs`

### Estrutura

`src/decision-engine/complete-plan/`

```
complete-plan.module.ts
complete-plan.controller.ts (+ spec)
complete-plan.service.ts    (+ spec)
installments-snapshot.service.ts (+ spec)
llm-narrative.service.ts    (+ spec)
dto/
  complete-plan-query.dto.ts
  complete-plan-response.dto.ts
domain/
  complete-plan.types.ts
  behavior-analyzer.ts        (+ spec)
  projection-builder.ts       (+ spec)
  personal-rules-builder.ts   (+ spec)
prompts/
  complete-plan.prompt.ts
```

### Endpoint

`POST /meu-financeiro/v1/companies/:companyId/decision-engine/complete-plan?referencePeriod=YYYY-MM`

- Guards: `JwtAuthGuard` + `CompanyPermissionGuard` (`Permission.INDEBTEDNESS_READ`).
- Resposta: `CompletePlanResponseDto` com Swagger completo.

### Decisões técnicas

- **InstallmentsSnapshotService** generaliza `getActiveInstallments` (antes só por cartão) para a empresa toda. Usa `detectInstallment` (parser existente) e categoriza prioridade por `share` do total mensal.
- **BehaviorAnalyzer** puro: top 3 categorias por share + dias com gasto ≥ 1.5× a média diária do mês corrente. `creditUtilizationTrend` sempre `null` em V1.
- **ProjectionBuilder** puro: subtrai parcelas que terminam em 30/60/90 dias.
- **PersonalRulesBuilder** puro: regra-âncora por `primary_issue` + extras quando há sinais de pico de início de mês ou utilização de crédito ≥ 60%.
- **LLMNarrativeService**: cache via `InsightCacheService.findValid`. Hash combina `primary_issue`, `theme_phase`, período, buckets discretos de % comprometido e nomes das top categorias. Persiste via `AgentInsight.create` com `expiresAt = now + 7 dias`. Fallback determinístico por `primary_issue` se LLM falhar ou retornar JSON inválido.

### Integração no app

`CompletePlanModule` é importado em `app.module.ts` ao lado de `DecisionEngineModule`. Importa `DecisionEngineModule`, `DashboardModule`, `IndebtednessModule`, `PermissionModule`, `UserModule` e expõe `LLMProviderService` + `InsightCacheService` localmente (com schema `AgentInsight` registrado via `MongooseModule.forFeature`).

### Testes

- Unit (Jest): 34 testes cobrindo todos os puros, snapshot, narrative service (cache hit/miss, fallback, hash determinístico) e composer service.
- E2E (Jest + supertest): contrato e validação de DTO.
- `test/jest-e2e.json` recebeu `moduleNameMapper` para resolver alias `@/` (correção pré-existente que destravou `decision-engine-evaluate-auto.e2e-spec.ts` também).

---

## Frontend — `air-finance-app/apps/web`

### Service + hook

- `src/services/completePlanService.ts` — `fetchCompletePlan` + `CompletePlanResponseSchema` (Zod).
- `src/hooks/useCompletePlan.ts` — `useQuery` com `staleTime: 5min`, `gcTime: 30min`, `queryKey: ['decision-engine', 'complete-plan', companyId, period]`.

### Componentes

`src/pages/decision/components/complete-plan/`

```
DecisionCompletePlanSection.tsx (+ test)
CompletePlanDiagnosis.tsx
CompletePlanNumbersCard.tsx
CompletePlanProjectionCard.tsx
CompletePlanInstallmentsCard.tsx
CompletePlanBehaviorCard.tsx
CompletePlanRulesCard.tsx
CompletePlanOutcome.tsx
copy.ts
format.ts
```

- **Tokens DS** estritamente do projeto (`bg-card`, `text-text`, `border-border` + variantes `*-dark`; semânticos `red-500/amber-500/primary-500` com fallback dark `*-400` ou `*-950/30`).
- Mobile-first, `space-y-4`, `px-4 sm:px-6`, touch targets ≥ 44px.
- Estados: loading (Spinner), erro (Card + retry), `data_incomplete` cai para o mesmo render porque o backend já entrega fallback textual.

### Integração

- `pages/decision/index.tsx` renderiza `<DecisionCompletePlanSection companyId={companyId} />` após `<DecisionPlaybookCard />`.
- Botão Atualizar passa a invalidar `['decision-engine']` (prefixo único — pega `evaluate-auto` e `complete-plan`).

### Testes (Vitest)

- `completePlanService.test.ts`: parse, query param, rejeição de payload inválido, `data_incomplete`.
- `DecisionCompletePlanSection.test.tsx`: loading, erro, dados completos, parcelas vazias, sem fetch quando `companyId` vazio.

---

## Quality gates

- Backend: `yarn jest src/decision-engine/complete-plan --runInBand --testTimeout=60000` (34/34 ✓), e2e (2/2 ✓), `tsc --noEmit` limpo, `eslint --fix` limpo.
- Frontend: vitest 9/9 ✓, `tsc --noEmit` limpo, eslint limpo.

---

## Limitações V1 (declaradas)

- `creditUtilizationTrend = null` (sem série intra-mês).
- `peakDaysOfMonth` baseado **só** no mês corrente.
- LLM cacheado por 7 dias por `contextHash`. Mudanças sutis no input que não alterem `primary_issue/theme_phase/levels` reaproveitam a narrativa.
- Lista de parcelas limitada a término ≤ 12 meses.
