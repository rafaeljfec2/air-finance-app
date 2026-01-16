# Documentação do Projeto Air Finance

Bem-vindo à documentação completa do projeto Air Finance. Esta documentação fornece guias detalhados sobre arquitetura, padrões de desenvolvimento, design system e como criar novas funcionalidades.

> **Nota**: Esta é a documentação do **monorepo Air Finance**. Para documentação específica do web app, veja [apps/web/docs/](../apps/web/docs/).

---

## 🏗️ Estrutura do Monorepo

```
air-finance-app/
├── apps/
│   ├── web/                    # Frontend web (React + Vite)
│   └── mobile-webview/         # App mobile (Expo + WebView)
├── packages/
│   └── shared/                 # Código compartilhado
│       ├── types/              # Tipos TypeScript
│       ├── constants/          # Constantes e configs
│       └── utils/              # Utilitários
├── scripts/                    # Scripts de build/deploy
├── docs/                       # Esta documentação (raiz)
├── package.json                # Root workspace
├── turbo.json                  # Configuração Turborepo
└── yarn.lock                   # Lockfile único
```

---

## 📚 Documentos Disponíveis

### 🏗️ [Arquitetura do Projeto](./ARCHITECTURE.md)

Guia completo sobre a arquitetura do frontend, incluindo:

- Estrutura de diretórios do monorepo
- Padrões de componentes
- Gerenciamento de estado
- Roteamento
- Layouts Web vs Mobile
- Package compartilhado (@air-finance/shared)

**Leia primeiro** se você é novo no projeto ou precisa entender a estrutura geral.

---

### 🎨 [Design System](./DESIGN_SYSTEM.md)

Sistema de design completo com:

- Paleta de cores
- Tipografia
- Componentes base
- Padrões de layout
- Diretrizes de acessibilidade
- Responsividade e Safe Areas

**Consulte** ao criar novos componentes ou quando precisar manter consistência visual.

---

### 🚀 [Criando Novas Telas](./CREATING_PAGES.md)

Guia passo a passo para criar novas páginas:

- Estrutura de arquivos no monorepo
- Templates base
- Exemplo completo de CRUD
- Hooks customizados
- Uso de tipos compartilhados
- Checklist final

**Use** sempre que precisar criar uma nova página ou feature.

---

### 📱 [Guia Mobile-First](./MOBILE_FIRST_GUIDE.md)

Diretrizes para desenvolvimento mobile-first:

- Breakpoints Tailwind
- Padrões responsivos
- Safe Areas (iOS/Android)
- Princípios mobile-first
- Exemplos práticos
- Checklist de responsividade

**Consulte** ao criar componentes responsivos ou ajustar layouts.

---

### 🏗️ [Arquitetura Frontend Detalhada](./FRONTEND_ARCHITECTURE.md)

Documentação técnica aprofundada:

- Hierarquia de componentes
- Fluxo de dados
- Hooks customizados
- Padrões avançados
- Best practices

**Consulte** para entendimento técnico profundo.

---

## 🎯 Início Rápido

### Para Desenvolvedores Novos

1. **Setup inicial**: [README principal](../README.md)
2. **Entenda a arquitetura**: [Arquitetura do Projeto](./ARCHITECTURE.md)
3. **Conheça o Design System**: [Design System](./DESIGN_SYSTEM.md)
4. **Crie sua primeira página**: [Criando Novas Telas](./CREATING_PAGES.md)

### Para Criar uma Nova Feature

1. **Planeje a estrutura**: [Arquitetura - Estrutura de Diretórios](./ARCHITECTURE.md#estrutura-de-diretórios)
2. **Use os templates**: [Criando Novas Telas - Template Base](./CREATING_PAGES.md#template-base)
3. **Siga o design system**: [Design System](./DESIGN_SYSTEM.md)
4. **Garanta responsividade**: [Guia Mobile-First](./MOBILE_FIRST_GUIDE.md)
5. **Use tipos compartilhados**: `@air-finance/shared`

### Para Criar um Novo Componente

1. **Escolha o tipo**: [Arquitetura - Tipos de Componentes](./ARCHITECTURE.md#tipos-de-componentes)
2. **Use componentes base**: [Design System - Componentes Base](./DESIGN_SYSTEM.md#componentes-base)
3. **Siga padrões**: [Arquitetura - Padrões de Desenvolvimento](./ARCHITECTURE.md#padrões-de-desenvolvimento)

---

## 🔍 Busca Rápida

### "Como criar uma nova página?"
→ [Criando Novas Telas](./CREATING_PAGES.md)

### "Quais componentes usar?"
→ [Design System - Componentes Base](./DESIGN_SYSTEM.md#componentes-base)

### "Como fazer responsivo?"
→ [Guia Mobile-First](./MOBILE_FIRST_GUIDE.md)

### "Onde colocar meus arquivos?"
→ [Arquitetura - Estrutura de Diretórios](./ARCHITECTURE.md#estrutura-de-diretórios)

### "Como usar código compartilhado?"
→ [Arquitetura - Package Shared](./ARCHITECTURE.md#package-shared)

### "Como gerenciar estado?"
→ [Arquitetura - Gerenciamento de Estado](./ARCHITECTURE.md#gerenciamento-de-estado)

### "Quais cores usar?"
→ [Design System - Paleta de Cores](./DESIGN_SYSTEM.md#paleta-de-cores)

### "Como fazer deploy?"
→ [Guia de Deploy](../VERCEL_DEPLOY.md)

---

## 📦 Workspaces do Monorepo

### @air-finance/web
Frontend web em React + Vite

**Documentação**: [apps/web/docs/](../apps/web/docs/)  
**README**: [apps/web/README.md](../apps/web/README.md)

### @air-finance/mobile-webview
App mobile com Expo + WebView

**README**: [apps/mobile-webview/README.md](../apps/mobile-webview/README.md)

### @air-finance/shared
Package compartilhado (types, constants, utils)

**Localização**: `packages/shared/`

---

## 📋 Checklist Geral

Ao trabalhar no projeto, certifique-se de:

- [ ] Seguir a estrutura de diretórios estabelecida
- [ ] Usar componentes base quando possível
- [ ] Importar tipos/utils de `@air-finance/shared` quando aplicável
- [ ] Implementar mobile-first
- [ ] Suportar tema escuro
- [ ] Respeitar Safe Areas (mobile)
- [ ] Garantir acessibilidade
- [ ] Tratar estados de loading/error
- [ ] Usar TypeScript corretamente
- [ ] Seguir padrões de código do projeto
- [ ] Executar `yarn typecheck` e `yarn lint` antes de commit

---

## 🛠️ Tecnologias Principais

### Monorepo
- **Yarn 4** (Berry) - Package manager
- **Turborepo** - Build system
- **Yarn Workspaces** - Gerenciamento de dependências

### Frontend Web
- **React 18** + **TypeScript**
- **Vite** - Build tool
- **React Router** - Roteamento
- **Tailwind CSS** - Estilização
- **Zustand** - Estado global
- **React Query** - Gerenciamento de dados do servidor
- **Lucide React** - Ícones

### Mobile
- **Expo** - Framework React Native
- **React Native WebView** - Renderização do web app

### Deploy
- **Vercel** - Hosting e CI/CD

---

## 📞 Suporte

Se tiver dúvidas ou precisar de ajuda:

1. Consulte a documentação relevante acima
2. Verifique exemplos existentes no código
3. Consulte os componentes base em `apps/web/src/components/ui/`
4. Veja páginas existentes em `apps/web/src/pages/` como referência
5. Consulte o package shared em `packages/shared/src/`
6. Leia o [README principal](../README.md) para comandos do monorepo

---

## 🔄 Atualizações

Esta documentação é atualizada conforme o projeto evolui.

**Última atualização**: 2026-01-16 (Migração para monorepo)

---

**Boa codificação! 🚀**
