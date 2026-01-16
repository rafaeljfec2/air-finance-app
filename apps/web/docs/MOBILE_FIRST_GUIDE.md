# Guia Mobile-First - Air Finance

## 📱 O que é Mobile-First?

Mobile-First é uma abordagem de design onde você **começa projetando para dispositivos móveis primeiro** e depois expande para telas maiores (tablets, desktops). Isso garante uma experiência excelente em dispositivos móveis, que são a maioria dos usuários.

## ✅ Status Atual

O projeto **já está usando Tailwind CSS**, que é mobile-first por padrão. Isso significa:

- ✅ Classes base (sem prefixo) = mobile
- ✅ Breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) = expansões progressivas
- ✅ Viewport meta tag configurado corretamente

## 🎯 Breakpoints do Tailwind (Padrão)

```javascript
sm:  '640px'   // Small devices (landscape phones)
md:  '768px'   // Medium devices (tablets)
lg:  '1024px'  // Large devices (desktops)
xl:  '1280px'  // Extra large devices
2xl: '1536px'  // 2x Extra large devices
```

## 📐 Princípios Mobile-First

### 1. **Comece com Mobile (Base)**

Sempre defina estilos para mobile primeiro (sem prefixo), depois adicione breakpoints:

```tsx
// ✅ CORRETO (Mobile-First)
<div className="text-base md:text-lg lg:text-xl">
  Texto que começa pequeno no mobile
</div>

// ❌ ERRADO (Desktop-First)
<div className="text-xl md:text-lg sm:text-base">
  Texto que começa grande e diminui
</div>
```

### 2. **Grids e Layouts**

```tsx
// ✅ CORRETO: 1 coluna no mobile, expande para desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// ❌ ERRADO: 3 colunas no mobile (muito apertado)
<div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
```

### 3. **Espaçamento Progressivo**

```tsx
// ✅ CORRETO: padding pequeno no mobile, maior no desktop
<div className="p-4 md:p-6 lg:p-8">

// ❌ ERRADO: padding grande no mobile
<div className="p-8 md:p-6 sm:p-4">
```

### 4. **Tipografia Escalável**

```tsx
// ✅ CORRETO: texto menor no mobile
<h1 className="text-3xl md:text-4xl lg:text-5xl">

// ❌ ERRADO: texto grande demais no mobile
<h1 className="text-5xl md:text-4xl sm:text-3xl">
```

### 5. **Navegação Mobile**

```tsx
// ✅ CORRETO: menu hambúrguer no mobile, menu completo no desktop
<nav className="hidden md:flex">
  {/* Menu desktop */}
</nav>
<button className="md:hidden">
  {/* Botão hambúrguer mobile */}
</button>
```

## 🔍 Padrões Atuais no Projeto

### Layout Principal (ViewDefault)

```tsx
// ✅ Mobile-First
<main className="p-4 sm:p-6 lg:pl-8">
  {/* Padding começa pequeno (p-4), cresce progressivamente */}
</main>
```

### Hero Section (Landing)

```tsx
// ✅ Mobile-First
<h1 className="text-5xl md:text-7xl">
  {/* Texto grande mas ainda legível no mobile (5xl) */}
</h1>

<div className="grid md:grid-cols-2">
  {/* 1 coluna no mobile, 2 no tablet+ */}
</div>
```

### TransactionGrid

```tsx
// ✅ Mobile-First
<div className="hidden md:block">
  {/* Tabela desktop */}
</div>
<div className="md:hidden">
  {/* Cards mobile */}
</div>
```

## 🛠️ Checklist para Novos Componentes

Ao criar um novo componente, pergunte-se:

- [ ] **Padding/Spacing**: Começou pequeno e expandiu?

  - ✅ `p-4 md:p-6 lg:p-8`
  - ❌ `p-8 md:p-6`

- [ ] **Grid/Layout**: 1 coluna no mobile?

  - ✅ `grid-cols-1 md:grid-cols-2`
  - ❌ `grid-cols-3 md:grid-cols-1`

- [ ] **Tipografia**: Tamanho legível no mobile?

  - ✅ `text-base md:text-lg`
  - ❌ `text-2xl md:text-base`

- [ ] **Navegação**: Funciona bem em mobile?

  - ✅ Menu hambúrguer ou bottom navigation
  - ❌ Menu horizontal complexo no mobile

- [ ] **Botões/Touch Targets**: ≥ 44x44px?

  - ✅ `p-3` ou maior (mínimo 44px)
  - ❌ `p-1` (muito pequeno para touch)

- [ ] **Formulários**: Campos grandes e fáceis de preencher?

  - ✅ `w-full` no mobile, `max-w-md` no desktop
  - ❌ Largura fixa pequena

- [ ] **Imagens**: Responsivas?
  - ✅ `w-full h-auto`
  - ❌ `w-[800px]` (fixo)

## 📱 Testando Mobile-First

### 1. Chrome DevTools

1. Abra DevTools (F12)
2. Clique no ícone de dispositivo (Ctrl+Shift+M)
3. Teste em diferentes tamanhos:
   - Mobile: 375px (iPhone)
   - Tablet: 768px (iPad)
   - Desktop: 1280px+

### 2. Breakpoints para Testar

```
Mobile:     320px - 639px  (sem prefixo)
Small:      640px - 767px  (sm:)
Medium:     768px - 1023px (md:)
Large:      1024px - 1279px (lg:)
Extra Large: 1280px+        (xl:)
```

### 3. Verificações Importantes

- ✅ Texto legível sem zoom
- ✅ Botões fáceis de clicar (≥44px)
- ✅ Sem scroll horizontal
- ✅ Formulários funcionam bem
- ✅ Navegação acessível
- ✅ Imagens não quebram layout
- ✅ Cards/Grids não ficam muito apertados

## 🎨 Exemplos Práticos

### Card Component

```tsx
// ✅ Mobile-First Card
<div
  className="
  w-full
  p-4 md:p-6
  rounded-lg
  border
  space-y-4
"
>
  <h3 className="text-lg md:text-xl font-bold">Título</h3>
  <p className="text-sm md:text-base">Descrição</p>
  <button
    className="
    w-full md:w-auto
    px-4 py-3
    text-sm md:text-base
  "
  >
    Ação
  </button>
</div>
```

### Form Component

```tsx
// ✅ Mobile-First Form
<form className="space-y-4 md:space-y-6">
  <div>
    <label className="block text-sm md:text-base mb-2">Nome</label>
    <input
      className="
        w-full
        px-4 py-3
        text-base
        rounded-md
        border
      "
      type="text"
    />
  </div>

  <button
    className="
    w-full md:w-auto
    px-6 py-3
    text-base
  "
  >
    Enviar
  </button>
</form>
```

### Navigation

```tsx
// ✅ Mobile-First Navigation
<nav>
  {/* Mobile: Hamburger Menu */}
  <button className="md:hidden p-2">
    <MenuIcon />
  </button>

  {/* Desktop: Full Menu */}
  <div className="hidden md:flex space-x-4">
    <a>Item 1</a>
    <a>Item 2</a>
  </div>
</nav>
```

## 🚀 Melhorias Recomendadas

### 1. Configurar Breakpoints Customizados (Opcional)

Se precisar de breakpoints específicos, adicione no `tailwind.config.js`:

```javascript
theme: {
  screens: {
    'xs': '475px',
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  },
}
```

### 2. Utilities Úteis

```css
/* Adicione ao index.css se necessário */
@layer utilities {
  .touch-target {
    min-width: 44px;
    min-height: 44px;
  }
}
```

### 3. Considerações de Performance

- ✅ Imagens: Use `loading="lazy"` para imagens abaixo da dobra
- ✅ Fontes: Carregue apenas pesos necessários
- ✅ JavaScript: Lazy load de componentes pesados
- ✅ CSS: Tailwind já purga automaticamente

## 📚 Recursos

- [Tailwind CSS Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Mobile-First Design Guide](https://web.dev/responsive-web-design-basics/)
- [Touch Target Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/target-size.html)

## ✅ Checklist Geral

Ao desenvolver, verifique:

- [ ] Componentes começam com estilos mobile (sem prefixo)
- [ ] Breakpoints expandem progressivamente (`sm:` → `md:` → `lg:`)
- [ ] Texto legível em telas pequenas (mínimo 16px)
- [ ] Touch targets ≥ 44x44px
- [ ] Sem scroll horizontal no mobile
- [ ] Grids começam com 1 coluna
- [ ] Padding/spacing começa pequeno
- [ ] Navegação funciona bem no mobile
- [ ] Formulários são fáceis de usar no mobile
- [ ] Testado em diferentes tamanhos de tela

---

**Última atualização**: 2025-01-02
