# Tasks — Decision Engine Composer (`002-decision-engine-composer`)

## T1 — [BE] Mapeamento puro + testes unitários

- **Descrição:** `map-sources-to-input.ts` + `COMPOSER_MAPPING_VERSION`; função `mapSourcesToDecisionInput(bundle)`.
- **Aceite:** cobre pelo menos 3 perfis (receita zero → incompleto; saudável simplificado; crédito crítico).
- **Dependências:** —
- **Esforço:** M

## T2 — [BE] `DecisionEngineComposerService`

- **Descrição:** Orquestra `Promise.all` em Indebtedness + Dashboard; monta `referenceDate` a partir de `YYYY-MM`.
- **Aceite:** injetável; sem lógica de decisão; log com versão composer.
- **Dependências:** T1  
- **Esforço:** M

## T3 — [BE] Módulo + endpoint `evaluate-auto`

- **Descrição:** `DecisionEngineModule` importa `DashboardModule`, `IndebtednessModule`; controller POST `evaluate-auto`; query opcional `referencePeriod`; sem body.
- **Aceite:** mesmos guards/permissão que `evaluate`; resposta idêntica ao motor.
- **Dependências:** T2  
- **Esforço:** M

## T4 — [BE] Testes Nest composer + controller

- **Descrição:** `decision-engine-composer.service.spec.ts`; estender `decision-engine.controller.spec.ts` para `evaluate-auto`.
- **Aceite:** mocks estáveis; assert em `DecisionEngineService.evaluate` recebendo input esperado.
- **Dependências:** T3  
- **Esforço:** M

## T5 — [DOCS] `API_ROUTES.md`

- **Descrição:** linha do `evaluate-auto`.
- **Dependências:** T3  
- **Esforço:** S
