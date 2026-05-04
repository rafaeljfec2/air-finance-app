# Feature: Refator do KPI `debt_service_to_income` (semântica de fluxo, não de estoque)

Substituir o KPI `debt_service_to_income` do decision engine, que hoje calcula **estoque de dívida ÷ renda mensal** com semântica enganosa, por um KPI que reflete **serviço mensal da dívida ÷ renda mensal**, alinhado com a copy "limite saudável 25%" exibida ao usuário e com o número que o `CompletePlanNumbersCard` já mostra.

**Contexto:** durante validação E2E da página `/decision` foi observado um usuário com `committedPct = 11%` (parcelas/renda) recebendo classificação `Crítico — Suas dívidas estão consumindo sua renda`. A causa é que `debt_service_to_income` hoje calcula `(saldos_negativos + faturas_em_aberto + payables_pendentes) / renda_mensal`, que é estoque de dívida sobre fluxo de renda — passa de 80% facilmente sem que o usuário esteja em risco real de fluxo. Isso gera mensagem incoerente com os próprios números mostrados na seção "Seu plano completo".

**Pré-requisitos assumidos:**

- Decision engine, composer e ladder de specs/001, /002 e /003.
- `InstallmentsSnapshotService` (specs/004) já provê `totalMonthly` de parcelas ativas.
- `IndebtednessService` continua expondo o ratio de estoque para outras telas (Saúde Financeira, Dashboard) — o refator é **interno ao decision engine**.

---

## Decisões de produto (v1) — fechadas

| Tema | Decisão |
| --- | --- |
| Estratégia de rollout | **Replace direto** (clean break). Sem manter os dois KPIs em paralelo. |
| Numerador do novo KPI | `Σ parcelas mensais ativas + estimativa de juros mensais do rotativo + custo mensal do cheque especial` |
| Estimativa de juros do rotativo (quando não houver dado) | **15% ao mês** sobre o saldo vencido (taxa média de mercado / referência BACEN) |
| Cheque especial (numerador) | Tratar saldo médio negativo como custo mensal proporcional. Se houver cobrança específica conhecida, usar; senão, usar o próprio saldo absoluto como custo (1 mês de uso) |
| Denominador | `monthlyRevenue` (income do dashboard summary do mês de referência) |
| Thresholds | `warn ≥ 25%` (em linha com copy do app), `alert ≥ 40%` |
| Tratamento de dados ausentes | Se renda for 0 ou desconhecida → KPI ausente (não chuta). Se rotativo desconhecido → estimar via 15% sobre saldo vencido. Se cheque especial desconhecido → ignorar. |
| KPI antigo | **Removido**. O ratio de estoque continua calculável via `IndebtednessService.calculateDebtToRevenue` para uso fora do decision engine. |
| Cache LLM | Bumpar `agentVersion` do `complete-plan-narrative` para invalidar caches antigos com classificação errada. |
| Comunicação ao usuário | Não emitir notificação de "atualizamos sua classificação" — mudança é silenciosa e tende a melhorar (não piorar) o status. |

---

## User Stories

- **US-1 — Coerência entre status e número**
  Como usuário leigo, quero que o status "Crítico" só apareça quando os números mostrados na minha tela realmente justifiquem isso, sem contradição interna.

- **US-2 — Resposta sensível a parcelas reais**
  Como usuário com dívidas controladas (parcelas em 11% da renda, sem fatura aberta), quero que o sistema reconheça que estou bem, em vez de me alarmar pelo saldo histórico das contas.

- **US-3 — Resposta sensível a serviço real da dívida**
  Como usuário com fatura grande no rotativo + parcelas + cheque especial pesando todo mês, quero que o engine entenda que meu fluxo está comprimido e me classifique em `red`/`yellow`.

---

## Critérios de aceitação

1. Dado um usuário com `parcelas mensais = R$ 2.943` e `renda = R$ 27.000`, sem rotativo nem cheque especial, o KPI `debt_service_to_income` retorna ~11% e nível `ok`. O `primary_issue` deixa de ser `debt_pressure` e o status deixa de ser `Crítico`.
2. Dado um usuário com `parcelas = R$ 1.500` + `fatura rotativa = R$ 8.000` + `renda = R$ 10.000`, o KPI retorna ~27% (parcelas + 15% × 8.000 = 1.500 + 1.200 = 2.700) e nível `warn`. `primary_issue` continua/passa a ser `debt_pressure` apropriadamente.
3. Dado um usuário com renda 0 ou ausente, o KPI retorna `undefined` (data_incomplete) e o engine reage conforme já especificado para dados incompletos.
4. Cache `AgentInsight` antigos são invalidados via bump de `agentVersion`, evitando que narrativas geradas para o KPI antigo continuem sendo retornadas.
5. Endpoint `GET /indebtedness/debt-to-revenue` continua retornando o ratio de estoque (sem regressão para outras telas).
6. Frontend não recebe nenhuma mudança obrigatória de contrato — `decision-engine-response` continua expondo `debt_service_to_income` (mesmo nome, semântica nova). O `CompletePlanNumbersCard` ganha apenas uma legenda esclarecendo "considerando parcelas + juros do rotativo + cheque especial".
7. `nest start` real sobe sem erros (boot smoke test).
8. Specs antigas que mockavam `debt_service_to_income` com valor de estoque são atualizadas para refletir semântica de fluxo.

---

## Fora de escopo (v1)

- Não criar novo KPI `total_debt_to_monthly_income` no engine (informação continua acessível via `IndebtednessService` para quem precisar).
- Não alterar a copy "Suas dívidas estão consumindo sua renda" — agora ela passa a ser correta nos casos onde aparece.
- Não revisar outros KPIs (`income_committed_pct`, `credit_utilization_index`) — escopo limitado a `debt_service_to_income`.
- Não criar UI nova para mostrar a composição do numerador (parcelas + juros + cheque).
- Não invalidar cache de `evaluate-auto` (não tem cache hoje).

---

## Quality gates

- `yarn lint` ✅
- `yarn test` ✅ (todos os specs novos e antigos verdes)
- `yarn build` ✅ (Swagger plugin OK)
- `nest start` real sobe sem erros (lição da spec/004)
- Validação E2E manual: usuário do dev passa de `Crítico` para `OK`/`Atenção` sem inconsistências entre status e números mostrados
- `connexto-integration-bank` rodando para sync de fatura (necessário para teste do cenário com rotativo)
