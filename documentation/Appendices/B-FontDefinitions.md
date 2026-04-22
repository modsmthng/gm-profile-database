# Typography

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Font Family

### 1.1 Primary Font

| Property | Value |
|----------|-------|
| Family | Montserrat |
| Source | Google Fonts |
| Weights | 400, 700 |

### 1.2 Import

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
```

### 1.3 Usage

| Element | Weight |
|---------|--------|
| Body text | 400 |
| Headings | 700 |
| Logo | 700 |
| Buttons | 400-700 |

### 1.4 Fallback

```css
font-family: 'Montserrat', system-ui, -apple-system, sans-serif;
```

## 2. Font Scale

### 2.1 Size Scale

| Token | Size | rem | px | Usage |
|-------|------|-----|-----|--------|
| `text-xs` | xs | 0.75rem | 12px | Captions |
| `text-sm` | sm | 0.875rem | 14px | Small text |
| `text-base` | base | 1rem | 16px | Body |
| `text-lg` | lg | 1.125rem | 18px | Large body |
| `text-xl` | xl | 1.25rem | 20px | H3 |
| `text-2xl` | 2xl | 1.5rem | 24px | H2, Logo |
| `text-3xl` | 3xl | 1.875rem | 30px | H1 |
| `text-4xl` | 4xl | 2.25rem | 36px | Hero |

### 2.2 Line Heights

| Token | Value | Usage |
|-------|-------|--------|
| `leading-none` | 1 | Headings |
| `leading-tight` | 1.25 | Subheadings |
| `leading-normal` | 1.5 | Body |
| `leading-relaxed` | 1.75 | Long text |

### 2.3 Letter Spacing

| Token | Value | Usage |
|-------|-------|--------|
| `tracking-tighter` | -0.05em | Large headings |
| `tracking-tight` | -0.025em | Headings |
| `tracking-normal` | 0 | Body |
| `tracking-wide` | 0.025em | Caps |

## 3. Headings

### 3.1 H1

```css
h1, .h1 {
  font-size: 1.875rem;  /* 30px */
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.025em;
}
```

### 3.2 H2

```css
h2, .h2 {
  font-size: 1.5rem;  /* 24px */
  font-weight: 700;
  line-height: 1.2;
}
```

### 3.3 H3

```css
h3, .h3 {
  font-size: 1.25rem;  /* 20px */
  font-weight: 700;
  line-height: 1.3;
}
```

## 4. Body Text

### 4.1 Paragraph

```css
p, .prose {
  font-size: 1rem;  /* 16px */
  font-weight: 400;
  line-height: 1.6;
}
```

### 4.2 Lead Paragraph

```css
.lead {
  font-size: 1.125rem;  /* 18px */
  line-height: 1.6;
}
```

### 4.3 Small

```css
small, .text-sm {
  font-size: 0.875rem;  /* 14px */
  line-height: 1.4;
}
```

## 5. Navigation

### 5.1 Logo

```css
.logo {
  font-size: 1.5rem;  /* 24px */
  font-weight: 700;
  font-family: 'Montserrat', sans-serif;
}
```

### 5.2 Navigation Links

```css
.nav-link {
  font-size: 0.875rem;  /* 14px */
  font-weight: 400;
}
```

## 6. Buttons

### 6.1 Primary Button

```css
.btn-primary {
  font-size: 0.875rem;  /* 14px */
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### 6.2 Secondary Button

```css
.btn-secondary {
  font-size: 0.875rem;  /* 14px */
  font-weight: 400;
}
```

## 7. Cards

### 7.1 Card Title

```css
.card-title {
  font-size: 1.125rem;  /* 18px */
  font-weight: 700;
  line-height: 1.3;
}
```

### 7.2 Card Meta

```css
.card-meta {
  font-size: 0.875rem;  /* 14px */
  font-weight: 400;
  color: var(--color-base-content) / 0.7;
}
```

### 7.3 Card Description

```css
.card-description {
  font-size: 0.875rem;  /* 14px */
  font-weight: 400;
  line-height: 1.5;
}
```

## 8. Badges

### 8.1 Badge Text

```css
.badge {
  font-size: 0.75rem;  /* 12px */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

## 9. Tables

### 9.1 Table Header

```css
.table-header {
  font-size: 0.75rem;  /* 12px */
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

### 9.2 Table Cell

```css
.table-cell {
  font-size: 0.875rem;  /* 14px */
  font-weight: 400;
}
```

## 10. Code

### 10.1 Inline Code

```css
code {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace;
  font-size: 0.875em;  /* 14px equivalent */
}
```

### 10.2 Code Block

```css
pre, .code-block {
  font-family: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, monospace;
  font-size: 0.8125rem;  /* 13px */
  line-height: 1.5;
}
```

## 11. Responsive Typography

### 11.1 Mobile (< 640px)

| Element | Size |
|---------|------|
| H1 | 1.5rem |
| H2 | 1.25rem |
| Logo | 1.25rem |

### 11.2 Desktop (>= 640px)

| Element | Size |
|---------|------|
| H1 | 1.875rem |
| H2 | 1.5rem |
| Logo | 1.5rem |

## 12. Accessibility

### 12.1 Minimum Contrast

| Element | Ratio | WCAG Level |
|---------|-------|-----------|
| Text | 4.5:1 | AA |
| Large text | 3:1 | AA |
| UI components | 3:1 | AA |

### 12.2 Line Length

| Element | Max Characters |
|---------|----------------|
| Body | 75-85 |
| Headings | 60 |

### 12.3 Touch Targets

Minimum: 44x44px