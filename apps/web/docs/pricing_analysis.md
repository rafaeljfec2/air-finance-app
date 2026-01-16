# Análise Estratégica de Precificação

## Cenário Atual

O sistema permite que um único usuário gerencie:

- **N Empresas** (Multi-tenancy)
- **N Contas Bancárias** (Multi-account)
- **N Integrações Bancárias** (Open Finance/Automação)

## Fatores de Custo (Seus Custos)

Antes de definir o preço, é crucial entender onde você gasta dinheiro:

1.  **Integrações Bancárias:** Provedores de Open Finance (como Pluggy, Belvo) geralmente cobram **por conta conectada**. Se o usuário conectar 10 bancos, seu custo sobe linearmente.
2.  **Armazenamento/Processamento:** N empresas geram mais dados, mas o custo de banco de dados costuma ser marginal comparado às integrações.
3.  **Suporte:** Mais empresas e integrações geram mais chamados de suporte.

## Proposta de Lançamento (Modelo Híbrido Simplificado)

Baseado na recomendação de proteger sua margem contra os custos de API bancária, esta é a estrutura sugerida para o lançamento:

### 1. Plano Essencial (Entrada)

Ideal para MEIs, Freelancers e Pequenos Negócios que estão começando a se organizar.

- **Preço Sugerido:** **R$ 39,90 / mês**
- **Incluso:**
  - Gestão de **1 Empresa** (CNPJ).
  - Contas Manuais Ilimitadas.
  - **Sem Integração Bancária Automática** (apenas importação manual OFX/CSV).
  - Suporte por E-mail.

### 2. Plano Pro (O "Best Seller")

Focado em empresas que buscam produtividade e automação. É aqui que você quer a maioria dos clientes.

- **Preço Sugerido:** **R$ 89,90 / mês**
- **Incluso:**
  - Gestão de **1 Empresa**.
  - **2 Conexões Bancárias Automáticas** inclusas (Open Finance).
  - Conciliação Automática.
  - Suporte Prioritário (WhatsApp/Chat).

### tabela de Adicionais (Add-ons)

Como o sistema permite **N** empresas e **N** contas, o usuário monta o pacote dele somando os itens abaixo ao plano base:

| Item Adicional            | Valor Sugerido              | Lógica do Preço                                                                           |
| :------------------------ | :-------------------------- | :---------------------------------------------------------------------------------------- |
| **Empresa Extra**         | **+ R$ 29,90 / mês**        | Desconto de ~65% sobre o plano Pro. Incentiva trazer todos os negócios para a plataforma. |
| **Banco Conectado Extra** | **+ R$ 14,90 / mês**        | Cobre o custo da API (aprox. $1-2 USD dependendo do fornecedor) + margem de lucro.        |
| **Usuário Extra (Sócio)** | **R$ 9,90 / mês** ou Grátis | Cobrar por usuário costuma gerar atrito. Sugiro dar 1 ou 2 grátis no Pro.                 |

---

## Simulações de Cenários (Exemplos Reais)

#### Cenário A: O Consultor Solitário (Start)

- 1 CNPJ de consultoria.
- Faz tudo manual ou importa OFX uma vez por mês.
- **Plano:** Essencial
- **Total:** **R$ 39,90**

#### Cenário B: Pequeno Varejo (Target)

- 1 Loja.
- Conta no Itaú e Nubank (precisa de 2 conexões).
- **Plano:** Pro (já inclui 2 conexões).
- **Total:** **R$ 89,90**

#### Cenário C: O Empreendedor Serial (Power User)

- 3 Empresas (1 Principal + 2 Menores).
- 4 Contas Bancárias conectadas no total.
- **Cálculo:**
  - Plano Pro (Empresa 1 + 2 Conexões): R$ 89,90
  - - 2 Empresas Extras: 2 x R$ 29,90 = R$ 59,80
  - - 2 Bancos Extras: 2 x R$ 14,90 = R$ 29,80
- **Total:** **R$ 179,50**

## Por que esses valores?

1.  **Ancoragem:** R$ 39,90 parece barato, atraindo o usuário. R$ 89,90 é um valor padrão de mercado para software de gestão (SaaS).
2.  **Proteção de Margem:** Se o dólar subir ou o custo da API bancária aumentar, você não toma prejuízo no _Power User_, pois ele paga pelas conexões extras.
3.  **Escalabilidade:** Você não limita o usuário. Se ele quiser conectar 50 bancos, você vai adorar, pois ele vai pagar por todos eles.
