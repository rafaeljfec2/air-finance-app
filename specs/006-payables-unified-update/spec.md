# Feature: Unificação de mutações — Contas a Pagar (modal expandido)

Corrigir duplicação de lógica e falha silenciosa nas ações de **atualizar status** (Pago/Pendente) e **editar valor** na seção "Contas a Pagar" do orçamento (`PayablesSection` / modal `BudgetExpandedModal`).

**Contexto:** o usuário precisa clicar **duas vezes** para que status ou valor persistam. Causa raiz identificada: `useEditableValue` e `usePayableStatus` chamam `updateTransaction` via `mutate` (fire-and-forget) envolvido em `await Promise.resolve(...)`, que **não aguarda** a mutação. Além disso, ambos os hooks duplicam invalidação de cache, toasts e wiring de `useTransactions`.

**Pré-requisitos assumidos:**

- Endpoint existente `PATCH /companies/:companyId/transactions/:id` (via `transactionService.updateTransaction`).
- Payables de contas recorrentes mapeiam para `Transaction.reconciled`; faturas de cartão (`id` prefixo `card-`) não são toggleáveis.
- Query keys: `['budget', companyId]`, `['transactions', companyId]`.

---

## Decisões de produto (v1) — fechadas

| Tema | Decisão |
| --- | --- |
| Escopo | Apenas frontend (`apps/web`); sem mudança de contrato REST |
| UX status | Um clique alterna Pago ↔ Pendente e reflete imediatamente após sucesso |
| UX valor | Duplo-clique → editar → blur/Enter persiste em **uma** tentativa |
| Faturas de cartão | Continuam somente leitura para status (prefixo `card-`) |
| Toasts | Manter feedback distinto por ação (valor vs status), centralizando só a mutação |
| Rollout | Replace direto dos hooks duplicados; sem feature flag |

---

## User Stories

- **US-1 — Um clique, uma ação**
  Como usuário do orçamento, quero marcar uma conta como paga com um único clique, sem precisar repetir a ação.

- **US-2 — Valor persiste na primeira tentativa**
  Como usuário, quero editar o valor de uma conta a pagar e ver o total atualizado após salvar uma vez (blur ou Enter).

- **US-3 — Código sem duplicação**
  Como desenvolvedor, quero uma única função de mutação para payables, para que invalidação de cache e tratamento de erro não se repitam em dois hooks.

---

## Critérios de aceitação

1. Dado um payable recorrente pendente, ao clicar no badge "Pendente", o status muda para "Pago" **na primeira interação** e o total do grupo recalcula após refetch.
2. Dado um payable com valor editável, ao alterar o valor e pressionar Enter (ou blur), o novo valor persiste **na primeira tentativa** e o total atualiza.
3. Dado um payable com id `card-*`, o badge de status permanece não clicável.
4. `useEditableValue` e `usePayableStatus` são substituídos por um hook unificado (ou par composto com mutação compartilhada) sem duplicar invalidação/toasts/mutation wiring.
5. Testes unitários cobrem: await real da mutação, invalidação de `budget` + `transactions`, toggle de status, save de valor, id não toggleável.
6. `yarn typecheck` e `yarn lint` passam; testes Vitest do hook verdes.

---

## Fora de escopo (v1)

- Edição inline de status/valor no `PayablesCard` compacto (continua read-only).
- Backend: novos endpoints ou campos.
- Optimistic updates (pode ser follow-up).
- Edição de faturas de cartão via API de credit-cards.

---

## Quality gates

- `yarn typecheck` ✅
- `yarn lint` ✅
- Vitest: hook unificado + regressão PayablesSection (se aplicável) ✅
- Validação manual: modal "Contas a Pagar" — toggle status e editar valor com um clique/tentativa cada
