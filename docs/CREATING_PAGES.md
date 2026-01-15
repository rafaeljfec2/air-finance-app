# Guia Completo: Criando Novas Telas

Este guia fornece um passo a passo detalhado para criar novas telas no Air Finance, seguindo os padrões arquiteturais do projeto.

---

## 📋 Índice

1. [Estrutura de Arquivos](#estrutura-de-arquivos)
2. [Template Base](#template-base)
3. [Exemplo Completo](#exemplo-completo)
4. [Padrão CRUD](#padrão-crud)
5. [Componentes Recomendados](#componentes-recomendados)
6. [Hooks Customizados](#hooks-customizados)
7. [Roteamento](#roteamento)
8. [Checklist Final](#checklist-final)

---

## 📁 Estrutura de Arquivos

Ao criar uma nova página, siga esta estrutura:

```
pages/
└── my-feature/
    ├── index.tsx                    # Página principal
    ├── components/                  # Componentes específicos
    │   ├── MyFeatureHeader.tsx
    │   ├── MyFeatureFilters.tsx
    │   ├── MyFeatureList.tsx
    │   ├── MyFeatureCard.tsx
    │   ├── MyFeatureEmptyState.tsx
    │   └── MyFeatureErrorState.tsx
    ├── hooks/                       # Hooks customizados
    │   ├── useMyFeatureFilters.ts
    │   └── useMyFeatureSorting.ts
    └── types.ts                     # Types específicos (opcional)
```

---

## 🎨 Template Base

### 1. Página Principal (`index.tsx`)

```tsx
import { ViewDefault } from '@/layouts/ViewDefault';
import { Loading } from '@/components/Loading';
import { useMyFeature } from '@/hooks/useMyFeature';
import { MyFeatureHeader } from './components/MyFeatureHeader';
import { MyFeatureFilters } from './components/MyFeatureFilters';
import { MyFeatureList } from './components/MyFeatureList';
import { MyFeatureEmptyState } from './components/MyFeatureEmptyState';
import { MyFeatureErrorState } from './components/MyFeatureErrorState';

export function MyFeaturePage() {
  const { data, isLoading, error } = useMyFeature();

  if (isLoading) {
    return (
      <ViewDefault>
        <Loading />
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <MyFeatureErrorState error={error} />
      </ViewDefault>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ViewDefault>
        <MyFeatureHeader />
        <MyFeatureEmptyState />
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <MyFeatureHeader />
      <MyFeatureFilters />
      <MyFeatureList items={data} />
    </ViewDefault>
  );
}
```

### 2. Header Component

```tsx
// components/MyFeatureHeader.tsx
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MyFeatureHeaderProps {
  onCreate?: () => void;
}

export function MyFeatureHeader({ onCreate }: MyFeatureHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text dark:text-text-dark">
          Minha Feature
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gerencie seus itens</p>
      </div>
      {onCreate && (
        <Button onClick={onCreate} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      )}
    </div>
  );
}
```

### 3. Filters Component

```tsx
// components/MyFeatureFilters.tsx
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface MyFeatureFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function MyFeatureFilters({ searchTerm, onSearchChange }: MyFeatureFiltersProps) {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
}
```

### 4. List Component

```tsx
// components/MyFeatureList.tsx
import { RecordsGrid } from '@/components/ui/RecordsGrid';
import { MyFeatureCard } from './MyFeatureCard';

interface MyFeatureListProps {
  items: MyFeature[];
}

export function MyFeatureList({ items }: MyFeatureListProps) {
  return (
    <RecordsGrid columns={{ default: 1, md: 2, lg: 3 }} gap="md">
      {items.map((item) => (
        <MyFeatureCard key={item.id} item={item} />
      ))}
    </RecordsGrid>
  );
}
```

### 5. Card Component

```tsx
// components/MyFeatureCard.tsx
import { RecordCard } from '@/components/ui/RecordCard';

interface MyFeatureCardProps {
  item: MyFeature;
  onEdit?: (item: MyFeature) => void;
  onDelete?: (id: string) => void;
}

export function MyFeatureCard({ item, onEdit, onDelete }: MyFeatureCardProps) {
  return (
    <RecordCard
      onEdit={onEdit ? () => onEdit(item) : undefined}
      onDelete={onDelete ? () => onDelete(item.id) : undefined}
    >
      <div className="space-y-2">
        <h3 className="font-semibold text-text dark:text-text-dark">{item.name}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
      </div>
    </RecordCard>
  );
}
```

### 6. Empty State Component

```tsx
// components/MyFeatureEmptyState.tsx
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface MyFeatureEmptyStateProps {
  onCreate?: () => void;
}

export function MyFeatureEmptyState({ onCreate }: MyFeatureEmptyStateProps) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 dark:text-gray-400 mb-4">Nenhum item encontrado</p>
      {onCreate && (
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Primeiro Item
        </Button>
      )}
    </div>
  );
}
```

### 7. Error State Component

```tsx
// components/MyFeatureErrorState.tsx
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface MyFeatureErrorStateProps {
  error: Error | unknown;
  onRetry?: () => void;
}

export function MyFeatureErrorState({ error, onRetry }: MyFeatureErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar dados';

  return (
    <div className="text-center py-12">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <p className="text-red-500 mb-4">{errorMessage}</p>
      {onRetry && <Button onClick={onRetry}>Tentar Novamente</Button>}
    </div>
  );
}
```

---

## 🎯 Exemplo Completo: Página CRUD

### Hook de Dados

```tsx
// hooks/useMyFeature.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getItems, createItem, updateItem, deleteItem } from '@/services/myFeatureService';

export function useMyFeature() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['my-feature'],
    queryFn: getItems,
  });

  const createMutation = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-feature'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateItem }) => updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-feature'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-feature'] });
    },
  });

  return {
    items: data ?? [],
    isLoading,
    error,
    createItem: createMutation.mutate,
    updateItem: updateMutation.mutate,
    deleteItem: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
```

### Hook de Filtros

```tsx
// hooks/useMyFeatureFilters.ts
import { useState, useCallback, useMemo } from 'react';

export function useMyFeatureFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const filterItems = useCallback(
    (items: MyFeature[]) => {
      let filtered = items;

      if (searchTerm) {
        filtered = filtered.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      }

      if (filterType !== 'all') {
        filtered = filtered.filter((item) => item.type === filterType);
      }

      return filtered;
    },
    [searchTerm, filterType],
  );

  const hasActiveFilters = searchTerm !== '' || filterType !== 'all';

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filterItems,
    hasActiveFilters,
  };
}
```

### Hook de Ordenação

```tsx
// hooks/useMyFeatureSorting.ts
import { useSortable } from '@/hooks/useSortable';

export function useMyFeatureSorting() {
  const { sortConfig, handleSort, sortData } = useSortable({
    initialField: 'name',
    initialDirection: 'asc',
  });

  const sortItems = useCallback(
    (items: MyFeature[]) => {
      return sortData(items, (item, field) => {
        switch (field) {
          case 'name':
            return item.name;
          case 'createdAt':
            return new Date(item.createdAt);
          default:
            return item[field];
        }
      });
    },
    [sortData],
  );

  return {
    sortConfig,
    handleSort,
    sortItems,
  };
}
```

### Página Completa com CRUD

```tsx
// index.tsx
import { ViewDefault } from '@/layouts/ViewDefault';
import { Loading } from '@/components/Loading';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useMyFeature } from '@/hooks/useMyFeature';
import { useMyFeatureFilters } from './hooks/useMyFeatureFilters';
import { useMyFeatureSorting } from './hooks/useMyFeatureSorting';
import { MyFeatureHeader } from './components/MyFeatureHeader';
import { MyFeatureFilters } from './components/MyFeatureFilters';
import { MyFeatureList } from './components/MyFeatureList';
import { MyFeatureEmptyState } from './components/MyFeatureEmptyState';
import { MyFeatureErrorState } from './components/MyFeatureErrorState';
import { MyFeatureFormModal } from './components/MyFeatureFormModal';
import { useMemo, useState } from 'react';

export function MyFeaturePage() {
  const {
    items,
    isLoading,
    error,
    createItem,
    updateItem,
    deleteItem,
    isCreating,
    isUpdating,
    isDeleting,
  } = useMyFeature();

  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MyFeature | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { searchTerm, setSearchTerm, filterType, setFilterType, filterItems } =
    useMyFeatureFilters();

  const { sortConfig, handleSort, sortItems } = useMyFeatureSorting();

  const filteredAndSortedItems = useMemo(() => {
    const filtered = filterItems(items);
    return sortItems(filtered);
  }, [items, filterItems, sortItems]);

  const handleCreate = () => {
    setEditingItem(null);
    setShowFormModal(true);
  };

  const handleEdit = (item: MyFeature) => {
    setEditingItem(item);
    setShowFormModal(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteItem(deleteId);
      setShowConfirmDelete(false);
      setDeleteId(null);
    }
  };

  const handleSubmit = (data: CreateMyFeature) => {
    if (editingItem) {
      updateItem({ id: editingItem.id, data });
    } else {
      createItem(data);
    }
    setShowFormModal(false);
    setEditingItem(null);
  };

  if (isLoading) {
    return (
      <ViewDefault>
        <Loading />
      </ViewDefault>
    );
  }

  if (error) {
    return (
      <ViewDefault>
        <MyFeatureErrorState error={error} />
      </ViewDefault>
    );
  }

  return (
    <ViewDefault>
      <MyFeatureHeader onCreate={handleCreate} />

      {items.length === 0 ? (
        <MyFeatureEmptyState onCreate={handleCreate} />
      ) : (
        <>
          <MyFeatureFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterTypeChange={setFilterType}
          />

          <MyFeatureList
            items={filteredAndSortedItems}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            isUpdating={isUpdating}
            isDeleting={isDeleting}
          />
        </>
      )}

      <MyFeatureFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingItem}
        isLoading={isCreating || isUpdating}
      />

      <ConfirmModal
        isOpen={showConfirmDelete}
        onClose={() => {
          setShowConfirmDelete(false);
          setDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este item?"
        isLoading={isDeleting}
      />
    </ViewDefault>
  );
}
```

---

## 🛣️ Adicionando Rota

```tsx
// routes/index.tsx
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ViewDefault } from '@/layouts/ViewDefault';

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

---

## ✅ Checklist Final

Antes de considerar a página completa, verifique:

### Estrutura

- [ ] Página criada em `pages/[feature]/index.tsx`
- [ ] Componentes separados em `components/`
- [ ] Hooks customizados em `hooks/`
- [ ] Types definidos (se necessário)

### Funcionalidade

- [ ] Usa `ViewDefault` como wrapper
- [ ] Estados de loading tratados
- [ ] Estados de erro tratados
- [ ] Empty state implementado
- [ ] Filtros funcionando
- [ ] Ordenação funcionando (se aplicável)
- [ ] CRUD completo (se aplicável)

### UI/UX

- [ ] Responsivo (mobile-first)
- [ ] Touch targets ≥ 44x44px
- [ ] Suporta tema escuro
- [ ] Acessível (ARIA labels, navegação por teclado)
- [ ] Loading states visíveis
- [ ] Feedback de ações (toast/notificações)

### Código

- [ ] TypeScript sem erros
- [ ] ESLint sem erros
- [ ] Imports organizados
- [ ] Código limpo e legível
- [ ] Comentários quando necessário

### Roteamento

- [ ] Rota adicionada em `routes/index.tsx`
- [ ] Lazy loading configurado
- [ ] Navegação funcionando

---

## 📚 Recursos Adicionais

- [Arquitetura do Projeto](./ARCHITECTURE.md)
- [Design System](./DESIGN_SYSTEM.md)
- [Guia Mobile-First](./MOBILE_FIRST_GUIDE.md)

---

**Última atualização**: 2025-01-02
