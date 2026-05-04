# Research — Decision Engine v1

## 1. Alternatives considered

### A) Motor de regras externo (JSON / YAML / DMN)

- **Options:** `json-rules-engine`, Zeno engine patterns, DMN tables via Camunda.
- **Rejected for v1:** adiciona parser, versionamento de artefatos externos e superfície de teste maior; time já domina TypeScript; spec exige determinismo simples.
- **Future:** se produto exigir ajuste de copy/regras por tenant sem deploy, reavaliar serialização do catálogo.

### B) LLM para priorização ou redação de ações

- **Rejected:** spec e constitution explícitos — **sem IA no core**; risco de não-determinismo e custo.

### C) Single giant `switch` vs classes por política

- **Chosen:** classes pequenas (`CompletenessEvaluator`, `PrimaryIssueResolver`, …) + catálogo de ações em módulo dedicado — facilita TDD e mantém funções abaixo do limite de linhas do projeto.

### D) Persistir cada decisão em Mongo

- **Deferred:** NFR pede **log** observável; persistência auditável pode ser fase 2 (`DecisionAuditLog`). v1: logs estruturados são suficientes.

### E) Endpoint GET derivando KPIs internamente

- **Alternative:** um único GET que chama Dashboard + Indebtedness internamente.
- **Chosen for clarity:** **POST com body** (ou composer dedicado) para manter o motor **puro** e testável sem mockar meio Mongo no unit do resolver; agregador pode ser segunda PR.

## 2. References

- Spec interna: `specs/001-financial-decision-engine/spec.md` v0.2  
- NestJS modular patterns: `AGENTS.md` / `docs/MODULE_MAP.md` (`back-end-financeiro-nestjs`)  
- Pino structured logging: já usado na API  

## 3. Decision summary

| Topic | Decision |
| --- | --- |
| Rule storage | TypeScript constants + catalog module |
| Entry shape | Typed `DecisionEngineInput` |
| HTTP | POST + DTO validation |
| Priority FR-0 | Always first |
| Observability | Pino + `ruleEngineVersion` |
