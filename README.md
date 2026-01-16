# Air Finance Monorepo

Monorepo do sistema Air Finance, contendo o app web e o app mobile.

## Estrutura do Projeto

```
air-finance-monorepo/
├── apps/
│   ├── web/                    # Frontend React + Vite
│   └── mobile-webview/         # App mobile Expo + WebView
├── packages/
│   └── shared/                 # Código compartilhado
│       ├── types/              # Tipos TypeScript
│       ├── constants/          # Constantes e configs
│       └── utils/              # Utilitários
├── package.json                # Root package.json
├── turbo.json                  # Configuração Turborepo
└── .yarnrc.yml                 # Configuração Yarn
```

## Tecnologias

- **Monorepo**: Yarn Workspaces + Turborepo
- **Web**: React 18, TypeScript, Vite, TailwindCSS
- **Mobile**: Expo, React Native, WebView
- **Compartilhado**: TypeScript, constantes, utils

## Pré-requisitos

- Node.js >= 18.0.0
- Yarn >= 4.0.0

## Instalação

```bash
# Instalar Yarn 4 (se necessário)
corepack enable
corepack prepare yarn@4.0.0 --activate

# Instalar todas as dependências
yarn install
```

## Scripts Disponíveis

### Desenvolvimento

```bash
# Rodar todos os apps em dev
yarn dev

# Rodar apenas o web
yarn dev:web

# Rodar apenas o mobile
yarn dev:mobile
```

### Build

```bash
# Build de todos os projetos
yarn build
```

### Linting e Type Check

```bash
# Lint de todos os projetos
yarn lint

# Fix automático de lint
yarn lint:fix

# Type check de todos os projetos
yarn typecheck
```

### Limpeza

```bash
# Limpar node_modules e cache
yarn clean
```

## Workspaces

### @air-finance/web

Frontend web desenvolvido com React, TypeScript e Vite.

**Principais funcionalidades:**

- Gestão financeira completa
- Orçamentos e metas
- Cartões de crédito
- Relatórios e dashboards
- Multi-empresa

**Scripts:**

```bash
yarn workspace @air-finance/web dev
yarn workspace @air-finance/web build
yarn workspace @air-finance/web lint
```

**Documentação:** [apps/web/README.md](apps/web/README.md)

### @air-finance/mobile-webview

App mobile nativo usando Expo e WebView para carregar o app web.

**Principais funcionalidades:**

- Carrega o app web via WebView
- Armazena tokens de autenticação
- Suporte iOS e Android
- Push notifications (futuro)

**Scripts:**

```bash
yarn workspace @air-finance/mobile-webview start
yarn workspace @air-finance/mobile-webview android
yarn workspace @air-finance/mobile-webview ios
```

**Documentação:** [apps/mobile-webview/README.md](apps/mobile-webview/README.md)

### @air-finance/shared

Package compartilhado entre web e mobile.

**Conteúdo:**

- Tipos TypeScript comuns
- Constantes de API e storage
- Utilitários de storage e formatação

## Adicionar Dependências

```bash
# Adicionar dependência ao workspace específico
yarn workspace @air-finance/web add <package>
yarn workspace @air-finance/mobile-webview add <package>
yarn workspace @air-finance/shared add <package>

# Adicionar dependência dev ao workspace específico
yarn workspace @air-finance/web add -D <package>

# Adicionar dependência na raiz
yarn add -W <package>
```

## Desenvolvimento Local

### Web App

1. Configure o arquivo `.env` em `apps/web/`
2. Execute `yarn dev:web`
3. Acesse `http://localhost:5173`

### Mobile App

1. Certifique-se de que o web app está rodando
2. Execute `yarn dev:mobile`
3. Escaneie o QR code com o Expo Go

## Turborepo

O projeto usa Turborepo para:

- Paralelizar tarefas de build, lint e test
- Cachear resultados para builds mais rápidos
- Gerenciar dependências entre workspaces

### Configuração

A configuração está em `turbo.json`. As principais tarefas são:

- `dev`: Modo desenvolvimento (persistent, sem cache)
- `build`: Build de produção (com cache)
- `lint`: Linting (com dependências)
- `type-check`: Verificação de tipos

## CI/CD

O projeto está preparado para CI/CD com GitHub Actions:

- Build automático em PRs
- Deploy automático em merge para main
- Verificação de types e lint

## Estrutura de Branches

- `main` - Produção
- `develop` - Desenvolvimento
- `feature/*` - Features
- `fix/*` - Correções

## Versionamento

O projeto segue [Semantic Versioning](https://semver.org/):

- `MAJOR.MINOR.PATCH`
- MAJOR: Breaking changes
- MINOR: Novas features
- PATCH: Bug fixes

## Contribuindo

1. Crie uma branch a partir de `develop`
2. Faça suas alterações
3. Execute `yarn lint:fix` e `yarn typecheck`
4. Abra um PR para `develop`

## Licença

Proprietary - Todos os direitos reservados

## Suporte

Para suporte, entre em contato com a equipe de desenvolvimento.
