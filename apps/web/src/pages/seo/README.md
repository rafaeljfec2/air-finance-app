# Páginas SEO

Este diretório contém páginas de conteúdo para SEO, organizadas em clusters temáticos.

## Estrutura de Clusters

### Páginas Pilares (3)

1. `/gestao-financeira-cpf` - Gestão Financeira CPF
2. `/integracao-bancaria-cnpj` - Integração Bancária CNPJ
3. `/inteligencia-artificial-financas` - Inteligência Artificial em Finanças

### Subpáginas por Cluster

#### Gestão Financeira CPF

- `/gestao-financeira-cpf/controle-financeiro-pessoal`
- `/gestao-financeira-cpf/organizacao-financeira-familiar`
- `/gestao-financeira-cpf/score-credito`
- `/gestao-financeira-cpf/gestao-financeira-com-ia`

#### Integração Bancária CNPJ

- `/integracao-bancaria-cnpj/integracao-bancaria-empresas`
- `/integracao-bancaria-cnpj/open-banking-cnpj`
- `/integracao-bancaria-cnpj/conciliacao-bancaria-automatica`
- `/integracao-bancaria-cnpj/integracao-erp-api-bancaria`

#### Inteligência Artificial

- `/inteligencia-artificial-financas/ia-gestao-financeira`
- `/inteligencia-artificial-financas/categorizacao-transacoes-ia`
- `/inteligencia-artificial-financas/previsao-fluxo-caixa-ia`
- `/inteligencia-artificial-financas/automacao-financeira-inteligente`

## Como Criar Novas Subpáginas

1. Criar arquivo em `src/pages/seo/{cluster}/{subpagina}/index.tsx`
2. Usar componente `SEOHead` para meta tags
3. Usar componente `InternalLink` para links internos
4. Linkar para página pilar e subpáginas relacionadas
5. Adicionar rota em `src/routes/index.tsx`
