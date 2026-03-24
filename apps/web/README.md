# Air Finance Web App

Aplicação web de gestão financeira pessoal desenvolvida com React, TypeScript e Vite, parte do monorepo Air Finance.

> **Nota**: Este é o workspace `@air-finance/web` do monorepo Air Finance. Para informações sobre a estrutura completa do monorepo, veja o [README principal](../../README.md).

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e dev server de alta performance
- **React Router v6** - Roteamento declarativo
- **Tailwind CSS** - Framework CSS utility-first (Mobile-First)
- **Zustand** - Biblioteca leve para gerenciamento de estado global
- **React Query** (@tanstack/react-query) - Gerenciamento de dados do servidor
- **Lucide React** - Biblioteca de ícones
- **Class Variance Authority (CVA)** - Sistema de variantes de componentes
- **@air-finance/shared** - Package compartilhado do monorepo (types, constants, utils)

## 📱 Funcionalidades

- ✅ Gestão de empresas e múltiplas empresas
- ✅ Cadastro e gestão de contas bancárias
- ✅ Gestão de cartões de crédito
- ✅ Categorização automática e manual de transações
- ✅ Dashboard financeiro com métricas em tempo real
- ✅ Relatórios e análises detalhadas
- ✅ Importação de extratos OFX
- ✅ Gestão de metas financeiras
- ✅ Contas a pagar e receber
- ✅ Classificação automática com IA
- ✅ Tema claro/escuro
- ✅ Design responsivo (Mobile-First)
- ✅ Notificações toast personalizadas
- ✅ Safe Area support (iOS/Android)

## 🚀 Como Executar (Monorepo)

### Pré-requisitos

- Node.js 22+
- Yarn 4.0.0 (instalado via Corepack)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/rafaeljfec2/air-finance-app.git
cd air-finance-app

# 2. Habilitar Corepack para usar Yarn 4
corepack enable

# 3. Instalar todas as dependências
yarn install

# 4. Iniciar o servidor de desenvolvimento
yarn dev:web
```

A aplicação estará disponível em `http://localhost:3000`

## 📦 Scripts Disponíveis

### Scripts do Monorepo (executar da raiz)

```bash
yarn dev:web           # Inicia apenas o web app
yarn dev:mobile        # Inicia apenas o mobile app
yarn build             # Build de todos os workspaces
yarn lint              # Lint de todos os workspaces
yarn typecheck         # Type check de todos os workspaces
```

### Scripts do Workspace (executar em apps/web/)

```bash
yarn dev               # Servidor de desenvolvimento
yarn build             # Build de produção
yarn preview           # Preview da build
yarn lint              # ESLint
yarn format            # Prettier
yarn test              # Vitest
yarn type-check        # Verificação de tipos
```

## 🔗 Dependências Compartilhadas

### @air-finance/shared

Package compartilhado contendo:

- **Types**: Tipos TypeScript comuns (API responses, errors, pagination)
- **Constants**: Constantes de API, storage keys, configurações
- **Utils**: Utilitários de storage, formatação e helpers

```typescript
// Exemplo de uso
import { API_CONFIG, STORAGE_KEYS } from '@air-finance/shared/constants';
import { ApiResponse, ApiError } from '@air-finance/shared/types';
import { StorageManager } from '@air-finance/shared/utils';
```

## 📚 Documentação

- **[README do Monorepo](../../README.md)** - Visão geral do monorepo
- **[Guia de Deploy](../../VERCEL_DEPLOY.md)** - Deploy na Vercel
- **[Guia de Migração](../../MIGRATION.md)** - Migração para monorepo
- **[Arquitetura Frontend](./docs/FRONTEND_ARCHITECTURE.md)** - Arquitetura completa
- **[Criando Páginas](./docs/CREATING_PAGES.md)** - Guia para novas telas
- **[Design System](./docs/DESIGN_SYSTEM.md)** - Sistema de design
- **[Mobile First](./docs/MOBILE_FIRST_GUIDE.md)** - Padrões responsivos

## 🚀 Deploy

Deploy automatizado na Vercel para branch `main`.

**Configuração**:

- Root Directory: `.` (raiz do monorepo)
- Build Command: `turbo run build --filter=@air-finance/web`
- Output: `apps/web/dist`

Veja [VERCEL_DEPLOY.md](../../VERCEL_DEPLOY.md) para detalhes.

## 👥 Autores

- **Rafael de Jesus Ferreira** - Desenvolvimento e manutenção

## 📄 Licença

MIT License - Veja [LICENSE](../../LICENSE) para detalhes
