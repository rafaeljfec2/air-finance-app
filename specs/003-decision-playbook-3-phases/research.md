# Research — Decision playbook 3 phases

> Decisões fechadas para `spec.md` v0.1. Foco: arquitetura do catálogo e relação com o `actions[]` numérico atual.

---

## 1. Decisão A — Onde fica o catálogo do plano (3 fases + regra + impacto)

**Escolhido:** **híbrido** (backend resolve fase, frontend tem copy).

### Alternativas avaliadas

#### A1) Backend completo
Backend dono do catálogo PT-BR (estende `action-catalog.ts` com playbook por slug); composer/serviço resolve fase + devolve playbook completo no contrato.

- **Prós:** contrato fechado e versionado por `ruleEngineVersion`; single source of truth caso surjam novos canais (mobile nativo, parceiros).
- **Contras:** qualquer iteração de copy exige deploy de backend; copy fina mistura com lógica numérica; aumenta superfície do contrato.

#### A2) Frontend completo (escolha pela arquitetura ao redor)
Backend continua sem mudanças; frontend tem catálogo PT-BR e infere a fase localmente a partir dos `kpis` disponíveis.

- **Prós:** zero cirurgia no backend.
- **Contras:** lógica de classificação de fase **vaza** para o frontend (já existe `KpiSnapshot.level` no contrato, mas não é exposto na resposta atual); duplicaria regra de FR-1/FR-3; viola "single source of truth" para decisão.

#### A3) Híbrido (escolhido)
Backend devolve apenas `theme_phase: 'red' | 'yellow' | 'green' | null`. Frontend tem catálogo PT-BR (`apps/web/src/pages/decision/playbooks/`).

- **Prós:**
  - Lógica numérica continua **dentro** do motor (preserva FR-2 e a `DECISION_LADDER`).
  - Iteração rápida de copy sem deploy de backend.
  - Mantém precedente do projeto: `primaryIssueLabels.ts`, `kpiPlainLabels.ts`, `humanizeImpactForDisplay.ts` já são copy local.
  - Contrato cresce com **um** campo opcional/nullable — backward compatible.
- **Contras:** se outro canal usar a mesma API um dia, vai precisar do próprio catálogo (aceitável: provavelmente não acontece em v1).

### Critério decisivo
Velocidade de iteração de copy + precedente do projeto + custo mínimo no contrato. Híbrido ganha em todos os três.

---

## 2. Decisão B — Substituir vs complementar o `actions[]` numérico atual

**Escolhido:** **complementar**.

### Alternativas avaliadas

#### B1) Substituir
Trocar `actions[]` (até 3 ações com impacto R$ / %) pelo plano em 3 fases (3-5 ações estáticas por fase).

- **Prós:** UI mais simples; conteúdo 100% guiado.
- **Contras:** **perde** o gancho do impacto numérico ("Você pode economizar cerca de R$ 2.731,00/mês") que é o que faz o usuário agir hoje; quebra contrato existente.

#### B2) Coexistir em abas
Tab "Próximo passo" (UI atual) + tab "Plano completo" (3 fases).

- **Prós:** usuário escolhe profundidade.
- **Contras:** fragmenta a tela; mais carga cognitiva; navegação extra para o que importa.

#### B3) Complementar (escolhido)
Mantém `DecisionStatusStrip` + `DecisionPrimaryBlock` (impacto R$ / %) + `DecisionSecondaryActions` exatamente como estão. Adiciona `DecisionPlaybookCard` **abaixo**, com a fase ativa expandida.

- **Prós:**
  - Preserva o gancho numérico que já funciona.
  - Adiciona profundidade educativa **sem** quebrar a hierarquia da tela.
  - Quem está em `red` vê ação imediata + plano de saída; quem está em `green` vê reforço de hábito.
  - Zero quebra de contrato (campo novo é opcional).
- **Contras:** tela fica mais longa (tradeoff aceitável para uma rota de 3-5 cards).

### Critério decisivo
Não perder a evidência numérica que move o usuário hoje + preservar US-1 do `001` (foco em um problema por vez).

---

## 3. Notas técnicas relevantes

- **Fallback de KPI driver ausente** (FR-3 desta spec): herdamos a `DECISION_LADDER` do `001-financial-decision-engine/`. Se o KPI driver de `liquidity_risk` (`monthly_cash_flow`) não estiver presente, o resolver olha os outros KPIs do mesmo degrau (`checking_runway_days`) e usa o pior nível encontrado. Isso garante coerência com a escada FR-1.
- **Acordeão sem dependência nova**: o DS atual não exporta um componente `Accordion` (só `Card`, `Badge`, `Button`). Implementação usa `<button aria-expanded aria-controls>` + `role="region"` em React (sem libs novas — atende NFR-5).
- **Termos proibidos no copy**: validados via teste em `playbooks.test.ts`. Lista atual: `KPI`, `índice`, `taxa de`, `rotativo`, `severity`, `snapshot`. Pode ser estendida sem mudança de código de produção.
- **`MongoMemoryServer` global em `src/test/setup.ts`** (backend): testes puros do `decision-engine` rodam corretamente em `--runInBand`; em paralelo competem por instâncias e estouram timeout. Documentado para QA.
