# Feature: Motor de decisão financeira doméstica (KPI → prioridade → ações)

Transformar um conjunto já calculado de KPIs domésticos (com zonas ideal / atenção / alerta) em **uma decisão principal**, **status global** e **até três ações concretas**, para exibição em uma **tela de decisão** orientada a leigos.

**Pré-requisito assumido:** KPIs (`savings_rate`, `income_committed_pct`, `credit_utilization_index`, `monthly_cash_flow`, `surplus_capacity`, `fixed_vs_variable_split`, e extensões opcionais como `debt_service_to_income`, `checking_runway_days`) já existem como valores numéricos válidos por período, com faixas de zona definidas pelo produto. **Renda irregular:** já refletida nos **níveis dos KPIs** upstream; o motor **não** recebe flag nem trata caso especial.

---

## Decisões de produto (v1) — fechadas

| Tema | Decisão |
| --- | --- |
| Idioma | **PT-BR direto** em todos os textos voltados ao usuário (`title`, `description`, `impact`). **Sem i18n** nesta versão. |
| Pesos e faixas | **Fixos no código** na v1; evolução futura pode tornar configurável (fora do escopo v1). |
| Renda irregular | **Fora do motor**; já incorporada no cálculo/classificação dos KPIs. |
| Dados incompletos | `primary_issue` = **`data_incomplete`**; `status` = **`attention`**; retornar **pelo menos uma** ação orientando **completar dados** (sem inventar R$/%). |
| Estado saudável | **Sempre exatamente uma** micro-ação positiva (reforço de hábito); **não** retornar lista de ações vazia. |

---

## User Stories

- **US-1 — Clareza imediata**  
  Como usuário leigo, quero ver **um único problema principal** e **no máximo três passos** para não me sentir sobrecarregado, sabendo **por que** aquilo foi escolhido.

- **US-2 — Prioridade que faz sentido**  
  Como usuário em dificuldade de caixa, quero que o sistema **priorize risco de ficar sem dinheiro** (fluxo negativo, runway baixo) **antes** de mensagens sobre otimização de poupança ou uso de cartão, para eu agir na ordem certa.

- **US-3 — Ações mensuráveis**  
  Como usuário, quero cada ação com **impacto explícito em R$ ou %** (quando derivável dos dados), para comparar esforço e resultado sem jargon financeiro.

- **US-4 — Transparência**  
  Como usuário desconfiado, quero ver **quais KPIs dispararam** cada ação e o **motivo da ordenação** (`ordering_rationale` na resposta da API), para confiar na recomendação.

- **US-5 — Estado global**  
  Como usuário, quero um **status único** da situação (ex.: saudável vs precisa atenção vs crítico) alinhado à gravidade do problema principal.

**Critérios de aceitação (resumo)**

- Dado um snapshot de KPIs + zonas, o sistema retorna **status**, **primary_issue**, e **até 3** ações no formato acordado (ver FRs).
- Se **nenhum** KPI estiver em atenção ou alerta e os dados estiverem completos, o status é **saudável** e há **exatamente uma** micro-ação positiva (FR-14).
- Se o snapshot for **incompleto**, `primary_issue` = `data_incomplete`, com ação de completar dados (FR-0).
- Com **vários** KPIs fora do ideal, **uma única** `primary_issue` é escolhida pela **escada de gravidade** documentada.
- Cada ação lista **reason** como lista de identificadores de KPI que a sustentam.
- O usuário **nunca** recebe mais de **três** ações simultâneas nesta tela.

---

## Functional Requirements

### Pré-condição: dados do snapshot

**FR-0 — Dados incompletos (prioridade sobre a escada)**  
Se o snapshot for considerado **incompleto** pelas regras de qualidade acordadas com o pipeline de KPIs (campos obrigatórios ausentes ou KPIs críticos inválidos), o motor **não** aplica a escada FR-1 para diagnóstico financeiro. Deve retornar: **`primary_issue` = `data_incomplete`**, **`status` = `attention`**, e **pelo menos uma** ação em PT-BR para **completar cadastro/dados** (ex.: vincular conta, informar limite do cartão, classificar receitas). **`reason`** pode listar os KPIs afetados ou um identificador interno `data_quality` se aplicável. **Não** inventar valores em `impact` quantitativo.

### Priorização e gravidade

**FR-1 — Escada de gravidade (ordem padrão)**  
Aplica-se somente quando **FR-0** não dispara.  
O produto deve classificar problemas financeiros pela seguinte **ordem de precedência** quando múltiplas condições de risco coexistem (do mais grave ao menos):

| Ordem | Eixo | KPIs típicos que sustentam | Por quê (negócio) |
| --- | --- | --- | --- |
| 1 | Liquidez imediata | `checking_runway_days` em alerta (se existir); `monthly_cash_flow` em alerta | Sem caixa ou fluxo negativo **quebra** a capacidade de pagar obrigações; outras otimizações são secundárias. |
| 2 | Serviço da dívida | `debt_service_to_income` em alerta (se existir) | Mínimos altos **comprometem** o próximo mês de forma contratual, próximo de liquidez. |
| 3 | Pressão de crédito | `credit_utilization_index` em alerta | Alto uso aumenta mínimos e estresse de caixa **antes** de reflexos na poupança. |
| 4 | Renda já comprometida | `income_committed_pct` em alerta | Pouca folga estrutural para absorver choques; risco sistêmico doméstico. |
| 5 | Capacidade de sobra | `surplus_capacity` em alerta ou atenção | Previsibilidade da “sobra” futura; relevante após estabilizar caixa e crédito. |
| 6 | Poupança / disciplina | `savings_rate` em alerta ou atenção | Importante para metas, mas **depois** de estabilizar fluxo e pressão de crédito/comprometimento. |
| 7 | Rigidez do orçamento | `fixed_vs_variable_split` em alerta (fixo excessivo) | Ajuste estrutural de médio prazo; não deve mascarar alertas de liquidez ou crédito. |

**FR-2 — Desempate**  
Se dois KPIs na **mesma ordem** estiverem em alerta, desempatar pelo que tiver **maior distância da fronteira** da zona (maior severidade numérica dentro da faixa). Se empatar, usar ordem lexicográfica fixa dos IDs de KPI publicada pelo produto.

**FR-3 — KPIs opcionais ausentes**  
Se um KPI da escada não existir ou estiver **inválido** (ex.: renda líquida ≤ 0 para taxa de poupança), ignorar esse degrau **desde que** o snapshot ainda seja válido para decisão. Se a ausência/invalidade caracterizar **snapshot incompleto** segundo as regras do produto, aplicar **FR-0** em vez de seguir ignorando silenciosamente.

### Zonas e modelo de pontuação

**FR-4 — Níveis por KPI**  
Para cada KPI presente, o motor deve receber ou derivar um nível discreto: **ok**, **warn** (atenção), **alert**, alinhado às faixas já definidas pelo produto.

**FR-5 — Pontuação para ordenação auxiliar**  
Cada combinação (KPI, nível) contribui com um **peso inteiro** para fins de ranqueamento interno e seleção de ações:

| Nível | Peso base |
| --- | ---: |
| ok | 0 |
| warn | 3 |
| alert | 7 |

**FR-6 — Peso por KPI (severidade intrínseca)**  
Multiplicar o peso base por um **fator de KPI** **fixo na v1** (constantes no código), coerente com a escada: liquidez e fluxo **≥** crédito **≥** comprometimento **≥** sobra **≥** poupança **≥** rigidez fixa. Os valores numéricos são definidos na implementação v1 e devem **preservar a precedência da FR-1**. Configuração remota fica **fora do escopo v1**.

### Seleção do problema principal e limite de ações

**FR-7 — Problema principal (`primary_issue`)**  
Deve ser **um** identificador estável (slug) escolhido entre um catálogo fechado de “temas de decisão”, incluindo obrigatoriamente **`data_incomplete`** e **`healthy`**, e temas alinhados à escada conforme `plan.md` §3 (**slugs canônicos da API v1**): `liquidity_risk`, `debt_pressure`, `credit_overuse`, `high_commitment`, `low_surplus`, `low_savings`, `high_fixed_cost`. Nomes legados tipo `liquidity_crisis` **não** são expostos na API. O tema corresponde ao **FR-0** quando aplicável; caso contrário ao **primeiro degrau não-ok** na FR-1; se tudo ok e dados completos, **`healthy`**.

**FR-8 — Limite de ações**  
Retornar **no máximo 3** ações. **Mínimo:** **1** ação quando `primary_issue` for **`healthy`** ou **`data_incomplete`** (FR-14 e FR-0). Nos demais casos, **mínimo 0** é permitido apenas se o catálogo não produzir candidata alinhada — cenário a evitar na implementação; na prática espera-se **≥ 1** ação sempre que houver KPI fora de `ok`, exceto quando FR-0 já forçou a ação de completar dados.

**FR-9 — Coerência**  
Toda ação retornada deve estar **ligada** ao `primary_issue` ou a um KPI que pertença ao **mesmo degrau ou superior** na escada FR-1 (nunca sugerir apenas “aumentar poupança” quando liquidez está em alerta sem antes tratar caixa/crédito).

### Ações acionáveis

**FR-10 — Campos obrigatórios por ação**  
Cada ação deve incluir:

- **title**: curto, imperativo, **em PT-BR**, sem jargão.
- **description**: o que fazer em linguagem cotidiana **em PT-BR**.
- **impact**: **sempre** preenchido com magnitude quando os dados permitirem — formato textual incluindo **R$** ou **%** (ex.: “Reduz até **R$ 320/mês** nas despesas flexíveis”, “Travar novas compras no cartão até uso cair **abaixo de 40%**”). Se não for calculável, usar frase qualitativa única permitida pelo produto (“Alto impacto no caixa”) e marcar baixa confiança (ver NFR).
- **reason**: array de IDs de KPI (`monthly_cash_flow`, etc.) que **disparam** a ação.

**FR-11 — Catálogo de ações**  
O produto deve manter um **catálogo** de ações candidatas associadas a combinações (tema principal + KPIs em alerta/warn). O motor **seleciona** e **parametriza** (valores R$ / %) a partir dos dados do período — não inventar números sem base em regras declaradas.

**FR-12 — Saída para o frontend (contrato de dados)**  
A resposta deve ser serializável ao seguinte formato lógico (campos obrigatórios):

```json
{
  "status": "string",
  "primary_issue": "string",
  "ordering_rationale": "string",
  "actions": [
    {
      "title": "string",
      "description": "string",
      "impact": "string",
      "reason": ["kpi_1", "kpi_2"]
    }
  ]
}
```

Semântica esperada:

- **status**: enum com pelo menos `healthy`, `attention`, `critical` (valores estáveis; copy PT-BR só na UI se necessário, mas textos de ação já vêm em PT-BR).
- **primary_issue**: slug do tema (FR-7).
- **ordering_rationale**: texto **PT-BR** curto e **determinístico** explicando por que este `primary_issue` foi escolhido em relação à escada FR-1 e, quando aplicável, ao desempate FR-2 dentro do degrau (US-4); em **FR-0**, lista os motivos de incompletude (KPIs/`data_quality`).
- **actions**: comprimento **1–3** quando `healthy` ou `data_incomplete`; nos outros casos até **3** e preferencialmente **≥ 1** se houver problema financeiro classificado (FR-8).

**FR-13 — Status global**  
Quando **FR-0** não aplicar: `status` é **critical** se qualquer KPI na escada FR-1 estiver em **alert** até o nível 3 (liquidez, serviço da dívida, crédito) ou `monthly_cash_flow` em alerta; **attention** se houver **warn** ou alertas em níveis 4–7 sem critical; **healthy** se todos **ok**. Quando **FR-0** aplicar, **ignorar** esta regra para `status` (permanece **attention** conforme FR-0).

### Experiência e regras de negócio adicionais

**FR-14 — Modo “saudável”**  
Quando todos os KPIs estiverem **ok** e **FR-0** não aplicar, `primary_issue` = `healthy`, `status` = `healthy`, e **actions** deve conter **exatamente uma** micro-ação positiva (reforço de hábito), **em PT-BR**, nunca contradizendo KPIs ok. **Não** retornar lista vazia.

**FR-15 — Consistência temporal**  
O motor opera sobre um **snapshot** explícito (período + timestamp + visão caixa vs competência). A UI deve exibir o mesmo período usado no cálculo dos KPIs.

---

## Non-Functional Requirements

**NFR-1 — Latência**  
A decisão deve ser computável a partir de KPIs já materializados em tempo desprezível para UX interativa (ordem de milissegundos por solicitação em condições normais).

**NFR-2 — Determinismo**  
Para o mesmo conjunto de entradas (KPIs, níveis, parâmetros), o resultado deve ser **idêntico** (sem aleatoriedade).

**NFR-3 — Segurança e privacidade**  
Saídas destinam-se ao **titular do lar** autenticado e ao escopo da empresa/conta já validado pelo produto; não expor dados sensíveis além do necessário na mensagem de impacto.

**NFR-4 — Acessibilidade (conteúdo)**  
Textos curtos em **PT-BR**, linguagem simples, sem siglas não explicadas na própria tela de decisão.

**NFR-5 — Observabilidade**  
Deve ser possível registrar, para suporte e melhoria contínua, qual **versão** do catálogo de regras/ações foi aplicada e quais KPIs/níveis alimentaram a decisão (sem PII em logs públicos).

**NFR-6 — Confiança dos dados**  
Quando o snapshot for **incompleto**, aplicar **FR-0** (`primary_issue` = `data_incomplete`, `status` = `attention`, ação de completar dados, sem impacto quantitativo inventado).

---

## Out of Scope

- Internacionalização (i18n) e catálogos por locale — **v1 só PT-BR**.
- Parâmetros de peso/faixa configuráveis remotamente — **v1 código fixo**; evolução posterior permitida.
- Cálculo ou ingestão das séries brutas (transações, cartões, limites) e definição das **faixas numéricas** de cada KPI (já existentes).
- Personalização por modelo de machine learning ou perfil psicométrico.
- Execução automática de pagamentos, bloqueio físico de cartão ou integração bancária de escrita.
- Orçamento colaborativo multi-usuário com permissões granulares (além do escopo já existente do produto).
- Notificações push e cadência de lembretes.

---

## Open Questions

*Nenhuma pendente para v1 — decisões fechadas na seção “Decisões de produto (v1)”. Os **critérios exatos de snapshot incompleto (FR-0)** estão definidos em `data-model.md` §3 (regras **C1–C9**); o pipeline de KPIs/composer deve refletir essas regras ao montar o snapshot.*

---

## Document history

| Version | Date | Author |
| --- | --- | --- |
| 0.1 | 2026-05-04 | Architect (SDD specify) |
| 0.2 | 2026-05-04 | Decisões v1: PT-BR, pesos fixos, sem flag renda irregular, `data_incomplete`, micro-ação em `healthy` |
| plan | 2026-05-04 | Artefatos HOW: `plan.md`, `research.md`, `data-model.md`, `contracts/` |
| 0.3 | 2026-05-04 | FR-7 slugs canônicos; FR-12 `ordering_rationale` (US-4); Open Questions → C1–C9 em `data-model.md` |
