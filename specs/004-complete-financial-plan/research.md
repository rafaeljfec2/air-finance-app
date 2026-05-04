# Research — Complete Financial Plan

## Por que híbrido (não 100% LLM, não 100% determinístico)?

| Eixo | 100% determinístico | 100% LLM | **Híbrido (escolhido)** |
| --- | --- | --- | --- |
| Confiabilidade dos números | Alta | Risco de alucinação numérica | Alta — LLM nunca toca números |
| Latência | < 1s | 2-5s | ~1s (cache hit ~150ms) |
| Custo | R$ 0 | R$ por request | R$ apenas em cache miss (TTL 7d) |
| Tom humano / acolhedor | Limitado | Excelente | Bom — LLM nos 2 textos livres |
| Manutenção da copy | Engenheiros editam código | Modelo "explica" | Engenheiros editam apenas fallback determinístico |

A LLM responde apenas por `diagnosis` e `expectedOutcome` (texto livre). Tudo que tem número, prioridade, lista ou regra é determinístico.

---

## Cache — por que `AgentInsight` e não Redis?

- Já existe schema, TTL via Mongo `expireAfterSeconds`, métricas e índice consistentes.
- Mesma infra do `CreditCardInsightAgent`.
- Sem nova dependência; sem servidor extra.

`contextHash` agrega:

- `agentVersion` (invalida automaticamente em release).
- `primary_issue`, `theme_phase`, `referencePeriod`.
- Buckets discretos (`step=0.05`) de `committedPct`, `proj30Pct`, `proj90Pct`.
- Bucket de `reductionNeeded` (step=R$ 100).
- Nomes das top categorias e lista de `peakDays`.

→ Variações pequenas no input não geram nova chamada à LLM, mantendo a narrativa estável.

---

## Lacunas de dados conhecidas

| Dado | Estado V1 | Plano V2 |
| --- | --- | --- |
| Histórico multi-mês de dia de pico | Ausente — usamos só o mês corrente | Agregação 3 meses + percentil |
| Tendência intra-mês de utilização do limite | Ausente — `creditUtilizationTrend = null` | Série diária do consumo do cartão |
| Score de prioridade da parcela | Heurístico (share do total) | Considerar custo total restante e juro implícito |
| Sugestão para `installmentsStrategy` | Estática por `primary_issue` | Pode virar texto LLM curto se ROI for claro |

---

## Por que endpoint separado e não estender `evaluate-auto`?

- Lazy-load no frontend → primeira renderização do `DecisionPage` continua igualmente rápida.
- Cache da narrativa LLM totalmente isolado.
- `evaluate-auto` permanece um endpoint puro/síncrono e barato.
- Mais fácil de evoluir contratos sem quebrar consumidores existentes.

---

## Risco e mitigação

| Risco | Mitigação |
| --- | --- |
| LLM gera JSON inválido | `parseLLMContent` falha-soft, dispara fallback determinístico. |
| LLM indisponível / sem chave | `try/catch` no service, fallback. |
| Custo descontrolado | Rate limit existente (10/dia/empresa) + cache 7 dias por contextHash. |
| Texto da LLM desalinhado da realidade | Prompt restrito; números proibidos no texto. |
| Payload pesado | Parcelas limitadas a término ≤ 12 meses. |
