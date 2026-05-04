# Feature: Plano financeiro completo (decision engine + narrativa LLM cacheada)

Adicionar à página `/decision` uma nova seção **"Seu plano completo"** que reúne diagnóstico, situação numérica, projeção 30/60/90, estratégia de parcelas, comportamento e regras personalizadas. A geração é **híbrida**: backend determinístico monta toda a estrutura com base nos dados reais (renda, parcelas, despesas por categoria, dias de pico) e a LLM responde apenas por **2 textos livres** (diagnóstico e resultado esperado), com cache forte em `AgentInsight`.

**Pré-requisitos assumidos:**

- Motor de decisão entrega `primary_issue` + `theme_phase` (specs/001 e 003).
- Composer atual mapeia métricas reais → KPIs (specs/002).
- Cards `DecisionPrimaryBlock`, `DecisionSecondaryActions`, `DecisionPlaybookCard` permanecem intactos; a nova seção é **complementar** e fica **abaixo** do `DecisionPlaybookCard`.

---

## Decisões de produto (v1) — fechadas

| Tema | Decisão |
| --- | --- |
| Geração | **Híbrida**: backend determinístico para estrutura/números; LLM (`gpt-4o-mini`) só para `diagnosis` + `expectedOutcome`. |
| Cache | `AgentInsight` com TTL 7 dias. Hash de contexto agrega `primary_issue`, `theme_phase`, período, buckets de comprometimento e top categorias. |
| Fallback | Se LLM falhar ou retornar JSON inválido, textos determinísticos por `primary_issue` são usados (a resposta nunca quebra). |
| Linguagem | **PT-BR leigo**. Sem termos como KPI, taxa, índice, rotativo. |
| Endpoint | `POST /companies/:companyId/decision-engine/complete-plan` separado de `evaluate-auto` para lazy-load no frontend e isolamento de cache. |
| UI | Componente próprio `DecisionCompletePlanSection` com seu `useQuery`. Loading e erro isolados (não bloqueiam o resto da decisão). |
| Janela parcelas | Limite de 12 meses no agrupamento de parcelas para reduzir payload. |
| Comportamento | V1 considera **apenas o mês corrente** para dias de pico. Tendência intra-mês de utilização de crédito retorna `null` (V2). |

---

## User Stories

- **US-1 — Diagnóstico claro**  
  Como usuário leigo, quero entender em 1 ou 2 parágrafos o que está acontecendo com meu dinheiro, sem jargões.

- **US-2 — Situação numérica honesta**  
  Como usuário, quero ver quanto da minha renda está comprometida hoje, qual é a meta saudável e quanto preciso reduzir por mês.

- **US-3 — Projeção dos próximos 90 dias**  
  Como usuário, quero saber como meu compromisso muda em 30, 60 e 90 dias se nada for feito, com base em parcelas que terminam.

- **US-4 — Estratégia de parcelas**  
  Como usuário, quero ver as parcelas ativas priorizadas (alta/média/baixa) com sugestão prática de por onde começar.

- **US-5 — Comportamento personalizado**  
  Como usuário, quero ver minhas top 3 categorias de gasto e os dias do mês em que mais gasto.

- **US-6 — Regras simples**  
  Como usuário, quero regras curtas que cabem na cabeça e uma "regra simples" âncora do meu problema principal.

- **US-7 — Resultado esperado**  
  Como usuário, quero saber em 1 parágrafo o que muda na minha vida se eu seguir o plano.

---

## Critérios de aceitação

1. Dado um usuário autenticado com dados completos, ao abrir `/decision`, a seção "Seu plano completo" carrega de forma independente e exibe diagnóstico, números, projeção 30/60/90, parcelas, comportamento, regras e resultado esperado.
2. Quando `primary_issue = data_incomplete`, a seção ainda renderiza com fallback textual orientando a completar o cadastro, sem quebrar.
3. Se a LLM falhar (rede, JSON inválido), `diagnosis` e `expectedOutcome` recebem fallback determinístico por `primary_issue`.
4. Em mobile (375px), a seção é totalmente legível, com todos os toques ≥ 44px e contraste correto em dark mode.
5. O botão "Atualizar" da página decision invalida tanto `evaluate-auto` quanto `complete-plan`.

---

## Não-objetivos (v1)

- Agregação histórica multi-mês de dia de pico.
- Série temporal intra-mês de uso de crédito.
- Edição de regras pelo usuário.
- Streaming da narrativa.
- Persistência de "ações completadas".

---

## Métricas (sugeridas para v2)

- Taxa de cache hit por dia.
- Latência média do endpoint (com e sem cache).
- Engajamento (scroll-into-view) das sub-seções.
