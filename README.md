# Air Finance App

Sistema de organização financeira pessoal desenvolvido com React, TypeScript e Vite.

## 🚀 Tecnologias

- React 18
- TypeScript
- Vite
- React Router DOM
- Zustand (gerenciamento de estado)
- React Query (requisições e cache)
- React Hook Form + Zod (formulários e validação)
- Tailwind CSS
- Axios
- date-fns
- Headless UI + Heroicons

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/air-finance-app.git
cd air-finance-app
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run preview` - Previa a build de produção localmente
- `npm run lint` - Executa o ESLint
- `npm run format` - Formata o código com Prettier

## 📁 Estrutura do Projeto

```
src/
├─ components/     # Componentes reutilizáveis
├─ features/       # Domínios da aplicação
│  ├─ auth/        # Autenticação
│  ├─ dashboard/   # Dashboard
│  └─ transactions/# Transações
├─ hooks/          # Hooks customizados
├─ store/          # Zustand stores
├─ services/       # Integrações com API
├─ utils/          # Funções auxiliares
├─ types/          # Tipos TypeScript
├─ assets/         # Imagens, ícones, etc.
├─ layouts/        # Layouts da aplicação
└─ App.tsx         # Componente principal
```

## 📝 Funcionalidades

- [x] Autenticação
- [x] Dashboard com resumo financeiro
- [x] Listagem de transações
- [ ] Cadastro de transações
- [ ] Edição de transações
- [ ] Exclusão de transações
- [ ] Filtros por período
- [ ] Categorias de transações

## 🔄 Próximos Passos

- [ ] Implementar testes unitários e de integração
- [ ] Adicionar persistência com IndexedDB
- [ ] Implementar tema escuro/claro
- [ ] Adicionar gráficos e visualizações
- [ ] Implementar exportação de relatórios
- [ ] Adicionar notificações
- [ ] Implementar backup automático

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
