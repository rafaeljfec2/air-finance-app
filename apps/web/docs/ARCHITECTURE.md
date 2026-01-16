# Arquitetura do Projeto Frontend - Air Finance

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Diretórios](#estrutura-de-diretórios)
3. [Arquitetura de Componentes](#arquitetura-de-componentes)
4. [Padrões de Desenvolvimento](#padrões-de-desenvolvimento)
5. [Gerenciamento de Estado](#gerenciamento-de-estado)
6. [Roteamento](#roteamento)
7. [Design System](#design-system)
8. [Layouts Web vs Mobile](#layouts-web-vs-mobile)
9. [Criando Novas Telas](#criando-novas-telas)
10. [Componentes Base](#componentes-base)

---

## 🎯 Visão Geral

O **Air Finance** é uma aplicação web de gestão financeira pessoal desenvolvida com:

- **React 18** + **TypeScript**
- **Vite** como build tool
- **React Router** para roteamento
- **Tailwind CSS** para estilização (Mobile-First)
- **Zustand** para gerenciamento de estado global
- **React Query** (@tanstack/react-query) para gerenciamento de dados do servidor
- **Lucide React** para ícones

### Princípios Arquiteturais

- ✅ **Separação de Responsabilidades**: UI, lógica de negócio e serviços separados
- ✅ **Componentização**: Componentes pequenos, reutilizáveis e focados
- ✅ **Type Safety**: TypeScript em todo o código
- ✅ **Mobile-First**: Design responsivo começando por mobile
- ✅ **Clean Architecture**: Separação clara entre camadas

---

## 📁 Estrutura de Diretórios

```
src/
├── assets/              # Imagens, fontes, etc.
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

### Convenções de Nomenclatura

- **Componentes**: PascalCase (`UserCard.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useAuth.ts`)
- **Serviços**: camelCase (`userService.ts`)
- **Types**: PascalCase (`User.ts`)
- **Utils**: camelCase (`formatCurrency.ts`)

---

## 🧩 Arquitetura de Componentes

### Hierarquia de Componentes

```
App
├── Router
    ├── LayoutAuth (páginas públicas)
    │   ├── LoginPage
    │   └── SignupPage
    └── LayoutDefault
        └── ViewDefault (páginas autenticadas)
            ├── Header
            ├── Sidebar
            └── [Page Components]
                ├── [Feature Components]
                └── [UI Components]
```

### Tipos de Componentes

#### 1. **Layout Components** (`layouts/`)

Componentes que definem a estrutura geral da aplicação.

- `ViewDefault`: Layout principal com Header, Sidebar e conteúdo
- `LayoutAuth`: Layout para páginas públicas (login, signup)

#### 2. **UI Components** (`components/ui/`)

Componentes base reutilizáveis e agnósticos de contexto.

- `Button`, `Input`, `Card`, `Modal`, `Badge`, etc.
- Devem ser genéricos e configuráveis via props

#### 3. **Feature Components** (`components/[feature]/`)

Componentes específicos de uma feature/domínio.

- `CompanyFormModal`, `TransactionGrid`, `BudgetCard`, etc.
- Podem usar UI components e hooks específicos

#### 4. **Page Components** (`pages/`)

Componentes que representam rotas completas.

- Devem usar `ViewDefault` como wrapper
- Orquestram componentes de feature e hooks

---

## 🎨 Padrões de Desenvolvimento

### 1. Separação de Responsabilidades

```tsx
// ❌ ERRADO: Tudo em um componente
function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Lógica de fetch
    // Lógica de filtro
    // Lógica de ordenação
    // Renderização
  }, []);

  return <div>...</div>;
}

// ✅ CORRETO: Separado em hooks e componentes
function CompaniesPage() {
  const { companies, isLoading } = useCompanies();
  const { searchTerm, filterCompanies } = useCompanyFilters();
  const { sortConfig, sortCompanies } = useCompanySorting();

  return (
    <ViewDefault>
      <CompaniesHeader />
      <CompaniesFilters />
      <CompaniesList companies={filteredAndSorted} />
    </ViewDefault>
  );
}
```

### 2. Custom Hooks para Lógica de Negócio

```tsx
// hooks/useCompanyFilters.ts
export function useCompanyFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filterCompanies = useCallback(
    (companies: Company[]) => {
      // Lógica de filtro
    },
    [searchTerm, filterType],
  );

  return { searchTerm, setSearchTerm, filterCompanies };
}
```

### 3. Componentes Pequenos e Focados

```tsx
// ✅ Componente focado em uma responsabilidade
function CompanyCard({ company, onEdit, onDelete }: CompanyCardProps) {
  return (
    <RecordCard onEdit={onEdit} onDelete={onDelete}>
      {/* Conteúdo específico da Company */}
    </RecordCard>
  );
}
```

---

## 🔄 Gerenciamento de Estado

### Estado Global (Zustand)

```tsx
// stores/companyStore.ts
import { create } from 'zustand';

interface CompanyState {
  companyId: string;
  setCompanyId: (id: string) => void;
}

export const useCompanyStore = create<CompanyState>((set) => ({
  companyId: '',
  setCompanyId: (id) => set({ companyId: id }),
}));
```

### Estado do Servidor (React Query)

```tsx
// hooks/useCompanies.ts
import { useQuery, useMutation } from '@tanstack/react-query';

export function useCompanies() {
  const { data, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  });

  const createMutation = useMutation({
    mutationFn: createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
    },
  });

  return { companies: data, isLoading, createCompany: createMutation.mutate };
}
```

### Estado Local (useState)

Use `useState` para estado que:

- É específico de um componente
- Não precisa ser compartilhado
- É temporário (formulários, modais, etc.)

---

## 🛣️ Roteamento

### Configuração de Rotas

```tsx
// routes/index.tsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPageV2 />,
  },
  {
    path: '/login',
    element: (
      <LayoutAuth>
        <LoginPage />
      </LayoutAuth>
    ),
  },
  {
    path: '/companies',
    element: (
      <ViewDefault>
        <CompaniesPage />
      </ViewDefault>
    ),
  },
]);
```

### Lazy Loading

```tsx
const CompaniesPage = lazy(() =>
  import('@/pages/companies').then((m) => ({
    default: m.CompaniesPage,
  })),
);
```

---

## 🎨 Design System

### Cores

O projeto usa um sistema de cores baseado em temas claro/escuro:

```tsx
// Tema Claro
background: '#F8FAF9'
card: '#FFFFFF'
text: '#1A2825'
border: '#E8EFEC'

// Tema Escuro
background-dark: '#111827'
card-dark: '#1f2937'
text-dark: '#f9fafb'
border-dark: '#374151'

// Cores Primárias (Verde)
primary-500: '#2D6B4E'
primary-600: '#25573f'
primary-200: '#8CCFB0'
```

### Tipografia

```tsx
// Títulos
text-3xl md:text-4xl lg:text-5xl  // H1
text-2xl md:text-3xl lg:text-4xl  // H2
text-xl md:text-2xl lg:text-3xl   // H3

// Corpo
text-base md:text-lg               // Parágrafo padrão
text-sm md:text-base               // Texto secundário
text-xs                            // Texto pequeno
```

### Espaçamento

```tsx
// Padding/Margin Mobile-First
p-4 md:p-6 lg:p-8                 // Padding progressivo
gap-3 md:gap-4 lg:gap-6           // Gap em grids
space-y-4 md:space-y-6            // Espaçamento vertical
```

### Breakpoints Tailwind

```tsx
sm:  '640px'   // Small devices (landscape phones)
md:  '768px'   // Medium devices (tablets)
lg:  '1024px'  // Large devices (desktops)
xl:  '1280px'  // Extra large devices
2xl: '1536px'  // 2x Extra large devices
```

---

## 📱 Layouts Web vs Mobile

### ViewDefault - Layout Principal

O `ViewDefault` é o componente base para todas as páginas autenticadas.

#### Estrutura Web (Desktop)

```
┌─────────────────────────────────────────┐
│              Header                     │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │      Main Content            │
│ (fixo)   │      (scrollável)            │
│          │                              │
└──────────┴──────────────────────────────┘
```

#### Estrutura Mobile

```
┌─────────────────────┐
│      Header          │
├─────────────────────┤
│                     │
│   Main Content      │
│   (scrollável)      │
│                     │
│                     │
└─────────────────────┘
     [FAB Button]
```

### Características Responsivas

#### Desktop (lg:)

- Sidebar fixa visível
- Conteúdo com padding lateral maior
- Grids com múltiplas colunas
- Tabelas visíveis

#### Mobile (< lg)

- Sidebar oculta (acessível via menu hambúrguer)
- Conteúdo com padding menor
- Grids com 1 coluna
- Cards ao invés de tabelas
- FAB (Floating Action Button) para ações principais

### Exemplo de Uso

```tsx
export function CompaniesPage() {
  return (
    <ViewDefault>
      {/* Conteúdo da página */}
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Empresas</h1>
          <Button>Nova Empresa</Button>
        </div>

        {/* Grid responsivo */}
        <RecordsGrid columns={{ default: 1, md: 2, lg: 3 }}>
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </RecordsGrid>
      </div>
    </ViewDefault>
  );
}
```

---

## 🚀 Criando Novas Telas

### Passo a Passo

#### 1. Criar a Página

```tsx
// pages/my-feature/index.tsx
import { ViewDefault } from '@/layouts/ViewDefault';
import { MyFeatureHeader } from './components/MyFeatureHeader';
import { MyFeatureList } from './components/MyFeatureList';

export function MyFeaturePage() {
  return (
    <ViewDefault>
      <MyFeatureHeader />
      <MyFeatureList />
    </ViewDefault>
  );
}
```

#### 2. Criar Componentes de Feature

```tsx
// pages/my-feature/components/MyFeatureHeader.tsx
export function MyFeatureHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 className="text-2xl md:text-3xl font-bold">Minha Feature</h1>
      <Button>Nova Ação</Button>
    </div>
  );
}
```

#### 3. Criar Hooks Customizados

```tsx
// pages/my-feature/hooks/useMyFeatureFilters.ts
export function useMyFeatureFilters() {
  const [searchTerm, setSearchTerm] = useState('');

  const filterItems = useCallback(
    (items: Item[]) => {
      return items.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    },
    [searchTerm],
  );

  return { searchTerm, setSearchTerm, filterItems };
}
```

#### 4. Adicionar Rota

```tsx
// routes/index.tsx
const MyFeaturePage = lazy(() =>
  import('@/pages/my-feature').then((m) => ({
    default: m.MyFeaturePage,
  })),
);

export const router = createBrowserRouter([
  // ... outras rotas
  {
    path: '/my-feature',
    element: (
      <ViewDefault>
        <MyFeaturePage />
      </ViewDefault>
    ),
  },
]);
```

### Checklist para Nova Tela

- [ ] Página criada em `pages/[feature]/index.tsx`
- [ ] Usa `ViewDefault` como wrapper
- [ ] Componentes separados em `components/`
- [ ] Hooks customizados em `hooks/`
- [ ] Responsivo (mobile-first)
- [ ] Estados de loading e erro tratados
- [ ] Rota adicionada em `routes/index.tsx`
- [ ] Tipos TypeScript definidos

---

## 🧱 Componentes Base

### RecordsGrid

Grid responsivo para listagem de registros.

```tsx
import { RecordsGrid } from '@/components/ui/RecordsGrid';

<RecordsGrid columns={{ default: 1, md: 2, lg: 3, xl: 4 }} gap="md">
  {items.map((item) => (
    <ItemCard key={item.id} item={item} />
  ))}
</RecordsGrid>;
```

**Props:**

- `columns`: Configuração de colunas por breakpoint
- `gap`: Espaçamento entre itens (`sm`, `md`, `lg`)

### RecordCard

Card base para registros com ações padrão.

```tsx
import { RecordCard } from '@/components/ui/RecordCard';

<RecordCard
  onEdit={() => handleEdit(item)}
  onDelete={() => handleDelete(item.id)}
  isUpdating={isUpdating}
  isDeleting={isDeleting}
>
  {/* Conteúdo do card */}
</RecordCard>;
```

**Props:**

- `onEdit`: Callback para edição
- `onDelete`: Callback para exclusão
- `isUpdating`: Estado de loading de atualização
- `isDeleting`: Estado de loading de exclusão
- `showActions`: Mostrar/esconder botões de ação

### SortableColumn

Coluna ordenável para tabelas.

```tsx
import { SortableColumn } from '@/components/ui/SortableColumn';

<thead>
  <tr>
    <SortableColumn field="name" currentSort={sortConfig} onSort={handleSort}>
      Nome
    </SortableColumn>
  </tr>
</thead>;
```

**Props:**

- `field`: Campo para ordenação
- `currentSort`: Configuração atual de ordenação
- `onSort`: Callback quando clicado
- `align`: Alinhamento (`left`, `center`, `right`)

### useSortable Hook

Hook para gerenciar ordenação.

```tsx
import { useSortable } from '@/hooks/useSortable';

const { sortConfig, handleSort, sortData } = useSortable({
  initialField: 'name',
  initialDirection: 'asc',
});

const sortedItems = sortData(items, (item, field) => {
  // Lógica customizada para obter valor do campo
  return item[field];
});
```

**Retorna:**

- `sortConfig`: Configuração atual (`{ field, direction }`)
- `handleSort`: Função para alterar ordenação
- `sortData`: Função para ordenar array de dados
- `clearSort`: Função para limpar ordenação

### Outros Componentes UI

- **Button**: Botão com variantes (`primary`, `outline`, `danger`)
- **Input**: Campo de entrada de texto
- **Card**: Container de conteúdo
- **Modal**: Modal/dialog
- **Badge**: Badge de status
- **Loading**: Indicador de carregamento
- **Toast**: Notificações toast

---

## 📚 Recursos Adicionais

- [Guia Mobile-First](./MOBILE_FIRST_GUIDE.md)
- [Padrão CRUD](./CRUD_PATTERN.md) (se existir)
- [Convenções de Código](./CODING_CONVENTIONS.md) (se existir)

---

**Última atualização**: 2025-01-02
