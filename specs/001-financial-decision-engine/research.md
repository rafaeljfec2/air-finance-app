# Research — Decision Engine v1

## 1. Alternatives considered

### A) External rules engine (JSON / YAML / DMN)

- **Options:** `json-rules-engine`, Zeno engine patterns, DMN tables via Camunda.
- **Rejected for v1:** adds parser, external artifact versioning, and larger test surface; team already knows TypeScript; spec requires simple determinism.
- **Future:** if product requires per-tenant copy/rule changes without deploy, revisit catalog serialization.

### B) LLM for prioritization or action copy

- **Rejected:** spec and constitution explicit — **no AI in the core**; non-determinism and cost risk.

### C) Single giant `switch` vs policy classes

- **Chosen:** small classes (`CompletenessEvaluator`, `PrimaryIssueResolver`, …) + action catalog in a dedicated module — supports TDD and keeps functions under project line limits.

### D) Persist every decision in Mongo

- **Deferred:** NFR requires observable **log**; auditable persistence can be phase 2 (`DecisionAuditLog`). v1: structured logs are enough.

### E) GET endpoint deriving KPIs internally

- **Alternative:** a single GET that calls Dashboard + Indebtedness internally.
- **Chosen for clarity:** **POST with body** (or dedicated composer) to keep the engine **pure** and testable without mocking Mongo in resolver unit tests; aggregator can be a second PR.

## 2. References

- Internal spec: `specs/001-financial-decision-engine/spec.md` v0.2  
- NestJS modular patterns: `AGENTS.md` / `docs/MODULE_MAP.md` (`back-end-financeiro-nestjs`)  
- Pino structured logging: already used in the API  

## 3. Decision summary

| Topic | Decision |
| --- | --- |
| Rule storage | TypeScript constants + catalog module |
| Entry shape | Typed `DecisionEngineInput` |
| HTTP | POST + DTO validation |
| Priority FR-0 | Always first |
| Observability | Pino + `ruleEngineVersion` |
