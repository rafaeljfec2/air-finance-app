# Tasks — Decision Engine Composer (`002-decision-engine-composer`)

**Inputs:** `spec.md`, `plan.md` (v0.2), `data-model.md`, `contracts/*`  
**Primary codebase:** `back-end-financeiro-nestjs` (`src/decision-engine/`). **Consumer:** `air-finance-app/apps/web` (decision UI).

## Baseline already delivered (do not re-implement)

- `mapSourcesToDecisionInput` + `COMPOSER_MAPPING_VERSION`
- `DecisionEngineComposerService` with `composeInput` / `composeBundle`, parallel `Indebtedness` + `Dashboard` + `InstallmentsSnapshotService`
- `POST .../decision-engine/evaluate-auto` (guards + query `referencePeriod`)
- `GET .../decision-engine/installments-reconcile` + `InstallmentsReconcileService` + DTOs/Swagger
- Unit/integration tests: composer, controller `evaluate-auto`, reconcile, complete-plan wiring (verify green on branch)

Use the sections below for **closure, hardening, product alignment, and docs**.

---

## Backend [BE]

### T1 [BE] — Deterministic installment snapshot cursor

- **Descrição:** Em `InstallmentsSnapshotService`, garantir ordenação estável na leitura Mongo (ex.: `.sort({ paymentDate: 1, _id: 1 })`) e documentar em comentário mínimo ou doc interna a regra de qual transação define `monthlyValue` quando há múltiplas linhas no mesmo grupo (`baseDescription::accountId`).
- **Aceite:**
  - Teste reproduz duas transações futuras no mesmo grupo com `monthlyValue` diferentes e assert em **valor esperado fixo** após a regra escolhida.
  - `explain` ou nota em PR confirma uso de índice compatível (ex.: `companyId` + `paymentDate` + `launchType` se aplicável).
- **Dependências:** —
- **Esforço:** M

### T2 [BE] — Alinhar “start of day” snapshot vs reconcile vs Atlas

- **Descrição:** Centralizar helper de “início do dia de referência” (UTC documentado vs TZ empresa — ver `research.md`); usar o mesmo instante no filtro `paymentDate` do snapshot e nos hints `referenceStartOfDayUtc` / `suggestedMongosh` do reconcile.
- **Aceite:**
  - Teste de borda: transação no limite UTC/local não alterna inclusão sem teste cobrindo o caso.
  - `installments-reconcile` e snapshot usam o **mesmo** helper (sem duplicar `setHours` espalhado).
- **Dependências:** —
- **Esforço:** L *(se política for “só UTC”, pode cair para M — cortar escopo no PR)*

### T3 [BE] — Observabilidade do composer (agregados de parcelas)

- **Descrição:** Estender log estruturado em `composeBundle` / `loadSources` com contagens **agregadas** de parcelas (`items.length`, `totalMonthly`) sem payload bruto de transações.
- **Aceite:** Log aparece em nível `log`/`debug` conforme política do projeto; sem PII além de ids já usados.
- **Dependências:** —
- **Esforço:** S

### T4 [BE] — Documentação de rotas na API

- **Descrição:** Atualizar `back-end-financeiro-nestjs/docs/API_ROUTES.md` com `POST evaluate-auto`, `GET installments-reconcile`, e `POST complete-plan` (referência cruzada ao módulo `CompletePlanController`).
- **Aceite:** Tabela ou lista com método, path, permissão, query params.
- **Dependências:** —
- **Esforço:** S

### T5 [BE] — Cobertura de testes pós-T1/T2

- **Descrição:** Ajustar/estender `installments-snapshot.service.spec.ts` (se existir) ou testes de integração do composer para cobrir ordenação + boundary; garantir `installments-reconcile.service.spec.ts` cobre helper unificado quando T2 existir.
- **Aceite:** `yarn test` no repositório API passa; novos testes com descrições em inglês.
- **Dependências:** T1, T2 *(parcial: pode começar após T1)*
- **Esforço:** M

### T6 [BE] — Política futura `quantityInstallments` (opcional / produto)

- **Descrição:** Se produto aprovar **B** em `research.md`, estender deteção além do regex; ADR + migração de expectativas de KPI. **Não iniciar sem decisão explícita.**
- **Aceite:** ADR referenciado; testes de regressão para descrições só texto vs só campo.
- **Dependências:** decisão produto/ADR
- **Esforço:** L

---

## Frontend [FE]

### T7 [FE] — Seletor `referencePeriod` (YYYY-MM)

- **Descrição:** Na rota de decisão (`/decision` ou equivalente), expor seletor mês/ano que envia `referencePeriod` na query de `evaluate-auto` (e opcionalmente link para mesmo período no complete-plan quando existir consumo).
- **Aceite:** Estado de loading/erro preservado; query omitida = comportamento atual (mês UTC padrão da API).
- **Dependências:** —
- **Esforço:** M

### T8 [FE] — Labels PT-BR para `primary_issue`

- **Descrição:** Mapa de apresentação (FE) ou endpoint de labels (BE) — preferir FE com mapa tipado a partir do union de slugs do contrato — para não exibir slug cru ao utilizador.
- **Aceite:** Todos os `PrimaryIssueSlug` do contrato 001 têm label PT; teste de componente ou hook cobre pelo menos 3 slugs.
- **Dependências:** —
- **Esforço:** M

### T9 [FE] — Copy explicativa “parcelas vs despesas futuras” (opcional)

- **Descrição:** Tooltip ou texto curto na UI que usa dados de decisão/plano, ligando expectativa à **subcontagem** por regex (ou link para doc interno). Coordenar copy com produto.
- **Aceite:** Copy aprovada; não altera KPIs sem spec.
- **Dependências:** —
- **Esforço:** S

---

## Shared [SHARED]

### T10 [SHARED] — Corrigir escopo UI na spec 002

- **Descrição:** Editar `specs/002-decision-engine-composer/spec.md` secção **Out of Scope** / referências para alinhar com `specs/002-decision-engine-composer/review.md` e `specs/001-financial-decision-engine/spec.md` (UI em 001 ou 002 explicitamente).
- **Aceite:** Uma única fonte de verdade; sem contradição “UI sprint separada” vs entrega feita.
- **Dependências:** —
- **Esforço:** S

### T11 [SHARED] — Paridade contratos OpenAPI

- **Descrição:** Garantir que `specs/004-complete-financial-plan/contracts/openapi.yaml` referencia ou inclui `GET installments-reconcile` **ou** documentar em `004` que o fragmento canónico vive em `002/contracts/installments-reconcile.openapi.yaml` (link explícito no README da pasta specs).
- **Aceite:** Leitor de specs encontra o contrato HTTP em ≤2 cliques.
- **Dependências:** —
- **Esforço:** S

---

## DevOps [DEVOPS]

### T12 [DEVOPS] — Smoke HTTP opcional (staging)

- **Descrição:** Job ou script documentado em `DEVELOPMENT.md` / pipeline que chama `evaluate-auto` + `installments-reconcile` com token de serviço (segredos em CI vars), assert HTTP 200 + JSON mínimo.
- **Aceite:** Falha de CI acionável; não roda contra prod sem gate separado.
- **Dependências:** T4 *(paths estáveis)*
- **Esforço:** L

### T13 [DEVOPS] — Gate de ficheiros >500 linhas (chore transversal)

- **Descrição:** `review.md` Minor: tratar ficheiros >500 fora do núcleo ou ajustar `quality-check.sh` com exceções documentadas — **não bloqueia** composer por si, mas desbloqueia CI monorepo.
- **Aceite:** `quality-check.sh` verde na raiz **ou** lista de issues de refactor priorizadas.
- **Dependências:** —
- **Esforço:** L

---

## Dependency graph (summary)

```text
T1 ─┬─> T5
T2 ─┘
T4 ──> T12
T10, T11 (independentes de BE)
T7, T8, T9 (FE paralelo a T1–T6 após baseline)
```

## Suggested dispatch order

1. **T10** (spec) — desbloqueia comunicação produto.  
2. **T1** + **T4** em paralelo (BE).  
3. **T2** quando houver slot (BE, maior).  
4. **T5** após T1/T2.  
5. **T7** / **T8** (FE) em paralelo ao BE após T10.

---

## Document history

| Version | Date | Notes |
| --- | --- | --- |
| 0.1 | 2026-05-04 | Tarefas iniciais map/composer/endpoint |
| 0.2 | 2026-05-04 | Plano v0.2: composeBundle, reconcile, baseline, FE/DEVOPS/SHARED |
