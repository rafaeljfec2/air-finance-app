# Design System -- Air Finance

Visual language, tokens, and component patterns for the Air Finance web app.

## Color palette

### Primary (green)

```
primary-50:  #f0faf5
primary-100: #d5f1e3
primary-200: #8CCFB0   (brand leaf)
primary-300: #70c299
primary-400: #4aaf7d
primary-500: #2D6B4E   (brand arrow / main)
primary-600: #25573f
primary-700: #1d4331
primary-800: #152f23
primary-900: #0c1a14
```

### Semantic colors (light theme)

```
background: #F8FAF9
card:       #FFFFFF
text:       #1A2825
border:     #E8EFEC
muted:      #6B7280
```

### Semantic colors (dark theme)

```
background-dark: #111827
card-dark:       #1f2937
text-dark:       #f9fafb
border-dark:     #374151
muted-dark:      #9CA3AF
```

### Status colors

```
success: #10b981     success-light: #d1fae5
error:   #ef4444     error-light:   #fee2e2
warning: #f59e0b     warning-light: #fef3c7
info:    #3b82f6     info-light:    #dbeafe
```

### Tailwind usage

```tsx
className="bg-primary-500 text-white"
className="bg-card dark:bg-card-dark"
className="text-text dark:text-text-dark"
className="border-border dark:border-border-dark"
```

## Typography

### Scale (mobile-first)

| Role | Mobile | Tablet | Desktop |
| --- | --- | --- | --- |
| H1 | `text-3xl` | `md:text-4xl` | `lg:text-5xl` |
| H2 | `text-2xl` | `md:text-3xl` | `lg:text-4xl` |
| H3 | `text-xl` | `md:text-2xl` | `lg:text-3xl` |
| Body | `text-base` | `md:text-lg` | -- |
| Secondary | `text-sm` | `md:text-base` | -- |
| Small | `text-xs` | -- | -- |

### Weights

```
font-light:    300
font-normal:   400
font-medium:   500
font-semibold: 600
font-bold:     700
```

## Spacing

### Mobile-first progressive spacing

```tsx
className="p-4 md:p-6 lg:p-8"           // Padding
className="gap-3 md:gap-4 lg:gap-6"     // Grid/flex gap
className="space-y-4 md:space-y-6"      // Vertical spacing
```

### Card padding

```tsx
className="p-3 sm:p-4 md:p-6"
```

## Breakpoints

```
sm:  640px    (landscape phones)
md:  768px    (tablets)
lg:  1024px   (desktops)
xl:  1280px   (large desktops)
2xl: 1536px   (extra large)
```

## UI components

### Button (`components/ui/button`)

Variants: `default`, `outline`, `ghost`, `destructive`, `success`
Sizes: `sm`, `md`, `lg` (all min-height 44px)

```tsx
<Button variant="default" size="md">Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="destructive">Delete</Button>
<Button isLoading>Saving...</Button>
```

### Input (`components/ui/input`)

Min-height 44px. Dark mode support. Focus and disabled states.

```tsx
<Input type="text" placeholder="Search..." value={value} onChange={onChange} />
```

### Card (`components/ui/card`)

```tsx
<Card>
  <CardHeader><CardTitle>Title</CardTitle></CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Actions</CardFooter>
</Card>
```

### Badge (`components/ui/badge`)

Variants: `default`, `secondary`, `destructive`, `outline`, `success`

### Modal (`components/ui/Modal`)

```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Title">
  Content
</Modal>
```

### RecordsGrid (`components/ui/RecordsGrid`)

Responsive grid for record listings.

```tsx
<RecordsGrid columns={{ default: 1, md: 2, lg: 3, xl: 4 }} gap="md">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</RecordsGrid>
```

### RecordCard (`components/ui/RecordCard`)

Card with built-in edit/delete action buttons and loading states.

### SortableColumn (`components/ui/SortableColumn`)

Clickable table header with sort direction indicator.

## Layout patterns

### Page header

```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
  <h1 className="text-2xl md:text-3xl font-bold text-text dark:text-text-dark">
    Page Title
  </h1>
  <Button>Action</Button>
</div>
```

### Responsive table/card switch

```tsx
{/* Desktop: table */}
<div className="hidden md:block overflow-x-auto">
  <table className="w-full">...</table>
</div>

{/* Mobile: cards */}
<div className="md:hidden">
  <RecordsGrid columns={{ default: 1 }}>...</RecordsGrid>
</div>
```

## UI states

Every data-driven component must handle:

1. **Loading**: spinner or skeleton
2. **Error**: error message with optional retry button
3. **Empty**: illustration/icon with descriptive text and optional create action

## Icons

Library: **lucide-react**

Standard sizes:

```
h-3 w-3   (12px)
h-4 w-4   (16px)
h-5 w-5   (20px, default)
h-6 w-6   (24px)
h-8 w-8   (32px)
```

## Accessibility

- Touch targets: minimum 44x44px (`min-w-[44px] min-h-[44px]`)
- Color contrast: minimum 4.5:1 for normal text
- Semantic elements: `<button>`, `<nav>`, `<main>`
- `aria-label` on icon-only buttons
- Keyboard navigation support on all interactive elements

## Effects

### Shadows

```
shadow-sm  shadow  shadow-md  shadow-lg  shadow-xl
```

### Transitions

```tsx
className="transition-colors duration-200"
className="transition-all duration-300 ease-in-out"
className="hover:shadow-lg transition-shadow duration-200"
```

### Borders

```
rounded-sm (2px)  rounded (4px)  rounded-md (6px)  rounded-lg (8px)  rounded-xl (12px)
```

## Design checklist

- [ ] Uses design system colors (no hardcoded hex)
- [ ] Mobile-first responsive (`base` -> `sm:` -> `md:` -> `lg:`)
- [ ] Touch targets >= 44x44px
- [ ] Dark mode support (`dark:` variants on all color classes)
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] Loading, error, empty states handled
- [ ] Smooth transitions on interactive elements
- [ ] Consistent with existing components
