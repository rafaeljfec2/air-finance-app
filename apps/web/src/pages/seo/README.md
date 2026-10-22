# SEO pages

This directory contains SEO content pages organized into thematic clusters.

## Cluster structure

### Pillar pages (3)

1. `/gestao-financeira-cpf` — Personal finance management (CPF)
2. `/integracao-bancaria-cnpj` — Banking integration (CNPJ)
3. `/inteligencia-artificial-financas` — Artificial intelligence in finance

### Subpages by cluster

#### Personal finance management (CPF)

- `/gestao-financeira-cpf/controle-financeiro-pessoal`
- `/gestao-financeira-cpf/organizacao-financeira-familiar`
- `/gestao-financeira-cpf/score-credito`
- `/gestao-financeira-cpf/gestao-financeira-com-ia`

#### Banking integration (CNPJ)

- `/integracao-bancaria-cnpj/integracao-bancaria-empresas`
- `/integracao-bancaria-cnpj/open-banking-cnpj`
- `/integracao-bancaria-cnpj/conciliacao-bancaria-automatica`
- `/integracao-bancaria-cnpj/integracao-erp-api-bancaria`

#### Artificial intelligence

- `/inteligencia-artificial-financas/ia-gestao-financeira`
- `/inteligencia-artificial-financas/categorizacao-transacoes-ia`
- `/inteligencia-artificial-financas/previsao-fluxo-caixa-ia`
- `/inteligencia-artificial-financas/automacao-financeira-inteligente`

## How to create new subpages

1. Create a file at `src/pages/seo/{cluster}/{subpagina}/index.tsx`
2. Use the `SEOHead` component for meta tags
3. Use the `InternalLink` component for internal links
4. Link to the pillar page and related subpages
5. Add the route in `src/routes/index.tsx`
