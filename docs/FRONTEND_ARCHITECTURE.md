# Arquitetura Frontend - Air Finance

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Projeto](#arquitetura-do-projeto)
3. [Estrutura de Diretórios](#estrutura-de-diretórios)
4. [Componentes Base](#componentes-base)
5. [Design System](#design-system)
6. [Layouts: Web vs Mobile](#layouts-web-vs-mobile)
7. [Criando Novas Telas](#criando-novas-telas)
8. [Padrões e Convenções](#padrões-e-convenções)
9. [Boas Práticas](#boas-práticas)

---

## 🎯 Visão Geral

O **Air Finance** é uma aplicação web de gestão financeira pessoal desenvolvida com tecnologias modernas e seguindo princípios de Clean Architecture.

### Stack Tecnológico

- **React 18** + **TypeScript** - Framework e tipagem
- **Vite** - Build tool e dev server
- **React Router v6** - Roteamento
- **Tailwind CSS** - Estilização (Mobile-First)
- **Zustand** - Gerenciamento de estado global
- **React Query** (@tanstack/react-query) - Gerenciamento de dados do servidor
- **Lucide React** - Biblioteca de ícones
- **Class Variance Authority (CVA)** - Variantes de componentes

### Princípios Arquiteturais

- ✅ **Separação de Responsabilidades**: UI, lógica de negócio e serviços separados
- ✅ **Componentização**: Componentes pequenos, reutilizáveis e focados
- ✅ **Type Safety**: TypeScript em todo o código
- ✅ **Mobile-First**: Design responsivo começando por mobile
- ✅ **Clean Architecture**: Separação clara entre camadas
- ✅ **DRY (Don't Repeat Yourself)**: Reutilização de código
- ✅ **SOLID**: Princípios de design orientado a objetos

---

## 🏗️ Arquitetura do Projeto

### Hierarquia de Componentes

```
App
├── Router
│   ├── LayoutAuth (páginas públicas)
│   │   ├── LoginPage
│   │   └── SignupPage
│   └── LayoutDefault
│       └── ViewDefault (páginas autenticadas)
│           ├── Header
│           ├── Sidebar
│           └── [Page Components]
│               ├── [Feature Components]
│               └── [UI Components]
```

### Fluxo de Dados

```
User Action
    ↓
Page Component
    ↓
Custom Hook (useCompanies, useAccounts, etc.)
    ↓
Service Layer (API calls)
    ↓
React Query (Cache & State)
    ↓
Zustand Store (Global State)
    ↓
UI Update
```

---

## 📁 Estrutura de Diretórios

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
│   └── [page-name]/
│       ├── index.tsx           # Componente principal da página
│       ├── components/         # Componentes específicos da página
│       │   ├── [Page]Header.tsx
│       │   ├── [Page]Filters.tsx
│       │   ├── [Page]List.tsx
│       │   ├── [Page]EmptyState.tsx
│       │   └── [Page]ErrorState.tsx
│       └── hooks/              # Hooks específicos da página
│           ├── use[Page]Filters.ts
│           └── use[Page]Sorting.ts
├── routes/             # Configuração de rotas
├── services/           # Serviços de API e integrações
├── stores/             # Zustand stores
├── types/              # TypeScript types e interfaces
└── utils/              # Funções utilitárias
```

### Convenções de Nomenclatura

- **Componentes**: PascalCase (`UserCard.tsx`, `CompaniesHeader.tsx`)
- **Hooks**: camelCase com prefixo `use` (`useAuth.ts`, `useCompanyFilters.ts`)
- **Serviços**: camelCase (`userService.ts`, `companyService.ts`)
- **Types/Interfaces**: PascalCase (`User.ts`, `Company.ts`)
- **Utils**: camelCase (`formatCurrency.ts`, `dateUtils.ts`)
- **Páginas**: PascalCase (`CompaniesPage.tsx`, `AccountsPage.tsx`)

---

## 🧩 Componentes Base

### Componentes UI (`components/ui/`)

Componentes fundamentais reutilizáveis em toda a aplicação.

#### 1. **Button** (`button.tsx`)

Botão padrão com variantes e tamanhos.

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="md">Clique aqui</Button>
<Button variant="outline" size="sm">Cancelar</Button>
<Button variant="destructive" size="lg">Excluir</Button>
```

**Variantes:**

- `default` - Botão primário (verde)
- `outline` - Botão com borda
- `ghost` - Botão sem fundo
- `success` - Botão de sucesso (verde)
- `destructive` - Botão de ação destrutiva (vermelho)

**Tamanhos:**

- `sm` - Pequeno (min-height: 44px)
- `md` - Médio (padrão, min-height: 44px)
- `lg` - Grande (min-height: 44px)

#### 2. **Input** (`input.tsx`)

Campo de entrada de texto padrão.

```tsx
import { Input } from '@/components/ui/input';

<Input
  type="text"
  placeholder="Digite aqui..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>;
```

**Características:**

- Altura mínima de 44px (acessibilidade mobile)
- Suporte a dark mode
- Estados de foco e desabilitado

#### 3. **Card** (`card.tsx`)

Container para agrupar conteúdo relacionado.

```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Título do Card</CardTitle>
    <CardDescription>Descrição opcional</CardDescription>
  </CardHeader>
  <CardContent>Conteúdo principal</CardContent>
  <CardFooter>Ações do card</CardFooter>
</Card>;
```

#### 4. **Badge** (`badge.tsx`)

Badge para exibir status ou labels.

```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Novo</Badge>
<Badge variant="success">Ativo</Badge>
<Badge variant="destructive">Inativo</Badge>
```

**Variantes:**

- `default` - Badge padrão (verde primário)
- `secondary` - Badge secundário
- `destructive` - Badge de erro (vermelho)
- `outline` - Badge com borda
- `success` - Badge de sucesso (verde)

#### 5. **Modal** (`Modal.tsx`)

Modal para diálogos e formulários.

```tsx
import { Modal } from '@/components/ui/Modal';

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Título do Modal">
  Conteúdo do modal
</Modal>;
```

#### 6. **RecordsGrid** (`RecordsGrid.tsx`)

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

- `columns` - Configuração de colunas por breakpoint
- `gap` - Espaçamento entre itens (`sm`, `md`, `lg`)

#### 7. **RecordCard** (`RecordCard.tsx`)

Card padrão para exibir registros em grids.

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

#### 8. **SortableColumn** (`SortableColumn.tsx`)

Coluna ordenável para tabelas.

```tsx
import { SortableColumn } from '@/components/ui/SortableColumn';

<SortableColumn field="name" currentSort={sortConfig} onSort={handleSort} align="left">
  Nome
</SortableColumn>;
```

### Componentes de Layout (`components/layout/`)

#### 1. **ViewDefault** (`layouts/ViewDefault.tsx`)

Layout principal para todas as páginas autenticadas.

```tsx
import { ViewDefault } from '@/layouts/ViewDefault';

export function MyPage() {
  return <ViewDefault>{/* Conteúdo da página */}</ViewDefault>;
}
```

**Características:**

- Header fixo no topo
- Sidebar responsiva (desktop: fixa, mobile: drawer)
- Área de conteúdo scrollável
- FAB (Floating Action Button) para mobile
- Suporte a dark mode

#### 2. **Header** (`components/layout/Header/`)

Cabeçalho da aplicação com navegação e ações.

**Componentes:**

- `Header.tsx` - Componente principal
- `Navigation.tsx` - Navegação principal
- `UserMenu.tsx` - Menu do usuário

#### 3. **Sidebar** (`components/layout/Sidebar/`)

Menu lateral de navegação.

**Componentes:**

- `Sidebar.tsx` - Componente principal
- `NavigationGroup.tsx` - Grupo de itens de navegação
- `NavigationSubmenu.tsx` - Submenu de navegação

---

## 🎨 Design System

### Cores

#### Paleta Principal

```tsx
// Cores da marca
brand: {
  leaf: '#8CCFB0',    // Cor da folha
  arrow: '#2D6B4E',   // Cor da seta
}

// Cores primárias (verde)
primary: {
  50: '#f0faf5',
  100: '#d5f1e3',
  200: '#8CCFB0',
  300: '#70c299',
  400: '#4aaf7d',
  500: '#2D6B4E',     // Cor principal
  600: '#25573f',
  700: '#1d4331',
  800: '#152f23',
  900: '#0c1a14',
}
```

#### Cores Semânticas (Tema Claro)

```tsx
background: '#F8FAF9'; // Fundo principal
card: '#FFFFFF'; // Fundo de cards
text: '#1A2825'; // Texto principal
border: '#E8EFEC'; // Bordas
```

#### Cores Semânticas (Tema Escuro)

```tsx
background-dark: '#111827'  // Fundo principal
card-dark: '#1f2937'        // Fundo de cards
text-dark: '#f9fafb'        // Texto principal
border-dark: '#374151'      // Bordas
```

### Tipografia

#### Escala de Tamanhos

```tsx
// Títulos
text-3xl md:text-4xl lg:text-5xl  // H1 - Títulos principais
text-2xl md:text-3xl lg:text-4xl  // H2 - Subtítulos
text-xl md:text-2xl lg:text-3xl   // H3 - Seções
text-lg md:text-xl                // H4 - Subseções

// Corpo
text-base md:text-lg               // Parágrafo padrão
text-sm md:text-base               // Texto secundário
text-xs                            // Texto pequeno (labels, captions)
```

#### Pesos de Fonte

```tsx
font - light; // 300
font - normal; // 400 (padrão)
font - medium; // 500
font - semibold; // 600
font - bold; // 700
```

### Espaçamento

#### Sistema de Espaçamento (Tailwind)

```tsx
// Padding/Margin Mobile-First
p-2 sm:p-4 md:p-6 lg:p-8          // Padding progressivo
m-2 sm:m-4 md:m-6 lg:m-8          // Margin progressivo

// Gap em grids e flex
gap-2 sm:gap-3 md:gap-4 lg:gap-6  // Espaçamento entre itens

// Espaçamento vertical
space-y-2 sm:space-y-4 md:space-y-6  // Espaçamento entre filhos
```

#### Espaçamento Padrão em Cards

```tsx
// Padding interno de cards
p-3 sm:p-4 md:p-6                 // Mobile-first

// Espaçamento entre cards
gap-3 sm:gap-4 md:gap-6           // Grid gap
```

### Breakpoints Tailwind

```tsx
sm:  '640px'   // Small devices (landscape phones)
md:  '768px'   // Medium devices (tablets)
lg:  '1024px'  // Large devices (desktops)
xl:  '1280px'  // Extra large devices
2xl: '1536px'  // 2x Extra large devices
```

### Sombras

```tsx
shadow - sm; // Sombra pequena (cards)
shadow; // Sombra padrão
shadow - md; // Sombra média
shadow - lg; // Sombra grande (modals, dropdowns)
shadow - xl; // Sombra extra grande
```

### Bordas

```tsx
rounded - sm; // 2px
rounded; // 4px (padrão)
rounded - md; // 6px
rounded - lg; // 8px (cards padrão)
rounded - xl; // 12px
rounded - full; // Círculo completo
```

### Transições

```tsx
transition-colors        // Transição de cores
transition-all          // Todas as propriedades
duration-200            // 200ms
duration-300            // 300ms (padrão)
ease-in-out            // Curva de animação
```

---

## 📱 Layouts: Web vs Mobile

### ViewDefault - Estrutura Responsiva

O `ViewDefault` é o componente base para todas as páginas autenticadas e se adapta automaticamente entre web e mobile.

#### Desktop (lg: 1024px+)

```
┌─────────────────────────────────────────────────┐
│                    Header                        │
│              (fixo no topo)                      │
├──────────┬──────────────────────────────────────┤
│          │                                      │
│ Sidebar  │      Main Content                   │
│ (fixa)   │      (scrollável)                   │
│          │                                      │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

**Características:**

- Sidebar sempre visível à esquerda
- Header fixo no topo
- Conteúdo principal ocupa o restante do espaço
- Padding lateral maior (`lg:pl-8`)

#### Tablet (md: 768px - lg: 1023px)

```
┌──────────────────────────────────┐
│            Header                │
├──────────────────────────────────┤
│                                  │
│      Main Content                │
│      (scrollável)                │
│                                  │
└──────────────────────────────────┘
```

**Características:**

- Sidebar oculta por padrão (drawer)
- Header com botão de menu hambúrguer
- Conteúdo ocupa toda a largura
- Padding intermediário (`md:p-6`)

#### Mobile (< 768px)

```
┌─────────────────────┐
│      Header          │
│  [☰] Logo  [👤]     │
├─────────────────────┤
│                     │
│   Main Content      │
│   (scrollável)      │
│                     │
│                     │
└─────────────────────┘
         [+]
      (FAB)
```

**Características:**

- Sidebar como drawer (overlay)
- Header compacto com ações principais
- Conteúdo com padding reduzido (`p-4`)
- FAB (Floating Action Button) para ações principais
- Botão de voltar ao topo quando header está oculto

### Diferenças de Layout

#### 1. **Sidebar**

**Desktop:**

```tsx
// Sidebar sempre visível, largura fixa
<Sidebar className="hidden lg:block lg:w-64" />
```

**Mobile:**

```tsx
// Sidebar como drawer overlay
<Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} className="lg:hidden" />
```

#### 2. **Header**

**Desktop:**

```tsx
// Header completo com todas as ações
<Header className="h-16" />
```

**Mobile:**

```tsx
// Header compacto, ações essenciais
<Header className="h-14" showMobileMenu={true} />
```

#### 3. **Padding e Espaçamento**

**Desktop:**

```tsx
<div className="p-6 lg:p-8">{/* Conteúdo */}</div>
```

**Mobile:**

```tsx
<div className="p-4 sm:p-6">{/* Conteúdo */}</div>
```

#### 4. **Grids e Listas**

**Desktop:**

```tsx
<RecordsGrid columns={{ default: 1, md: 2, lg: 3, xl: 4 }}>{/* Cards */}</RecordsGrid>
```

**Mobile:**

```tsx
// Grid se adapta automaticamente
// 1 coluna no mobile, 2 no tablet, 3+ no desktop
```

#### 5. **FAB (Floating Action Button)**

---

## 📐 Safe Areas (iOS e Android)

O projeto implementa suporte completo para **Safe Areas** do iOS e Android, garantindo que conteúdo não fique escondido atrás de barras de status, notches ou barras de navegação em dispositivos móveis.

### O que são Safe Areas?

Safe Areas são áreas seguras definidas pelo sistema operacional onde o conteúdo pode ser exibido sem ser obstruído por elementos do sistema como:
- **Notch** (iPhone X e superiores)
- **Barra de status** (iOS e Android)
- **Barra de navegação** (Android)
- **Indicadores de gestos** (iOS)

### Configuração

#### 1. Viewport Meta Tag

O arquivo `index.html` já está configurado com `viewport-fit=cover`:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover"
/>
```

#### 2. Variáveis CSS

As variáveis CSS para safe areas estão definidas em `src/index.css`:

```css
:root {
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
}
```

### Classes Utilitárias

O projeto fornece classes utilitárias para trabalhar com safe areas:

#### Padding com Safe Area

```tsx
<div className="pt-safe">     {/* padding-top + safe area top */}
<div className="pb-safe">     {/* padding-bottom + safe area bottom */}
<div className="pl-safe">     {/* padding-left + safe area left */}
<div className="pr-safe">     {/* padding-right + safe area right */}
<div className="px-safe">    {/* padding horizontal + safe areas */}
<div className="py-safe">    {/* padding vertical + safe areas */}
<div className="p-safe">     {/* padding em todos os lados + safe areas */}
```

#### Margin com Safe Area

```tsx
<div className="mt-safe">    {/* margin-top + safe area top */}
<div className="mb-safe">    {/* margin-bottom + safe area bottom */}
```

#### Posicionamento com Safe Area

```tsx
<div className="top-safe">        {/* top: safe area inset */}
<div className="bottom-safe">     {/* bottom: safe area inset */}
<div className="left-safe">       {/* left: safe area inset */}
<div className="right-safe">      {/* right: safe area inset */}
<div className="inset-safe">     {/* inset completo com safe areas */}
<div className="inset-safe-y">   {/* top e bottom com safe areas */}
<div className="inset-safe-x">   {/* left e right com safe areas */}
```

#### Posicionamento com Espaçamento Customizado

```tsx
<div className="top-safe-4">     {/* top: 1rem + safe area top */}
<div className="top-safe-6">     {/* top: 1.5rem + safe area top */}
<div className="bottom-safe-4">  {/* bottom: 1rem + safe area bottom */}
<div className="bottom-safe-6">  {/* bottom: 1.5rem + safe area bottom */}
<div className="right-safe-4">   {/* right: 1rem + safe area right */}
<div className="right-safe-6">   {/* right: 1.5rem + safe area right */}
```

### Uso em Componentes

#### Elementos Fixos (FAB, Botões Flutuantes)

```tsx
// ✅ CORRETO: Usar safe areas em elementos fixos
<button className="fixed bottom-safe-6 right-safe-6">
  FAB
</button>

// ❌ ERRADO: Não considerar safe areas
<button className="fixed bottom-6 right-6">
  FAB (pode ficar escondido)
</button>
```

#### Modais e Overlays

```tsx
// ✅ CORRETO: Modal respeitando safe areas
<div className="fixed inset-safe z-50 flex items-center justify-center p-safe">
  <div className="modal-content">...</div>
</div>

// ❌ ERRADO: Modal sem safe areas
<div className="fixed inset-0 z-50">
  <div className="modal-content">...</div>
</div>
```

#### Sidebar Mobile

```tsx
// ✅ CORRETO: Sidebar com safe areas
<div className="fixed inset-safe-y left-0 h-full">
  {/* Conteúdo da sidebar */}
</div>
```

#### Dropdowns e Menus

```tsx
// ✅ CORRETO: Dropdown considerando safe area right
<Menu.Items className="absolute right-0 right-safe lg:right-0">
  {/* Itens do menu */}
</Menu.Items>
```

### Hook Customizado: `useSafeArea`

Para casos onde você precisa dos valores de safe area em JavaScript:

```tsx
import { useSafeArea } from '@/hooks/useSafeArea';

function MyComponent() {
  const { top, right, bottom, left } = useSafeArea();

  return (
    <div style={{ paddingTop: `${top}px` }}>
      Conteúdo respeitando safe area
    </div>
  );
}
```

### Utilitários: `safeArea.ts`

Funções utilitárias para trabalhar com safe areas programaticamente:

```tsx
import { getSafeAreaInsets, hasSafeAreas } from '@/utils/safeArea';

// Obter todos os insets
const insets = getSafeAreaInsets();
console.log(insets.top, insets.bottom);

// Verificar se dispositivo tem safe areas
if (hasSafeAreas()) {
  // Aplicar estilos específicos
}
```

### Componentes que Já Usam Safe Areas

Os seguintes componentes já estão configurados para respeitar safe areas:

- ✅ **ViewDefault**: FAB e botão de header
- ✅ **Sidebar**: Container e header em mobile
- ✅ **Modal**: Overlay e conteúdo
- ✅ **ConfirmModal**: Overlay e conteúdo
- ✅ **TransactionTypeModal**: Overlay e conteúdo
- ✅ **NotificationsMenu**: Dropdown
- ✅ **UserMenu**: Dropdown
- ✅ **StatementFilters**: Dropdown de filtros

### Boas Práticas

1. **Sempre use safe areas em elementos fixos** (`fixed` ou `absolute` em contexto de viewport)
2. **Em desktop, safe areas são 0px**, então use classes responsivas:
   ```tsx
   <div className="top-safe-4 lg:top-4">
   ```
3. **Teste em dispositivos reais** com notch (iPhone X+) e diferentes configurações de Android
4. **Mantenha tamanhos mínimos de toque** (44x44px) mesmo com safe areas
5. **Use as classes utilitárias** ao invés de calcular manualmente

### Compatibilidade

- ✅ **iOS 11+**: Suporte completo via `env()`
- ✅ **Android Chrome 69+**: Suporte completo via `env()`
- ✅ **Desktop**: Safe areas são 0px, não afeta layout
- ✅ **Fallback**: Valores padrão (0px) para navegadores antigos

---

#### 5. **FAB (Floating Action Button)**

**Mobile Only:**

```tsx
{
  /* FAB apenas no mobile */
}
<div className="lg:hidden fixed bottom-6 right-6 z-40">
  <button className="p-4 bg-primary-600 rounded-full shadow-xl">
    <Plus className="h-7 w-7" />
  </button>
</div>;
```

### Padrões Mobile-First

Sempre comece pelo mobile e adicione breakpoints maiores:

```tsx
// ❌ Ruim (Desktop-First)
<div className="p-8 md:p-4">

// ✅ Bom (Mobile-First)
<div className="p-4 md:p-6 lg:p-8">
```

```tsx
// ❌ Ruim
<div className="grid grid-cols-4 md:grid-cols-1">

// ✅ Bom
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
```

---

## 🚀 Criando Novas Telas

### Estrutura Padrão de uma Página

Siga este padrão para criar novas telas:

```
pages/
└── minha-pagina/
    ├── index.tsx                    # Componente principal
    ├── components/
    │   ├── MinhaPaginaHeader.tsx   # Cabeçalho da página
    │   ├── MinhaPaginaFilters.tsx  # Filtros
    │   ├── MinhaPaginaList.tsx     # Lista/Tabela
    │   ├── MinhaPaginaCard.tsx     # Card individual (se grid)
    │   ├── MinhaPaginaEmptyState.tsx  # Estado vazio
    │   └── MinhaPaginaErrorState.tsx  # Estado de erro
    └── hooks/
        ├── useMinhaPaginaFilters.ts   # Hook de filtros
        └── useMinhaPaginaSorting.ts   # Hook de ordenação
```

### Passo a Passo

#### 1. Criar a Estrutura de Diretórios

```bash
mkdir -p src/pages/minha-pagina/components
mkdir -p src/pages/minha-pagina/hooks
```

#### 2. Criar o Componente Principal (`index.tsx`)

```tsx
import { ViewDefault } from '@/layouts/ViewDefault';
import { useState, useMemo } from 'react';
import { MinhaPaginaHeader } from './components/MinhaPaginaHeader';
import { MinhaPaginaFilters } from './components/MinhaPaginaFilters';
import { MinhaPaginaList } from './components/MinhaPaginaList';
import { MinhaPaginaEmptyState } from './components/MinhaPaginaEmptyState';
import { MinhaPaginaErrorState } from './components/MinhaPaginaErrorState';
import { useMinhaPaginaFilters } from './hooks/useMinhaPaginaFilters';
import { useMinhaPaginaSorting } from './hooks/useMinhaPaginaSorting';
import { useMinhaPagina } from '@/hooks/useMinhaPagina';

export function MinhaPagina() {
  // Hooks de dados
  const { data, isLoading, error } = useMinhaPagina();

  // Hooks de filtros e ordenação
  const { filters, filteredData } = useMinhaPaginaFilters(data);
  const { sortConfig, handleSort, sortedData } = useMinhaPaginaSorting(filteredData);

  // Estados locais
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Dados finais processados
  const finalData = useMemo(() => sortedData, [sortedData]);

  // Estados de loading e erro
  if (isLoading) {
    return (
      <ViewDefault>
        <div className="flex items-center justify-center h-64">
          <Loading />
        </div>
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <MinhaPaginaErrorState error={error} />
      </ViewDefault>
    );
  }

  if (finalData.length === 0) {
    return (
      <ViewDefault>
        <MinhaPaginaHeader onCreate={() => {}} />
        <MinhaPaginaEmptyState />
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <MinhaPaginaHeader onCreate={() => {}} viewMode={viewMode} onViewModeChange={setViewMode} />

      <MinhaPaginaFilters filters={filters} onFiltersChange={() => {}} />

      <MinhaPaginaList
        data={finalData}
        viewMode={viewMode}
        sortConfig={sortConfig}
        onSort={handleSort}
      />
    </ViewDefault>
  );
}
```

#### 3. Criar Componentes de Suporte

**MinhaPaginaHeader.tsx:**

```tsx
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MinhaPaginaHeaderProps {
  onCreate: () => void;
  viewMode?: 'grid' | 'table';
  onViewModeChange?: (mode: 'grid' | 'table') => void;
}

export function MinhaPaginaHeader({
  onCreate,
  viewMode,
  onViewModeChange,
}: MinhaPaginaHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text dark:text-text-dark">
          Minha Página
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie seus itens</p>
      </div>

      <div className="flex items-center gap-2">
        {/* Toggle de visualização (opcional) */}
        {onViewModeChange && (
          <div className="flex rounded-lg border border-border dark:border-border-dark p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`px-3 py-1.5 text-sm rounded ${
                viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-text dark:text-text-dark'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`px-3 py-1.5 text-sm rounded ${
                viewMode === 'table' ? 'bg-primary-500 text-white' : 'text-text dark:text-text-dark'
              }`}
            >
              Tabela
            </button>
          </div>
        )}

        <Button onClick={onCreate} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>
    </div>
  );
}
```

**MinhaPaginaFilters.tsx:**

```tsx
import { Input } from '@/components/ui/input';

interface MinhaPaginaFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export function MinhaPaginaFilters({ searchTerm, setSearchTerm }: MinhaPaginaFiltersProps) {
  return (
    <div className="mb-6">
      <Input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />
    </div>
  );
}
```

**MinhaPaginaList.tsx:**

```tsx
import { RecordsGrid } from '@/components/ui/RecordsGrid';
import { RecordCard } from '@/components/ui/RecordCard';
import { MinhaPaginaCard } from './MinhaPaginaCard';

interface MinhaPaginaListProps {
  data: any[];
  viewMode: 'grid' | 'table';
  sortConfig: any;
  onSort: (field: string) => void;
}

export function MinhaPaginaList({ data, viewMode, sortConfig, onSort }: MinhaPaginaListProps) {
  if (viewMode === 'grid') {
    return (
      <RecordsGrid columns={{ default: 1, md: 2, lg: 3, xl: 4 }} gap="md">
        {data.map((item) => (
          <MinhaPaginaCard key={item.id} item={item} />
        ))}
      </RecordsGrid>
    );
  }

  // Modo tabela
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th>Coluna 1</th>
            <th>Coluna 2</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.field1}</td>
              <td>{item.field2}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

**MinhaPaginaCard.tsx:**

```tsx
import { RecordCard } from '@/components/ui/RecordCard';

interface MinhaPaginaCardProps {
  item: any;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MinhaPaginaCard({ item, onEdit, onDelete }: MinhaPaginaCardProps) {
  return (
    <RecordCard onEdit={onEdit} onDelete={onDelete}>
      <div>
        <h3 className="font-semibold text-text dark:text-text-dark mb-1">{item.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
      </div>
    </RecordCard>
  );
}
```

**MinhaPaginaEmptyState.tsx:**

```tsx
import { Inbox } from 'lucide-react';

export function MinhaPaginaEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Inbox className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
      <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">
        Nenhum item encontrado
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Comece criando seu primeiro item</p>
    </div>
  );
}
```

**MinhaPaginaErrorState.tsx:**

```tsx
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MinhaPaginaErrorStateProps {
  error: Error | unknown;
  onRetry?: () => void;
}

export function MinhaPaginaErrorState({ error, onRetry }: MinhaPaginaErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar dados';

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-lg font-semibold text-text dark:text-text-dark mb-2">Erro ao carregar</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{errorMessage}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
```

#### 4. Criar Hooks Customizados

**useMinhaPaginaFilters.ts:**

```tsx
import { useMemo, useState } from 'react';

export function useMinhaPaginaFilters(data: any[]) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredData,
    hasActiveFilters: !!searchTerm,
  };
}
```

**useMinhaPaginaSorting.ts:**

```tsx
import { useSortable } from '@/hooks/useSortable';

export function useMinhaPaginaSorting(data: any[]) {
  const { sortConfig, handleSort, sortData } = useSortable({
    initialField: 'name',
    initialDirection: 'asc',
  });

  const sortedData = useMemo(() => {
    return sortData(data, (item, field) => item[field]);
  }, [data, sortData]);

  return {
    sortConfig,
    handleSort,
    sortedData,
  };
}
```

#### 5. Adicionar Rota

No arquivo `routes/index.tsx`:

```tsx
const MinhaPagina = lazy(() =>
  import('@/pages/minha-pagina').then((m) => ({ default: m.MinhaPagina })),
);

// No array de rotas:
{
  path: '/minha-pagina',
  element: (
    <Suspense fallback={<SuspenseLoader />}>
      <ProtectedRoute>
        <MinhaPagina />
      </ProtectedRoute>
    </Suspense>
  ),
},
```

### Checklist de Criação de Página

- [ ] Criar estrutura de diretórios
- [ ] Criar componente principal (`index.tsx`)
- [ ] Criar componentes de suporte (Header, Filters, List, etc.)
- [ ] Criar hooks customizados (filters, sorting)
- [ ] Implementar estados de loading e erro
- [ ] Implementar estado vazio
- [ ] Adicionar rota no `routes/index.tsx`
- [ ] Testar responsividade (mobile, tablet, desktop)
- [ ] Verificar acessibilidade
- [ ] Adicionar testes (opcional)

---

## 📐 Padrões e Convenções

### Estrutura de Componentes

```tsx
// 1. Imports (agrupados)
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMyHook } from '@/hooks/useMyHook';

// 2. Types/Interfaces
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

// 3. Componente
export function MyComponent({ title, onAction }: MyComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();
  const { data } = useMyHook();

  // 5. Handlers
  const handleClick = () => {
    // lógica
  };

  // 6. Render
  return <div>{/* JSX */}</div>;
}
```

### Nomenclatura de Props

```tsx
// ✅ Bom
interface ButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
}

// ❌ Ruim
interface ButtonProps {
  click: () => void; // Deveria ser onClick
  loading?: boolean; // Deveria ser isLoading
  type?: string; // Muito genérico
}
```

### Tratamento de Erros

```tsx
// Sempre tratar erros
try {
  await someAsyncOperation();
} catch (error) {
  console.error('Erro:', error);
  toast.error('Erro ao executar operação');
}
```

### Loading States

```tsx
if (isLoading) {
  return <Loading />;
}

if (error) {
  return <ErrorState error={error} />;
}

if (data.length === 0) {
  return <EmptyState />;
}
```

---

## ✅ Boas Práticas

### 1. **Sempre Use ViewDefault**

Todas as páginas autenticadas devem usar `ViewDefault`:

```tsx
// ✅ Bom
export function MyPage() {
  return <ViewDefault>{/* Conteúdo */}</ViewDefault>;
}

// ❌ Ruim
export function MyPage() {
  return <div>{/* Conteúdo sem layout */}</div>;
}
```

### 2. **Mobile-First**

Sempre comece pelo mobile:

```tsx
// ✅ Bom
<div className="p-4 md:p-6 lg:p-8">

// ❌ Ruim
<div className="p-8 md:p-6 lg:p-4">
```

### 3. **Use Componentes Base**

Prefira componentes base do `ui/`:

```tsx
// ✅ Bom
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// ❌ Ruim
<button className="...">  // Estilização inline
```

### 4. **Separe Lógica de UI**

Use hooks para lógica:

```tsx
// ✅ Bom
const { filteredData } = useMyFilters(data);

// ❌ Ruim
const filteredData = data.filter(...); // Lógica no componente
```

### 5. **TypeScript em Tudo**

Sempre tipar props e estados:

```tsx
// ✅ Bom
interface Props {
  title: string;
  count: number;
}

// ❌ Ruim
function Component(props: any) {
```

### 6. **Acessibilidade**

- Use elementos semânticos (`<button>`, `<nav>`, etc.)
- Adicione `aria-label` quando necessário
- Mantenha contraste adequado
- Suporte a navegação por teclado

### 7. **Performance**

- Use `useMemo` para cálculos pesados
- Use `useCallback` para funções passadas como props
- Lazy loading de rotas
- Virtualização para listas longas

---

## 📚 Recursos Adicionais

- [Documentação React](https://react.dev)
- [Documentação Tailwind CSS](https://tailwindcss.com/docs)
- [Documentação React Query](https://tanstack.com/query/latest)
- [Documentação Zustand](https://zustand-demo.pmnd.rs/)
- [Guia de Acessibilidade](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Última atualização:** Dezembro 2024
