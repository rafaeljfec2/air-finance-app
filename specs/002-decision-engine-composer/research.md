# Research — Decision Engine Composer

## Alternativas para fonte de KPIs

| Abordagem | Prós | Contras |
| --- | --- | --- |
| **A — Reutilizar `IndebtednessService` + `DashboardService`** | Dados já consolidados; menos duplicação de agregações Mongo | Nem todo KPI do motor tem homônimo 1:1; exige camada de mapeamento documentada |
| **B — Nova agregação Mongo só no composer** | Controle fino | Duplica lógica de dashboard/indebtedness; maior risco de drift |
| **C — Event sourcing / snapshot persistido** | Histórico rico | Fora do escopo v1 |

**Decisão:** **A** para v1.

## Referências internas

- `src/indebtedness/indebtedness.service.ts` — `getIndebtednessMetrics`
- `src/dashboard/dashboard.service.ts` — `getSummary`, `getComparison`, `getExpensesByCategory`
- `specs/001-financial-decision-engine/data-model.md` — C1–C9 completude
- Motor: `src/decision-engine/domain/decision-engine.types.ts` — `DecisionEngineInput`

## Links úteis

- NestJS custom providers e testes: https://docs.nestjs.com/fundamentals/custom-providers
