# Mobile-First Guide -- Air Finance

All UI in the Air Finance project is designed mobile-first: base styles target small viewports, and responsive breakpoints progressively enhance for larger screens.

## Tailwind breakpoints

```
(no prefix)  0px+     Mobile (base)
sm:          640px    Landscape phones
md:          768px    Tablets
lg:          1024px   Desktops
xl:          1280px   Large desktops
2xl:         1536px   Extra large
```

## Core principles

### 1. Start with mobile, expand upward

```tsx
// Correct (mobile-first)
<div className="p-4 md:p-6 lg:p-8">

// Wrong (desktop-first)
<div className="p-8 md:p-6 sm:p-4">
```

### 2. Grids start at 1 column

```tsx
// Correct
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Wrong
<div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
```

### 3. Progressive spacing

```tsx
<div className="p-4 md:p-6 lg:p-8">          // Padding
<div className="gap-3 md:gap-4 lg:gap-6">    // Grid gap
<div className="space-y-4 md:space-y-6">     // Vertical spacing
```

### 4. Responsive typography

```tsx
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
<p className="text-base md:text-lg">
```

### 5. Navigation

```tsx
// Mobile: hamburger menu or bottom nav
<nav className="hidden md:flex">Desktop menu</nav>
<button className="md:hidden">Menu icon</button>
```

## Existing patterns in the project

### ViewDefault layout

- **Desktop (lg+)**: Fixed sidebar + scrollable content
- **Mobile (< lg)**: Sidebar as overlay drawer, `MobileBottomNav` for primary actions
- Header visibility toggle with persisted preference

### Responsive table/card pattern

```tsx
{/* Desktop: full table */}
<div className="hidden md:block"><table>...</table></div>

{/* Mobile: card list */}
<div className="md:hidden"><RecordsGrid columns={{ default: 1 }}>...</RecordsGrid></div>
```

## Touch targets

All interactive elements must be at least 44x44px:

```tsx
<button className="p-3 min-w-[44px] min-h-[44px]">
  <Icon className="h-5 w-5" />
</button>
```

## Forms on mobile

- Use `w-full` for inputs on mobile, constrain on desktop (`max-w-md md:max-w-lg`)
- Use `inputMode="decimal"` for monetary fields (opens numeric keyboard)
- Stack form fields vertically; go side-by-side only at `md:` or larger

## Testing checklist

### Using Chrome DevTools

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test at these widths:
   - **Mobile**: 375px (iPhone SE)
   - **Tablet**: 768px (iPad)
   - **Desktop**: 1280px+

### Verify

- [ ] Text readable without zoom (min 16px)
- [ ] Touch targets >= 44x44px
- [ ] No horizontal scrollbar on mobile
- [ ] Grids start with 1 column on mobile
- [ ] Padding/spacing starts small on mobile
- [ ] Navigation works on mobile (hamburger or bottom nav)
- [ ] Forms are easy to fill on mobile
- [ ] Images do not break layout

## Common mistakes

| Mistake | Fix |
| --- | --- |
| `p-8 md:p-4` | `p-4 md:p-6 lg:p-8` |
| `grid-cols-3` without base | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| Fixed width elements | `w-full md:w-auto` or `max-w-md` |
| Icon buttons without padding | `p-3 min-w-[44px] min-h-[44px]` |
| Text too large on mobile | Start with `text-base` or `text-lg`, scale up with `md:` |

## Performance on mobile

- Use `loading="lazy"` on below-the-fold images
- Lazy-load routes with `React.lazy()`
- Virtualize long lists with `react-window`
- Tailwind purges unused CSS in production builds

## Related docs

- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) -- colors, typography, breakpoints
- [FRONTEND_ARCHITECTURE.md](./FRONTEND_ARCHITECTURE.md) -- safe areas, layout details
- [CREATING_PAGES.md](./CREATING_PAGES.md) -- page templates with responsive patterns
