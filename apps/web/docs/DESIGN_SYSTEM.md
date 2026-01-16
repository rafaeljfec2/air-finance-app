# Design System - Air Finance

## 🎨 Visão Geral

O Design System do Air Finance fornece componentes, padrões e diretrizes para criar interfaces consistentes e acessíveis.

---

## 🎨 Paleta de Cores

### Cores Primárias (Verde)

```tsx
primary-50:  '#f0faf5'
primary-100: '#d5f1e3'
primary-200: '#8CCFB0'  // Cor da folha (brand leaf)
primary-300: '#70c299'
primary-400: '#4aaf7d'
primary-500: '#2D6B4E'  // Cor principal (brand arrow)
primary-600: '#25573f'
primary-700: '#1d4331'
primary-800: '#152f23'
primary-900: '#0c1a14'
```

### Cores Semânticas

#### Tema Claro
```tsx
background: '#F8FAF9'      // Fundo principal
card: '#FFFFFF'            // Fundo de cards
text: '#1A2825'            // Texto principal
border: '#E8EFEC'          // Bordas
muted: '#6B7280'           // Texto secundário
```

#### Tema Escuro
```tsx
background-dark: '#111827'
card-dark: '#1f2937'
text-dark: '#f9fafb'
border-dark: '#374151'
muted-dark: '#9CA3AF'
```

### Cores de Status

```tsx
// Sucesso
success: '#10b981'         // Verde
success-light: '#d1fae5'

// Erro
error: '#ef4444'           // Vermelho
error-light: '#fee2e2'

// Aviso
warning: '#f59e0b'         // Laranja
warning-light: '#fef3c7'

// Info
info: '#3b82f6'            // Azul
info-light: '#dbeafe'
```

### Uso em Tailwind

```tsx
// Classes Tailwind
className="bg-primary-500 text-white"
className="bg-card dark:bg-card-dark"
className="text-text dark:text-text-dark"
className="border-border dark:border-border-dark"
```

---

## 📝 Tipografia

### Escala de Tamanhos

```tsx
// Títulos
text-3xl  // 30px - H1 Mobile
text-4xl  // 36px - H1 Tablet
text-5xl  // 48px - H1 Desktop

text-2xl  // 24px - H2 Mobile
text-3xl  // 30px - H2 Tablet
text-4xl  // 36px - H2 Desktop

text-xl   // 20px - H3 Mobile
text-2xl  // 24px - H3 Tablet
text-3xl  // 30px - H3 Desktop

// Corpo
text-base // 16px - Padrão
text-lg   // 18px - Destaque
text-sm   // 14px - Secundário
text-xs   // 12px - Pequeno
```

### Pesos de Fonte

```tsx
font-light    // 300
font-normal   // 400
font-medium   // 500
font-semibold // 600
font-bold     // 700
```

### Exemplo de Uso

```tsx
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text dark:text-text-dark">
  Título Principal
</h1>

<p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
  Parágrafo de texto padrão
</p>

<span className="text-sm text-muted-foreground">
  Texto secundário
</span>
```

---

## 📏 Espaçamento

### Sistema de Espaçamento (Tailwind)

```tsx
// Padding/Margin
p-1  // 4px
p-2  // 8px
p-3  // 12px
p-4  // 16px
p-6  // 24px
p-8  // 32px

// Gap (Grid/Flex)
gap-2  // 8px
gap-3  // 12px
gap-4  // 16px
gap-6  // 24px
gap-8  // 32px

// Espaçamento Vertical
space-y-2  // 8px entre filhos
space-y-4  // 16px entre filhos
space-y-6  // 24px entre filhos
```

### Padrões Mobile-First

```tsx
// Padding progressivo
className="p-4 md:p-6 lg:p-8"

// Gap progressivo
className="gap-3 md:gap-4 lg:gap-6"

// Espaçamento vertical
className="space-y-4 md:space-y-6"
```

---

## 🧱 Componentes Base

### Button

```tsx
import { Button } from '@/components/ui/button';

// Variantes
<Button variant="default">Padrão</Button>
<Button variant="outline">Outline</Button>
<Button variant="danger">Danger</Button>
<Button variant="ghost">Ghost</Button>

// Tamanhos
<Button size="sm">Pequeno</Button>
<Button size="md">Médio (padrão)</Button>
<Button size="lg">Grande</Button>

// Estados
<Button disabled>Desabilitado</Button>
<Button isLoading>Carregando...</Button>
```

### Input

```tsx
import { Input } from '@/components/ui/input';

<Input
  type="text"
  placeholder="Digite aqui..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className="w-full"
/>
```

### Card

```tsx
import { Card } from '@/components/ui/card';

<Card className="p-4">
  <CardTitle>Título do Card</CardTitle>
  <CardContent>Conteúdo do card</CardContent>
</Card>
```

### Badge

```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="default">Padrão</Badge>
<Badge variant="success">Sucesso</Badge>
<Badge variant="destructive">Erro</Badge>
<Badge variant="outline">Outline</Badge>
```

### Modal

```tsx
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título do Modal"
>
  Conteúdo do modal
</Modal>
```

---

## 📐 Layout Patterns

### Container Principal

```tsx
// Todas as páginas devem usar ViewDefault
import { ViewDefault } from '@/layouts/ViewDefault';

export function MyPage() {
  return (
    <ViewDefault>
      {/* Conteúdo da página */}
    </ViewDefault>
  );
}
```

### Header de Página

```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  <h1 className="text-2xl md:text-3xl font-bold text-text dark:text-text-dark">
    Título da Página
  </h1>
  <Button>Nova Ação</Button>
</div>
```

### Grid de Registros

```tsx
import { RecordsGrid } from '@/components/ui/RecordsGrid';
import { RecordCard } from '@/components/ui/RecordCard';

<RecordsGrid columns={{ default: 1, md: 2, lg: 3 }} gap="md">
  {items.map(item => (
    <RecordCard
      key={item.id}
      onEdit={() => handleEdit(item)}
      onDelete={() => handleDelete(item.id)}
    >
      {/* Conteúdo do card */}
    </RecordCard>
  ))}
</RecordsGrid>
```

### Tabela Responsiva

```tsx
// Desktop: Tabela completa
<div className="hidden md:block overflow-x-auto">
  <table className="w-full">
    <thead>
      <tr>
        <SortableColumn field="name" currentSort={sortConfig} onSort={handleSort}>
          Nome
        </SortableColumn>
      </tr>
    </thead>
    <tbody>
      {/* Linhas da tabela */}
    </tbody>
  </table>
</div>

// Mobile: Cards
<div className="md:hidden">
  <RecordsGrid columns={{ default: 1 }}>
    {items.map(item => (
      <ItemCard key={item.id} item={item} />
    ))}
  </RecordsGrid>
</div>
```

---

## 🎯 Estados de UI

### Loading

```tsx
import { Loading } from '@/components/Loading';

{isLoading && <Loading />}

// Ou inline
<Button isLoading={isLoading}>Salvar</Button>
```

### Empty State

```tsx
<div className="text-center py-12">
  <p className="text-gray-500 dark:text-gray-400 mb-4">
    Nenhum item encontrado
  </p>
  <Button onClick={handleCreate}>Criar Primeiro Item</Button>
</div>
```

### Error State

```tsx
<div className="text-center py-12">
  <p className="text-red-500 mb-4">
    Erro ao carregar dados
  </p>
  <Button onClick={handleRetry}>Tentar Novamente</Button>
</div>
```

---

## 📱 Responsividade

### Breakpoints

```tsx
sm:  '640px'   // Landscape phones
md:  '768px'   // Tablets
lg:  '1024px'  // Desktops
xl:  '1280px'  // Large desktops
2xl: '1536px'  // Extra large
```

### Padrões Mobile-First

```tsx
// ✅ CORRETO: Começa mobile, expande
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
<div className="p-4 md:p-6 lg:p-8">
<div className="text-base md:text-lg lg:text-xl">

// ❌ ERRADO: Começa desktop, reduz
<div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
```

### Ocultar/Mostrar por Breakpoint

```tsx
// Mostrar apenas no desktop
<div className="hidden md:block">Desktop Only</div>

// Mostrar apenas no mobile
<div className="md:hidden">Mobile Only</div>
```

---

## ♿ Acessibilidade

### Requisitos Mínimos

- **Touch Targets**: Mínimo 44x44px
- **Contraste**: Mínimo 4.5:1 para texto normal
- **Navegação por Teclado**: Todos os elementos interativos devem ser acessíveis
- **ARIA Labels**: Elementos interativos devem ter labels descritivos

### Exemplos

```tsx
// Botão acessível
<button
  onClick={handleClick}
  aria-label="Adicionar nova empresa"
  className="p-3 min-w-[44px] min-h-[44px]"
>
  <PlusIcon />
</button>

// Input acessível
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-error"
/>
```

---

## 🎨 Sombras e Efeitos

### Sombras

```tsx
shadow-sm    // Sombra pequena
shadow       // Sombra padrão
shadow-md    // Sombra média
shadow-lg    // Sombra grande
shadow-xl    // Sombra extra grande
```

### Transições

```tsx
transition-all duration-200        // Transição suave
transition-colors duration-300    // Apenas cores
hover:shadow-lg                    // Sombra no hover
```

### Exemplo

```tsx
<Card className="hover:shadow-lg transition-shadow duration-200">
  {/* Conteúdo */}
</Card>
```

---

## 📊 Ícones

### Biblioteca: Lucide React

```tsx
import { Plus, Edit, Trash2, Search } from 'lucide-react';

<Plus className="h-5 w-5" />
<Edit className="h-4 w-4" />
```

### Tamanhos Padrão

```tsx
h-3 w-3  // 12px - Muito pequeno
h-4 w-4  // 16px - Pequeno
h-5 w-5  // 20px - Padrão
h-6 w-6  // 24px - Médio
h-8 w-8  // 32px - Grande
```

---

## 🎭 Animações

### Loading Spinner

```tsx
<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
```

### Fade In

```tsx
<div className="animate-fade-in">
  {/* Conteúdo */}
</div>
```

### Transições de Página

```tsx
<div className="transition-all duration-300 ease-in-out">
  {/* Conteúdo */}
</div>
```

---

## 📋 Checklist de Design

Ao criar um novo componente, verifique:

- [ ] Usa cores do design system
- [ ] Responsivo (mobile-first)
- [ ] Touch targets ≥ 44x44px
- [ ] Suporta tema escuro
- [ ] Acessível (ARIA labels, navegação por teclado)
- [ ] Estados de loading/error tratados
- [ ] Transições suaves
- [ ] Consistente com outros componentes

---

**Última atualização**: 2025-01-02
