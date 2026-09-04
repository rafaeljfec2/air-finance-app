# Feature: Edição inline — Contas a Receber (modal expandido)

Adicionar ações de **atualizar status** (Recebido/Pendente) e **editar valor** na seção "Contas a Receber" do orçamento (`ReceivablesSection` / modal `BudgetExpandedModal`), com paridade UX em relação a Contas a Pagar (spec 006).

**Contexto:** o modal expandido de Contas a Receber é somente leitura. O usuário precisa marcar recebíveis como recebidos e ajustar valores sem sair do orçamento. Contas a Pagar já oferece esse fluxo via `usePayableActions` + `usePayableMutation`.

**Pré-requisitos assumidos:**

- Endpoint existente `PATCH /companies/:companyId/transactions/:id` (via `transactionService.updateTransaction`).
- Receivables mapeiam para transações REVENUE; `Transaction.reconciled` → UI status `RECEIVED` / `PENDING`.
- Query keys: `['budget', companyId]`, `['transactions', companyId]`.
- Reutilizar `usePayableMutation` (mesmo payload `{ value?, reconciled? }` e invalidação).

**Referência:** `specs/006-payables-unified-update/`

---

## Decisões de produto (v1) — fechadas

| Tema | Decisão |
| --- | --- |
| Escopo | Apenas frontend (`apps/web`); sem mudança de contrato REST |
| UX status | Um clique alterna Recebido ↔ Pendente e reflete após sucesso |
| UX valor | Duplo-clique → editar → blur/Enter persiste em **uma** tentativa |
| Cores status | `warning` (Pendente) / `success` (Recebido) — identidade receivables |
| Editabilidade | Todos os receivables do budget são editáveis (sem exclusão `card-*`) |
| Toasts | Feedback distinto por ação (valor vs status) |
| Mutação | Reutilizar `usePayableMutation`; novo `useReceivableActions` |
| Rollout | Direto; sem feature flag |

---

## User Stories

- **US-1 — Um clique, uma ação**
  Como usuário do orçamento, quero marcar uma conta a receber como recebida com um único clique no badge.

- **US-2 — Valor persiste na primeira tentativa**
  Como usuário, quero editar o valor de um recebível e ver o total atualizado após salvar uma vez (blur ou Enter).

- **US-3 — Paridade sem duplicar mutação**
  Como desenvolvedor, quero reutilizar a mutação unificada de payables para receivables, sem duplicar invalidação de cache.

---

## Critérios de aceitação

1. Dado um recebível pendente, ao clicar no badge "Pendente", o status muda para "Recebido" **na primeira interação** e o total do grupo recalcula após refetch.
2. Dado um recebível com valor editável, ao alterar o valor e pressionar Enter (ou blur), o novo valor persiste **na primeira tentativa** e o total atualiza.
3. Toasts distintos para status ("Marcado como recebido" / "Marcado como pendente") e valor.
4. `useReceivableActions` reutiliza `usePayableMutation` sem duplicar invalidação.
5. Testes unitários cobrem: toggle de status, save de valor, valor inválido, await da mutação.
6. Card compacto `ReceivablesCard` permanece read-only.
7. `yarn typecheck` e `yarn lint` passam; testes Vitest verdes.

---

## Fora de escopo (v1)

- Edição inline no `ReceivablesCard` compacto (continua read-only).
- Backend: novos endpoints ou campos.
- Optimistic updates.
- Página `/receivables`.
- Generalizar hooks payables/receivables em um único hook genérico.

---

## Quality gates

- `yarn typecheck`
- `yarn lint`
- Vitest: `useReceivableActions` + `ReceivablesSection` + types
- Validação manual: modal "Contas a Receber" — toggle status e editar valor
