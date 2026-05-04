# Feature: Plano de decisão em 3 fases (vermelho / amarelo / verde) por tema

Estender o motor de decisão financeira para entregar — junto com o "próximo passo" atual — um **plano educativo em três fases** (vermelho, amarelo, verde) por tema, com **regra contínua** simples e **resultado esperado** em linguagem leiga. O sistema não proíbe; ensina como continuar vivendo (parcelar, usar cartão) com regra clara.

**Pré-requisito assumido:** o motor descrito em `specs/001-financial-decision-engine/` já entrega `status`, `primary_issue` e `actions[]` parametrizados (R$ / %), e o composer descrito em `specs/002-decision-engine-composer/` monta os KPIs a partir das métricas reais do dashboard e endividamento.

---

## Decisões de produto (v1) — fechadas

| Tema | Decisão |
| --- | --- |
| Idioma | **PT-BR direto** em todas as cópias do plano (título, explicação, ações, regra, resultado). Sem i18n nesta versão. |
| Catálogo | **Híbrido**: backend só decide a fase ativa por tema (`theme_phase`); todo o conteúdo PT-BR vive no **frontend** (`apps/web/src/pages/decision/playbooks/`). |
| Coexistência | **Complementar**, não substitui: o "próximo passo" com impacto numérico (R$ / %) atual permanece intacto; o plano em 3 fases aparece **abaixo** dele. |
| Acordeão | A fase ativa abre **expandida por padrão**; usuário pode expandir as outras (acessível via teclado). |
| Persistência | **Sem persistência v1**: nenhum estado de "ações completadas" é salvo (todas neutras). |

---

## User Stories

- **US-1 — Saber em que fase estou**  
  Como usuário leigo, quero ver claramente em qual fase do tema principal estou (vermelho / amarelo / verde) para entender se preciso reagir, ajustar ou só manter.

- **US-2 — Saber o que fazer agora**  
  Como usuário em qualquer fase, quero **3 a 5 ações práticas** da fase ativa, em frases curtas e sem jargão, para começar hoje.

- **US-3 — Entender a regra contínua**  
  Como usuário que não entende finanças, quero **uma regra simples** ("nunca comprometer mais de 25% da renda com parcelas") para usar como guia no dia a dia.

- **US-4 — Visualizar o caminho completo**  
  Como usuário curioso, quero poder abrir as fases que ainda não estou para entender o caminho da recuperação até o verde, sem perder o foco da fase atual.

- **US-5 — Linguagem leiga**  
  Como usuário sem conhecimento técnico, quero textos sem termos como "KPI", "índice", "taxa de juros", "rotativo" — só palavras que faço parte do meu cotidiano.

**Critérios de aceitação (resumo)**

- Dado o motor evaluate-auto retorna `primary_issue ≠ data_incomplete`, a resposta inclui `theme_phase ∈ {red, yellow, green}` e a UI mostra o card de plano com a fase correta expandida.
- Dado `primary_issue = data_incomplete`, `theme_phase` é **null** e a UI mostra placeholder "Complete os dados primeiro" (sem fases).
- Dado `primary_issue = healthy`, `theme_phase` é sempre **green**.
- Cada um dos 9 slugs do catálogo (`liquidity_risk`, `debt_pressure`, `credit_overuse`, `high_commitment`, `low_surplus`, `low_savings`, `high_fixed_cost`, `healthy`, `data_incomplete`) tem playbook completo.
- Cada fase de cada playbook tem entre **3 e 5 ações**, todas em PT-BR e sem termos da lista proibida.
- O usuário pode expandir/recolher fases pelo teclado (`Enter` / `Space`).
- A inclusão de `theme_phase` é **backward compatible**: clientes antigos ignoram o campo.

---

## Functional Requirements

### Saída do motor (backend)

**FR-1 — Campo `theme_phase` na resposta**  
A resposta de `POST /companies/:companyId/decision-engine/evaluate` e `.../evaluate-auto` ganha um campo `theme_phase` com tipo `'red' | 'yellow' | 'green' | null`. Campo é **opcional** no contrato (clientes antigos continuam funcionando).

**FR-2 — Mapping nível → fase**  
Dado o `primary_issue` e o **KPI driver** correspondente (tabela em `data-model.md`), o nível desse KPI vira a fase:
- `alert → red`
- `warn → yellow`
- `ok → green`
- `primary_issue = healthy → green`
- `primary_issue = data_incomplete → null`

**FR-3 — Fallback de KPI driver ausente**  
Se o KPI driver definido para o `primary_issue` não estiver presente em `kpis`, o resolver usa o **pior nível** entre os KPIs do degrau correspondente em `DECISION_LADDER` (definição em `specs/001-financial-decision-engine/`). Se nenhum KPI do degrau estiver presente, retorna `green`.

**FR-4 — Determinismo**  
Para o mesmo input (slug + `KpiInputMap`), o resolver de fase produz **sempre** o mesmo resultado.

### Conteúdo do plano (frontend)

**FR-5 — Catálogo PT-BR no frontend**  
Existe um catálogo estático em `apps/web/src/pages/decision/playbooks/` com **9 entradas** (uma por slug). Cada entrada exporta um `Playbook` com a forma de `data-model.md`.

**FR-6 — Estrutura de cada Playbook**  
Cada `Playbook` tem:
- `title`: string PT-BR.
- `explanation`: 1-2 frases leigas explicando o que está acontecendo.
- `phases.red`, `phases.yellow`, `phases.green`: cada uma com `headline`, `objective` e `actions` (3-5 itens).
- `rule`: regra contínua em uma frase.
- `expectedImpact`: frase única em tom positivo descrevendo o resultado.

**FR-7 — `getPlaybook(slug)` resiliente**  
A função pública `getPlaybook(slug: string): Playbook` devolve o `Playbook` correspondente; para slug desconhecido cai em **`healthy`** como default seguro (não estoura).

### UI (componente)

**FR-8 — Componente `DecisionPlaybookCard`**  
Renderizado **abaixo** de `DecisionStatusStrip`, `DecisionPrimaryBlock` e `DecisionSecondaryActions` na rota `/decision`. Mostra:
1. `title` + Badge da fase ativa (`destructive`, âmbar custom, `success`).
2. `explanation`.
3. Acordeão com 3 sub-blocos (vermelho / amarelo / verde): a **fase ativa fica expandida**; demais recolhidas.
4. Bloco "Regra simples" com destaque (`border-l-4 border-l-primary-500`).
5. Bloco "Resultado esperado" em tom positivo.

**FR-9 — Placeholder para `data_incomplete`**  
Quando `theme_phase === null` (ou `undefined`), o card mostra apenas título, explicação e mensagem "Complete os dados para o app montar seu plano em fases." — sem acordeão.

**FR-10 — Coexistência com a UI atual**  
`DecisionStatusStrip`, `DecisionPrimaryBlock` (com impacto R$ / %) e `DecisionSecondaryActions` permanecem inalterados. O playbook complementa, não substitui.

---

## Non-Functional Requirements

**NFR-1 — Linguagem leiga**  
Os textos de todos os playbooks **não** podem conter os termos: `KPI`, `índice`, `taxa de`, `rotativo`, `severity`, `snapshot`. Validação automatizada via teste em `playbooks.test.ts`.

**NFR-2 — Determinismo**  
Mesmo input → mesmo `theme_phase`. Coberto por teste no resolver e em `decision-engine.service.spec.ts`.

**NFR-3 — Acessibilidade**  
Acordeão com `<button aria-expanded aria-controls>` + `role="region"` no painel. Foco visível (`focus-visible:ring`). Touch ≥ 44px.

**NFR-4 — Mobile-first**  
Layout começa em viewport pequena (`px-4`), enriquece em `sm:` (`px-6`). Suporte a dark mode via tokens do design system (`text-foreground`, `text-muted-foreground`, `bg-card`, `bg-muted/40`).

**NFR-5 — Sem novas dependências**  
Implementação usa só primitivos já existentes (`Card`, `Badge`, `Button`, `lucide-react`). Nenhum pacote novo é adicionado.

**NFR-6 — Backward compatibility**  
A inclusão de `theme_phase` no contrato é via campo opcional/nullable. Clientes anteriores ao deploy continuam funcionando sem alteração.

---

## Out of Scope (v1)

- Persistência do progresso do usuário no plano (checklist com estado em Mongo).
- Notificações quando o usuário avança de fase.
- Mostrar playbooks de **outros temas** além do `primary_issue` (US-1 mantém foco em um problema por vez).
- KPI dedicado a "parcelamentos ativos" (cobertura conceitual via `high_commitment` é suficiente para v1).
- Configuração remota dos textos do playbook (v1 é estático em código).
- Tradução / i18n.

---

## Open Questions

*Nenhuma pendente para v1 — decisões fechadas na seção "Decisões de produto (v1)".*

---

## Document history

| Version | Date | Author |
| --- | --- | --- |
| 0.1 | 2026-05-04 | Architect (SDD specify) |
