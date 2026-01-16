# Air Finance App

Aplicação web de gestão financeira pessoal desenvolvida com React, TypeScript e Vite.

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

## 🛠️ Estrutura do Projeto

```
src/
├── assets/              # Imagens, fontes, arquivos estáticos
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base da UI (Button, Input, Card, etc.)
│   ├── layout/         # Componentes de layout (Header, Sidebar)
│   └── [feature]/      # Componentes específicos de features
├── contexts/           # React Contexts
├── features/           # Features organizadas por domínio
├── hooks/              # Custom hooks reutilizáveis
├── layouts/            # Layouts principais (ViewDefault, LayoutAuth)
├── lib/                # Utilitários e helpers
├── pages/              # Páginas/rotas da aplicação
├── routes/             # Configuração de rotas
├── services/           # Serviços de API e integrações
├── stores/             # Zustand stores
├── types/              # TypeScript types e interfaces
└── utils/              # Funções utilitárias
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- Yarn ou npm

### Instalação

1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/air-finance-app.git
cd air-finance-app
```

2. Instale as dependências

```bash
yarn install
```

3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Air Finance
```

4. Inicie o servidor de desenvolvimento

```bash
yarn dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📦 Scripts Disponíveis

- `yarn dev` - Inicia o servidor de desenvolvimento (Vite)
- `yarn build` - Gera a build de produção
- `yarn build:prod` - Build para produção
- `yarn build:dev` - Build para desenvolvimento
- `yarn preview` - Preview da build de produção
- `yarn lint` - Executa o linter (ESLint)
- `yarn format` - Formata o código (Prettier)
- `yarn test` - Executa os testes (Vitest)
- `yarn test:coverage` - Executa testes com cobertura

## 🎨 Design System

O projeto utiliza um sistema de design consistente com:

- **Paleta de cores**: Verde primário (#2D6B4E) com variações
- **Tipografia**: Escala responsiva mobile-first
- **Espaçamento**: Sistema baseado em múltiplos de 4px
- **Componentes**: Biblioteca de componentes reutilizáveis
- **Tema**: Suporte completo a modo claro e escuro

Para mais detalhes, consulte a [documentação do Design System](./docs/DESIGN_SYSTEM.md).

## 📚 Documentação

A documentação completa do projeto está disponível na pasta `docs/`:

- **[Arquitetura Frontend](./docs/FRONTEND_ARCHITECTURE.md)** - Arquitetura completa, componentes base e guias
- **[Criando Páginas](./docs/CREATING_PAGES.md)** - Guia para criar novas telas
- **[Design System](./docs/DESIGN_SYSTEM.md)** - Sistema de design e componentes
- **[Guia Mobile-First](./docs/MOBILE_FIRST_GUIDE.md)** - Padrões responsivos
- **[Arquitetura](./docs/ARCHITECTURE.md)** - Visão geral da arquitetura

## 📝 Convenções

### Código

- **Idioma**: Todo código deve ser escrito em inglês
- **UI**: Mensagens e textos de interface em português brasileiro
- **Componentes**: PascalCase (`UserCard.tsx`, `CompaniesHeader.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useAuth.ts`, `useCompanyFilters.ts`)
- **Serviços**: camelCase (`userService.ts`, `companyService.ts`)
- **Types**: PascalCase (`User.ts`, `Company.ts`)
- **Utils**: camelCase (`formatCurrency.ts`, `dateUtils.ts`)

### Commits

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: formatação de código
refactor: refatoração de código
test: adiciona testes
chore: tarefas de manutenção
```

### Estrutura de Páginas

Todas as páginas devem seguir a estrutura padrão:

```
pages/
└── minha-pagina/
    ├── index.tsx                    # Componente principal
    ├── components/                  # Componentes específicos
    │   ├── MinhaPaginaHeader.tsx
    │   ├── MinhaPaginaFilters.tsx
    │   └── MinhaPaginaList.tsx
    └── hooks/                       # Hooks específicos
        └── useMinhaPaginaFilters.ts
```

## 🏗️ Arquitetura

O projeto segue os princípios de **Clean Architecture**:

- ✅ Separação de responsabilidades
- ✅ Componentização e reutilização
- ✅ Type Safety com TypeScript
- ✅ Mobile-First Design
- ✅ Testabilidade

Para mais detalhes, consulte a [documentação de arquitetura](./docs/FRONTEND_ARCHITECTURE.md).

## 🧪 Testes

```bash
# Executar testes
yarn test

# Executar testes com cobertura
yarn test:coverage

# Executar testes em modo watch
yarn test --watch
```

## 🔒 Segurança

- Variáveis sensíveis devem estar no arquivo `.env` (não commitado)
- Validação de dados no cliente e servidor
- Sanitização de inputs do usuário
- Autenticação via JWT tokens

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças seguindo o padrão Conventional Commits
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Checklist para Pull Requests

- [ ] Código segue as convenções do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada (se necessário)
- [ ] Linter passou sem erros (`yarn lint`)
- [ ] Build está funcionando (`yarn build`)
- [ ] Responsividade testada (mobile, tablet, desktop)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Autores

- **Rafael de Jesus Ferreira** - Desenvolvimento inicial e manutenção

## 🙏 Agradecimentos

- [React](https://react.dev/) - Biblioteca JavaScript
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Zustand](https://github.com/pmndrs/zustand) - Gerenciamento de estado
- [React Query](https://tanstack.com/query/latest) - Gerenciamento de dados
- [Lucide](https://lucide.dev/) - Biblioteca de ícones
