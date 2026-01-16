# Guia de Deploy na Vercel

## Configuração do Projeto na Vercel

### 1. Importar o Projeto

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Clique em "Add New..." → "Project"
3. Selecione o repositório `air-finance-app`

### 2. Configurações do Build

Na tela de configuração do projeto, defina:

#### Framework Preset

- **Framework Preset**: `Vite`
- **Root Directory**: `apps/web` (IMPORTANTE!)

#### Build & Development Settings

**Build Command**:

```bash
cd ../.. && yarn build --filter=@air-finance/web
```

**Output Directory**:

```bash
dist
```

**Install Command**:

```bash
corepack enable && yarn install
```

> Isso habilita o Corepack para usar Yarn 4.x conforme definido em `packageManager`

**Development Command** (opcional):

```bash
yarn dev
```

### 3. Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente no painel da Vercel:

#### Produção

```
VITE_API_URL=https://sua-api.com
VITE_APP_NAME=Air Finance
VITE_APP_VERSION=1.0.0
ENABLE_EXPERIMENTAL_COREPACK=1
```

> `ENABLE_EXPERIMENTAL_COREPACK=1` garante que a Vercel use Yarn 4.x via Corepack

#### Preview (opcional)

```
VITE_API_URL=https://staging-api.com
VITE_APP_NAME=Air Finance (Staging)
ENABLE_EXPERIMENTAL_COREPACK=1
```

### 4. Configurações Avançadas (Opcional)

#### Node.js Version

- **Node Version**: `18.x` ou `20.x`

#### Ignored Build Step

Se você quiser ignorar o build em alguns commits (útil para docs):

```bash
git diff HEAD^ HEAD --quiet . ':!*.md' ':!VERCEL_DEPLOY.md'
```

## Estrutura de Arquivos para Vercel

```
air-finance-app/
├── vercel.json                 # Configuração principal da Vercel (raiz)
├── .vercelignore              # Arquivos a ignorar no deploy
├── apps/
│   └── web/
│       ├── vercel.json        # Configuração específica do web (rewrites)
│       ├── dist/              # Output directory (gerado no build)
│       └── ...
└── turbo.json                 # Turborepo usa isso automaticamente
```

## Deploy Manual via CLI

### Instalar Vercel CLI

```bash
npm i -g vercel
```

### Login

```bash
vercel login
```

### Deploy de Produção

```bash
cd air-finance-app
vercel --prod
```

### Deploy de Preview

```bash
vercel
```

## Turborepo na Vercel

A Vercel detecta automaticamente monorepos com Turborepo e:

- ✅ Usa o cache remoto do Turborepo (se configurado)
- ✅ Faz build apenas do que mudou
- ✅ Otimiza o tempo de build

### Habilitar Remote Caching (Opcional)

1. Faça login no Turborepo:

```bash
npx turbo login
```

2. Link o projeto:

```bash
npx turbo link
```

3. Isso criará um token que a Vercel usará automaticamente

## Monitoramento e Logs

### Ver Logs de Build

- Acesse o Dashboard da Vercel
- Vá em "Deployments"
- Clique no deployment específico
- Veja a aba "Building"

### Ver Logs de Runtime

- Aba "Functions" → "Logs"

## Troubleshooting

### Erro: "Could not find a production build"

**Solução**: Verifique se o `outputDirectory` está correto: `apps/web/dist`

### Erro: "Command failed with exit code 1"

**Solução**:

1. Verifique as variáveis de ambiente
2. Teste o build localmente: `yarn build --filter=@air-finance/web`
3. Verifique os logs de build na Vercel

### Build muito lento

**Solução**:

- Habilite o Remote Caching do Turborepo
- Verifique o `.vercelignore` para não enviar arquivos desnecessários

### Rotas retornam 404

**Solução**: Verifique se `apps/web/vercel.json` tem as rewrites configuradas

## Domínio Customizado

### Adicionar Domínio

1. Vá em "Settings" → "Domains"
2. Adicione seu domínio
3. Configure os DNS:
   - Tipo: `A`
   - Nome: `@`
   - Valor: `76.76.21.21`

   ou
   - Tipo: `CNAME`
   - Nome: `www`
   - Valor: `cname.vercel-dns.com`

## Preview Deployments

- Cada push em branches que não sejam `main` cria um Preview Deployment
- URLs são geradas automaticamente
- Útil para testar antes do merge

## Configurações de Performance

A Vercel automaticamente:

- ✅ Comprime assets (gzip, brotli)
- ✅ Adiciona CDN global
- ✅ Otimiza imagens
- ✅ Cache inteligente

## Limites do Plano Free

- **Build Time**: 6.000 minutos/mês
- **Bandwidth**: 100 GB/mês
- **Deployments**: Ilimitados
- **Team Members**: 1

Para aumentar, considere o plano Pro.

## Checklist Final

Antes do primeiro deploy:

- [ ] Root Directory configurado para `apps/web`
- [ ] Build command atualizado
- [ ] Output directory configurado como `dist`
- [ ] Variáveis de ambiente adicionadas
- [ ] `vercel.json` na raiz criado
- [ ] `apps/web/vercel.json` com rewrites criado
- [ ] `.vercelignore` configurado
- [ ] Teste local: `yarn build --filter=@air-finance/web`

## Links Úteis

- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Turborepo + Vercel](https://turbo.build/repo/docs/handbook/deploying-with-docker#vercel)
- [Vite Deploy Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
