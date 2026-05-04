# Feature: Decision Engine — Composer automático (snapshot → `DecisionEngineInput`)

Montar o **`DecisionEngineInput`** usado pelo motor de decisão financeira a partir de **dados reais** já existentes na API (transações, contas, cartões, resumos), **sem** reimplementar a lógica determinística de priorização/ações do `DecisionEngineService`.

## User Stories

- **US-1 — Uma chamada para decidir**  
  Como integrador do produto, quero um endpoint que **avalia a decisão** a partir do contexto da empresa e do período, **sem** montar manualmente o mapa de KPIs no cliente.

- **US-2 — Fonte única de métricas**  
  Como mantenedor, quero que o composer **reutilize** serviços já responsáveis por métricas (ex.: endividamento, resumo de dashboard), para **não duplicar** cálculos de negócio já consolidados.

- **US-3 — Transparência de período**  
  Como usuário final, quero que a decisão use o **mesmo mês de referência** que a visão financeira (YYYY-MM), alinhado ao que já mostramos em dashboard.

- **US-4 — Separação de responsabilidades**  
  Como arquiteto, quero que o composer **não** aplique escada FR-1, status global nem seleção de ações — apenas **materializa** níveis/valores e completude conforme contrato do motor.

## Functional Requirements

**FR-1 — Entrada**  
O endpoint `evaluate-auto` aceita `companyId` (path) e **`referencePeriod` opcional em query** (`YYYY-MM`; omitido = mês UTC corrente). Na v1 o snapshot usa **`viewMode` fixo `cash_flow`** até existir pipeline accrual dedicado.

**FR-2 — Fontes de dados**  
Deve obter dados via **serviços existentes** (ex.: métricas de endividamento, resumo e comparação do dashboard, agregações de despesas quando necessário para um KPI), em paralelo quando independentes.

**FR-3 — Saída**  
Produzir um **`DecisionEngineInput`** compatível com o contrato compartilhado com o motor (`netIncomeMonth`, `kpis` com `level` obrigatório e `value`/`severityDistance` quando aplicável).

**FR-4 — Mapeamento KPI → nível**  
Regras de **zonas** (ok / warn / alert) para cada KPI presente no snapshot são **política do composer** (documentadas no plano), alinhadas onde possível aos status já expostos por APIs existentes; o motor **não** reinterpreta fontes brutas.

**FR-5 — KPIs opcionais**  
KPIs opcionais no motor (ex.: `checking_runway_days`, `debt_service_to_income`) podem **faltar** no snapshot se dados insuficientes; o motor já trata omissão vs incompletude.

**FR-6 — Integração HTTP**  
Expor **`POST /companies/:companyId/decision-engine/evaluate-auto`** com mesma autenticação/autorização de leitura que o `evaluate` manual, retornando o **mesmo formato de resposta** do motor.

**FR-7 — Sem decisão no composer**  
O composer **não** chama regras de `primary_issue`, `status` ou catálogo de ações fora do `DecisionEngineService`.

## Non-Functional Requirements

**NFR-1 — Performance**  
Buscar fontes em **paralelo** quando independentes; latência aceitável para UX (ordem de centenas de ms em condições normais).

**NFR-2 — Observabilidade**  
Log estruturado opcional com `companyId`, `referencePeriod`, versão de mapeamento do composer (sem PII sensível além de ids já aceitos).

**NFR-3 — Segurança**  
Respeitar **escopo da empresa** e mesmas permissões do endpoint manual; não aceitar `companyId` divergente do path.

**NFR-4 — Testabilidade**  
Mapeamento puro extraído para funções/classes testáveis com **fixtures**; testes de integração do endpoint com dependências mockadas.

## Out of Scope

- Novo motor de KPIs paralelo ao dashboard/indebtedness.
- Persistência de auditoria de decisões (fase futura).
- UI no front (sprint separada).
- Modo `accrual` com fontes diferentes do dashboard quando o produto ainda não expõe paridade — ver plano.

## Open Questions

1. **Paridade `accrual`:** quando exposto na API, definir fontes distintas do dashboard; até lá o snapshot permanece **`cash_flow` apenas** (sem parâmetro público).
2. **Pesos exatos** de zonas para KPIs derivados por heurística (ex.: `fixed_vs_variable_split` via categorias) — calibrar com produto após MVP.
