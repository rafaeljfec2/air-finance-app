# Guia de Migração para Monorepo

Este documento descreve o processo de migração do projeto `air-finance-app` para a estrutura de monorepo `air-finance-monorepo`.

## O que foi feito

### 1. Estrutura do Monorepo

Criamos a seguinte estrutura:

```
air-finance-monorepo/
├── apps/
│   ├── web/                    # Frontend React + Vite (código original)
│   └── mobile-webview/         # Novo app mobile Expo + WebView
├── packages/
│   └── shared/                 # Novo package compartilhado
│       ├── types/              # Tipos TypeScript
│       ├── constants/          # Constantes e configs
│       └── utils/              # Utilitários
├── package.json                # Root package.json
├── turbo.json                  # Configuração Turborepo
└── .yarnrc.yml                 # Configuração Yarn 4
```

### 2. Apps Criados

#### @air-finance/web
- Todo o código do `air-finance-app` foi movido para `apps/web`
- Nome do package alterado de `air-finance-app` para `@air-finance/web`
- Adicionada dependência `@air-finance/shared`
- TypeScript configurado para reconhecer o shared package
- Todas as funcionalidades mantidas

#### @air-finance/mobile-webview
- Novo app mobile criado do zero
- Usa Expo SDK 52
- Carrega o app web via WebView
- Implementa hooks para gerenciar autenticação
- Pronto para desenvolvimento iOS e Android

### 3. Package Compartilhado

#### @air-finance/shared
- Tipos comuns (API responses, errors, pagination)
- Constantes de API (URLs, endpoints, timeouts)
- Constantes de storage (chaves para localStorage/SecureStore)
- Utilitários de storage (StorageManager com adapter pattern)

### 4. Ferramentas Configuradas

- **Yarn Workspaces**: Gerenciamento de dependências
- **Turborepo**: Builds e tasks em paralelo com cache
- **TypeScript**: Paths configurados para imports cruzados
- **ESLint**: Configurado em todos os workspaces

## Mudanças de Scripts

### Antes (projeto único)

```bash
yarn dev        # Rodava apenas o web
yarn build      # Build apenas do web
yarn lint       # Lint apenas do web
```

### Agora (monorepo)

```bash
yarn dev           # Roda TODOS os apps em dev
yarn dev:web       # Roda apenas o web
yarn dev:mobile    # Roda apenas o mobile

yarn build         # Build de TODOS os apps
yarn lint          # Lint de TODOS os apps
yarn typecheck     # Type check de TODOS os apps
```

## Como Usar o Novo Monorepo

### Desenvolvimento Web

```bash
cd air-finance-monorepo
yarn dev:web
```

O app estará disponível em `http://localhost:3000` (ou a porta configurada no .env)

### Desenvolvimento Mobile

```bash
cd air-finance-monorepo
yarn dev:mobile
```

Escaneie o QR code com:
- **iOS**: App Camera
- **Android**: App Expo Go

### Adicionar Dependências

```bash
# Web
yarn workspace @air-finance/web add axios

# Mobile
yarn workspace @air-finance/mobile-webview add expo-camera

# Shared
yarn workspace @air-finance/shared add date-fns

# Root (dev dependencies apenas)
yarn add -W -D prettier
```

### Rodar Comando em Workspace Específico

```bash
yarn workspace @air-finance/web lint
yarn workspace @air-finance/mobile-webview type-check
```

## Diferenças Importantes

### 1. Package Manager

- **Antes**: Yarn 1.x
- **Agora**: Yarn 4.x (Berry)
  - Instalação via Corepack
  - Zero-installs opcional
  - Plug'n'Play mode disponível

### 2. Node Modules

- Cada workspace tem seu próprio `node_modules`
- Dependências comuns são hoisted para a raiz quando possível
- O `yarn.lock` é único e está na raiz

### 3. TypeScript

- Cada workspace tem seu `tsconfig.json`
- Há um `tsconfig.json` na raiz com paths globais
- Workspaces podem importar uns aos outros via paths

### 4. Builds

- Turborepo gerencia a ordem de builds
- Resultados são cacheados
- Builds paralelos quando possível

## Estrutura de Arquivos .env

### apps/web/.env

```env
VITE_API_URL=http://localhost:3011
VITE_APP_NAME=Air Finance
# ... outras variáveis
```

### apps/mobile-webview/.env (opcional)

```env
EXPO_PUBLIC_API_URL=http://localhost:3011
EXPO_PUBLIC_WEB_URL=http://localhost:3000
```

## Troubleshooting

### Erro: "Package not found in lockfile"

```bash
rm -f yarn.lock apps/*/yarn.lock packages/*/yarn.lock
yarn install
```

### Erro: "Cannot find module @air-finance/shared"

```bash
yarn install
yarn workspace @air-finance/shared type-check
```

### Porta em uso

O web app usa a porta definida em `.env` (VITE_PORT) ou padrão do Vite.
Se houver conflito, altere a porta no `.env`:

```env
VITE_PORT=5173
```

### Mobile não conecta ao backend

Certifique-se de:
1. O backend está rodando
2. O web app está rodando
3. Use o IP da máquina, não `localhost` (o Expo exibe no QR code)

Atualize `WEBSITE_URL` em `apps/mobile-webview/src/constants/webview.ts`:

```typescript
export const WEBSITE_URL = __DEV__
  ? 'http://192.168.X.X:3000'  // Seu IP local
  : 'https://app.airfinance.com.br';
```

## Backup

Um backup completo do projeto original foi criado em:
```
/home/rafael/dev-rafael/air-finance-app-backup-YYYYMMDD-HHMMSS
```

## Próximos Passos

1. ✅ Estrutura base do monorepo
2. ✅ Apps web e mobile funcionando
3. ✅ Package shared criado
4. ⏳ Migrar código comum para o shared
5. ⏳ Configurar CI/CD para monorepo
6. ⏳ Criar assets do mobile (ícones, splash)
7. ⏳ Implementar deep linking
8. ⏳ Configurar EAS Build para produção

## Suporte

Para dúvidas sobre a migração, consulte:

- [README.md](README.md) - Documentação geral
- [apps/web/README.md](apps/web/README.md) - Docs do web app
- [apps/mobile-webview/README.md](apps/mobile-webview/README.md) - Docs do mobile app
- [Turborepo Docs](https://turbo.build/)
- [Yarn Workspaces](https://yarnpkg.com/features/workspaces)
- [Expo Docs](https://docs.expo.dev/)
