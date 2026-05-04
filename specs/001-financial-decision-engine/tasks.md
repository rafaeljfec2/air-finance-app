# Tasks — Decision Engine (`001-financial-decision-engine`)

**Target repo:** `back-end-financeiro-nestjs`  
**Inputs:** `spec.md` v0.2, `plan.md`, `data-model.md`, `contracts/`  
**Convention:** TDD obrigatório no backend — teste falhando antes do código de produção em cada componente.

---

## Domain — núcleo determinístico

### T1 — [BE] Constantes e ordem da escada

**Descrição:** Criar `src/decision-engine/domain/constants.ts` com `RULE_ENGINE_VERSION`, lista ordenada de degraus FR-1 (pares: slug `PrimaryIssue` + ids de KPI), `KPI_LEX_ORDER` para desempate FR-2, e fatores FR-6 (inteiros fixos v1).

**Critérios de aceite:**
- Export único version semântico consumido por logs e resposta opcional.
- Ordem da escada reproduz `plan.md` §3 (inclui `high_commitment`, `low_surplus`).
- Nenhuma lógica condicional além de dados estáticos.

**Dependências:** —  
**Esforço:** S

---

### T2 — [BE] Tipos internos alinhados ao contrato

**Descrição:** Adicionar `src/decision-engine/domain/decision-engine.types.ts` (ou reexport de `contracts/`) espelhando `contracts/decision-engine.types.ts` do SDD — `DecisionEngineInput`, `DecisionEngineOutput`, `KpiSnapshot`, enums.

**Critérios de aceite:**
- TypeScript estrito, sem `any`.
- Tipos usados por todos os services do módulo.

**Dependências:** T1  
**Esforço:** S

---

### T3 — [BE] `CompletenessEvaluator` + testes unitários

**Descrição:** Implementar avaliação FR-0 conforme `data-model.md` §3 (C1–C9); retornar `{ complete: boolean; reasons: string[] }` com ids de KPI ou `data_quality`.

**Critérios de aceite:**
- Casos: renda nula ou ≤0 → incompleto; KPI obrigatório ausente → incompleto; opcionais `checking_runway_days` / `debt_service_to_income` ausentes → ainda completo.
- `*.spec.ts` cobre happy path completo + 3 falhas distintas.

**Dependências:** T2  
**Esforço:** M

---

### T4 — [BE] `PrimaryIssueResolver` + testes unitários

**Descrição:** Dado input completo e mapa de KPI→nível, retornar primeiro `primary_issue` na escada com `warn` ou `alert`; desempate FR-2 por `severityDistance` desc; empate → `KPI_LEX_ORDER`.

**Critérios de aceite:**
- `monthly_cash_flow` alert sem runway → `liquidity_risk`.
- Só `credit_utilization_index` alert → `credit_overuse`.
- Dois KPIs mesmo degrau → desempate determinístico reproduzível em teste.
- Sem KPI opcional no degrau → pula degrau (ex.: sem `debt_service_to_income` → não escolhe `debt_pressure` por esse degrau).

**Dependências:** T1, T2  
**Esforço:** M

---

### T5 — [BE] Catálogo estático de ações PT-BR

**Descrição:** Implementar `domain/catalog/action-catalog.ts` com templates da matriz `data-model.md` §4 (placeholders `{amount}`, `{pct}`, `{days}`).

**Critérios de aceite:**
- Cobrir todos os `primary_issue` exceto `healthy` compartilha entrada com catálogo dedicado de 1 micro-ação.
- Função pura que lista candidatos por slug sem I/O.

**Dependências:** T1  
**Esforço:** M

---

### T6 — [BE] `ActionGeneratorService` + testes unitários

**Descrição:** Selecionar até 3 ações por `primary_issue`, filtrar por KPIs em `warn`/`alert` conforme `reason` do template; parametrizar `impact`; garantir exatamente 1 ação para `healthy` e `data_incomplete`.

**Critérios de aceite:**
- `credit_overuse` com só linha 2 aplicável → retorna ≤3 itens válidos.
- `impact` usa valores numéricos do input quando regra definida; senão texto qualitativo permitido pela spec.
- Testes: `healthy` → length 1; `data_incomplete` → length ≥1 sem R$ inventado.

**Dependências:** T2, T5  
**Esforço:** M

---

### T7 — [BE] `StatusResolver` + testes unitários

**Descrição:** Implementar FR-13: `critical` para alert nos níveis 1–3 ou `monthly_cash_flow` alert; `attention` para warn/alert níveis 4–7 sem critical; `healthy` todos ok; FR-0 → `attention` curto-circuitado antes (contrato do caller).

**Critérios de aceite:**
- Matriz de casos coberta em unit tests (mínimo 5 cenários).

**Dependências:** T1, T2  
**Esforço:** S

---

### T8 — [BE] `DecisionEngineService` (orquestração) + testes unitários

**Descrição:** Fluxo: `CompletenessEvaluator` → se false montar output FR-0 (`primary_issue`, `status`, ações); senão `PrimaryIssueResolver` → se tema implícito “todos ok” usar `healthy` → `StatusResolver` → `ActionGeneratorService`. Injetar dependências via construtor Nest.

**Critérios de aceite:**
- **Cenários obrigatórios em teste:** `data_incomplete`; `healthy` (1 ação); fluxo negativo / liquidez → `liquidity_risk` + `critical` ou `attention` conforme níveis; **crédito alto** → `credit_overuse`.
- Mesmo input → mesma saída (determinismo).
- **Application facade omitida** se service for único entrypoint (conforme plano).

**Dependências:** T3, T4, T6, T7  
**Esforço:** M

---

## Interface HTTP — DTO e controller

### T9 — [BE] DTOs request/response + validação

**Descrição:** `dto/decision-engine-request.dto.ts` e `decision-engine-response.dto.ts` com `class-validator` / `class-transformer`; espelhar OpenAPI `contracts/openapi.yaml`; `@ApiProperty` nos campos públicos.

**Critérios de aceite:**
- `referencePeriod` formato validável (`YYYY-MM`).
- `kpis` como objeto com valores validados (level obrigatório por entrada presente).
- ValidationPipe global já existente rejeita corpo inválido com 400.

**Dependências:** T2  
**Esforço:** M

---

### T10 — [BE] `DecisionEngineController` (fino)

**Descrição:** `POST companies/:companyId/decision-engine/evaluate` — aplicar `JwtAuthGuard`, `CompanyGuard`, guards de permissão alinhados a rotas similares (`indebtedness`, `dashboard`); montar `DecisionEngineInput` com `companyId` do path + body; chamar `DecisionEngineService.evaluate`; retornar DTO resposta.

**Critérios de aceite:**
- Zero ramificações de negócio no controller.
- Swagger `@ApiTags`, `@ApiOperation`, `@ApiResponse`.
- 403 quando usuário não pertence à empresa.

**Dependências:** T8, T9  
**Esforço:** M

---

## Infraestrutura — módulo e observabilidade

### T11 — [BE] `DecisionEngineModule` + registro no `AppModule`

**Descrição:** Declarar providers (`CompletenessEvaluator`, `PrimaryIssueResolver`, `StatusResolver`, `ActionGeneratorService`, `DecisionEngineService`), controller, exports se necessário para composer futuro.

**Critérios de aceite:**
- App sobe sem erro de DI.
- Nenhuma importação circular com Dashboard (motor não importa feature pesada).

**Dependências:** T10  
**Esforço:** S

---

### T12 — [BE] Logs estruturados (Pino)

**Descrição:** No final de `DecisionEngineService.evaluate`, log `info` com `ruleEngineVersion`, `companyId`, `primary_issue`, `status`, array `{ kpiId, level }`, `data_complete`; **não** logar PII nem payload completo — opcional hash SHA-256 do JSON canonicalizado se útil para suporte.

**Critérios de aceite:**
- Campos estáveis documentados em comentário breve ou `plan.md` já cobre — nenhuma secret no log.
- Nível `debug` opcional com árvore de decisão atrás de env `DEBUG_DECISION_ENGINE=true`.

**Dependências:** T8  
**Esforço:** S

---

## Testes de integração HTTP

### T13 — [BE] Testes integração controller

**Descrição:** `decision-engine.controller.integration.spec.ts` (ou e2e em `test/`) com `@nestjs/testing` + supertest: autenticação mockada ou fixture do projeto; POST válido retorna 200 e shape do contrato.

**Critérios de aceite:**
- Pelo menos um teste end-to-end por cenário: `data_incomplete`, `healthy`, `credit_overuse` (alert).
- Validação 400 para body malformado.

**Dependências:** T11, T12  
**Esforço:** M

---

## Documentação

### T14 — [DOCS] Atualizar rotas da API

**Descrição:** Em `back-end-financeiro-nestjs/docs/API_ROUTES.md` (ou equivalente), documentar novo endpoint, auth e exemplo resumido.

**Critérios de aceite:**
- Link para prefixo global `/meu-financeiro/v1`.

**Dependências:** T10  
**Esforço:** S

---

## Follow-up (fora do MVP desta lista)

| Item | Nota |
| --- | --- |
| Composer automático | Serviço que monta `DecisionEngineInput` a partir de `Dashboard`/`Indebtedness` — tarefa separada após MVP do motor puro. |
| Persistência `DecisionAuditLog` | Opcional fase 2. |
| Frontend | Consumir endpoint na tela de decisão — `[FE]` em sprint posterior. |

---

## Ordem sugerida de execução

```
T1 → T2 → T3 → T4 → T7 → T5 → T6 → T8 → T9 → T10 → T11 → T12 → T13 → T14
```

*(T7 antes de T6 para permitir testes de status isolados; T5 pode paralelizar com T3–T4 se necessário.)*

---

## Resumo por tag

| Tag | Tasks |
| --- | --- |
| [BE] | T1–T13 |
| [DOCS] | T14 |
| [FE] | — (posterior) |
| [DEVOPS] | — (sem novos secrets/env v1) |
