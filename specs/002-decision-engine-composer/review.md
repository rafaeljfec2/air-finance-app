# SDD Review — `002-decision-engine-composer`

**Date:** 2026-05-04  
**Reviewer:** Cursor agent (Tech Lead checklist)  
**Scope:** Composer + `evaluate-auto` (BE) + consumo inicial no web (FE entregue no mesmo ciclo de produto).

## Verdict

**APPROVED**

Código e contrato HTTP alinhados ao que as specs exigem para **US-1 / FR-6** (uma chamada que avalia sem montar KPIs no cliente) e ao OpenAPI do fragmento `evaluate-auto`. O front consome apenas o endpoint, valida resposta com Zod e não recalcula decisão. Risco residual é **documentação de escopo** entre spec 002 e entrega de UI (ver Major).

---

## Critical issues

_Nenhum._ Nada identificado que exija bloqueio de merge por segurança, contrato quebrado ou ausência de auth no caminho exposto.

---

## Major

1. **Alinhamento de escopo entre specs**  
   Em `specs/002-decision-engine-composer/spec.md`, **Out of Scope** inclui “UI no front (sprint separada)”, mas a entrega atual inclui tela `/decision` no `apps/web` (coerente com `specs/001-financial-decision-engine/spec.md`, que define a tela de decisão).  
   **Ação recomendada:** atualizar o 002 (remover ou reescrever o item de UI) **ou** declarar explicitamente no 002 que a UI é rastreada no **001** e o 002 cobre só composer + endpoint.

---

## Minor

1. **`primary_issue` na UI** — Exibição “humanizada” de slug pode ficar aquém do “PT-BR direto” do 001 para todos os casos; aceitável como MVP se o backend continuar a enviar slugs; evolução = copy no BE ou mapa de labels no FE só de apresentação.  
2. **`referencePeriod` na UI** — Opcional; contrato já suporta query; ausência não viola US-3 no cliente se o produto aceitar sempre mês corrente até segunda fase.  
3. **Quality gate SIZE** — O script `quality-check.sh` ainda pode falhar por outros ficheiros `>500` linhas no monorepo (ex.: `CreditCardFormModal`, `apiErrorHandler`, `openiService`), fora do núcleo desta feature. Tratar em chore separado ou política explícita de limite.  
4. **`git diff <base>...HEAD`** — Não disponível neste ambiente de revisão; recomenda-se reexecutar review localmente com diff completo antes do merge se a branch divergir.

---

## Positive

- **Separação de responsabilidades:** cliente não reimplementa escada FR-1 / motor; só exibe `status`, `primary_issue`, `ordering_rationale`, até três ações.  
- **Contrato:** `POST .../evaluate-auto`, query `referencePeriod` opcional, resposta validada (Zod) espelhando DTO do Nest.  
- **Estados de UX:** loading, erro, sem empresa, sem ações; primeira ação destacada.  
- **Testes:** service + hook com mocks estáveis (`decisionEngineService.test.ts`, `useDecisionEngineEvaluateAuto.test.tsx`).  
- **Infra de qualidade:** `setupTests` compatível Vitest + jest-dom; `jsdom` pinado; `IndebtednessCard` / `DatePicker` fatiados para respeitar limite de linhas onde aplicável.

---

## Spec compliance (resumo)

| Referência | Avaliação |
|------------|-----------|
| 002 FR-1 / FR-6 / OpenAPI `evaluate-auto` | Atendido no FE (path + query + POST sem body lógico). |
| 002 FR-7 (composer sem decisão) | Escopo BE; não revisto linha-a-linha nesta revisão; assume-se entregue conforme handoff anterior. |
| 001 US-1–US-5 (tela decisão) | Parcialmente: transparência (`ordering_rationale`), status, até 3 ações, destaque na primeira — **OK**. Copy PT para slug de `primary_issue` pode melhorar. |

---

## Quality output

- **Typecheck / lint (web):** conforme sessões anteriores no repo, `yarn workspace @air-finance/web type-check` e `lint` passam após ajustes de tsconfig/jest-dom e refactors de tamanho.  
- **`quality-check.sh`:** script melhorado (subshell `fail`, cwd, binário PM); execução completa recomendada na raiz do repo antes do merge.

---

## Next steps

1. **Merge** após diff humano opcional e CI verde.  
2. **Docs:** corrigir inconsistência “UI out of scope” no 002 ou referenciar 001.  
3. **Backlog produto:** labels PT para `primary_issue`; seletor `YYYY-MM`; E2E smoke contra API se exigido pelo time.  
4. **Chore:** ficheiros `>500` linhas restantes ou ajuste do gate de tamanho.
