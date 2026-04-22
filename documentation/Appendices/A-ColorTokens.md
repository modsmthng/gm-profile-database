# Color Tokens

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. DaisyUI Color System

The application uses DaisyUI's color system with CSS variables.

## 2. Light Theme

```css
:root,
[data-theme='light'] {
  /* Base Colors */
  --color-base-100: oklch(100% 0 0);
  --color-base-200: oklch(97.466% 0.011 259.822);
  --color-base-300: oklch(93.268% 0.016 262.751);
  --color-base-content: oklch(41.886% 0.053 255.824);

  /* Primary */
  --color-primary: oklch(56.86% 0.255 257.57);
  --color-primary-content: oklch(91.372% 0.051 257.57);

  /* Secondary */
  --color-secondary: oklch(42.551% 0.161 282.339);
  --color-secondary-content: oklch(88.51% 0.032 282.339);

  /* Accent */
  --color-accent: oklch(59.939% 0.191 335.171);
  --color-accent-content: oklch(11.988% 0.038 335.171);

  /* Neutral */
  --color-neutral: oklch(19.616% 0.063 257.651);
  --color-neutral-content: oklch(83.923% 0.012 257.651);

  /* Status Colors */
  --color-info: oklch(88.127% 0.085 214.515);
  --color-info-content: oklch(17.625% 0.017 214.515);
  --color-success: oklch(80.494% 0.077 197.823);
  --color-success-content: oklch(16.098% 0.015 197.823);
  --color-warning: oklch(92% 0.12 95.746);
  --color-warning-content: oklch(17.834% 0.009 71.47);
  --color-error: oklch(73.092% 0.11 20.076);
  --color-error-content: oklch(14.618% 0.022 20.076);

  /* Border Radius */
  --radius-selector: 1rem;
  --radius-field: 0.5rem;
  --radius-box: 1rem;

  /* Sizes */
  --size-selector: 0.25rem;
  --size-field: 0.25rem;
  --border: 1px;
}
```

## 3. Dark Theme

```css
[data-theme='dark'] {
  /* Base Colors */
  --color-base-100: oklch(20.768% 0.039 265.754);
  --color-base-200: oklch(19.314% 0.037 265.754);
  --color-base-300: oklch(17.86% 0.034 265.754);
  --color-base-content: oklch(84.153% 0.007 265.754);

  /* Primary */
  --color-primary: oklch(75.351% 0.138 232.661);
  --color-primary-content: oklch(15.07% 0.027 232.661);

  /* Secondary */
  --color-secondary: oklch(68.011% 0.158 276.934);
  --color-secondary-content: oklch(13.602% 0.031 276.934);

  /* Accent */
  --color-accent: oklch(72.36% 0.176 350.048);
  --color-accent-content: oklch(14.472% 0.035 350.048);

  /* Neutral */
  --color-neutral: oklch(27.949% 0.036 260.03);
  --color-neutral-content: oklch(85.589% 0.007 260.03);

  /* Status Colors */
  --color-info: oklch(68.455% 0.148 237.251);
  --color-info-content: oklch(0% 0 0);
  --color-success: oklch(78.452% 0.132 181.911);
  --color-success-content: oklch(15.69% 0.026 181.911);
  --color-warning: oklch(83.242% 0.139 82.95);
  --color-warning-content: oklch(16.648% 0.027 82.95);
  --color-error: oklch(71.785% 0.17 13.118);
  --color-error-content: oklch(14.357% 0.034 13.118);
}
```

## 4. Coffee Theme

```css
[data-theme='coffee'] {
  /* Base Colors */
  --color-base-100: oklch(24% 0.023 329.708);
  --color-base-200: oklch(21% 0.021 329.708);
  --color-base-300: oklch(16% 0.019 329.708);
  --color-base-content: oklch(72.354% 0.092 79.129);

  /* Primary */
  --color-primary: oklch(71.996% 0.123 62.756);
  --color-primary-content: oklch(14.399% 0.024 62.756);

  /* Secondary */
  --color-secondary: oklch(34.465% 0.029 199.194);
  --color-secondary-content: oklch(86.893% 0.005 199.194);

  /* Accent */
  --color-accent: oklch(42.621% 0.074 224.389);
  --color-accent-content: oklch(88.524% 0.014 224.389);

  /* Neutral */
  --color-neutral: oklch(16.51% 0.015 326.261);
  --color-neutral-content: oklch(83.302% 0.003 326.261);

  /* Status Colors */
  --color-info: oklch(79.49% 0.063 184.558);
  --color-info-content: oklch(15.898% 0.012 184.558);
  --color-success: oklch(74.722% 0.072 131.116);
  --color-success-content: oklch(14.944% 0.014 131.116);
  --color-warning: oklch(88.15% 0.14 87.722);
  --color-warning-content: oklch(17.63% 0.028 87.722);
  --color-error: oklch(77.318% 0.128 31.871);
  --color-error-content: oklch(15.463% 0.025 31.871);
}
```

## 5. Nord Theme

```css
[data-theme='nord'] {
  /* Base Colors */
  --color-base-100: oklch(95.127% 0.007 260.731);
  --color-base-200: oklch(93.299% 0.01 261.788);
  --color-base-300: oklch(89.925% 0.016 262.749);
  --color-base-content: oklch(32.437% 0.022 264.182);

  /* Primary */
  --color-primary: oklch(59.435% 0.077 254.027);
  --color-primary-content: oklch(11.887% 0.015 254.027);

  /* Secondary */
  --color-secondary: oklch(69.651% 0.059 248.687);
  --color-secondary-content: oklch(13.93% 0.011 248.687);

  /* Accent */
  --color-accent: oklch(77.464% 0.062 217.469);
  --color-accent-content: oklch(15.492% 0.012 217.469);

  /* Neutral */
  --color-neutral: oklch(45.229% 0.035 264.131);
  --color-neutral-content: oklch(89.925% 0.016 262.749);

  /* Status Colors */
  --color-info: oklch(69.207% 0.062 332.664);
  --color-info-content: oklch(13.841% 0.012 332.664);
  --color-success: oklch(76.827% 0.074 131.063);
  --color-success-content: oklch(15.365% 0.014 131.063);
  --color-warning: oklch(85.486% 0.089 84.093);
  --color-warning-content: oklch(17.097% 0.017 84.093);
  --color-error: oklch(60.61% 0.12 15.341);
  --color-error-content: oklch(12.122% 0.024 15.341);
}
```

## 6. Chart Colors

### 6.1 Light Theme

| Element | Color |
|--------|-------|
| Pressure text | #0066cc |
| Flow text | #63993d |
| Target pressure | #0066cc |
| Target flow | #63993d |
| Temperature | #f0561d |
| Weight | #8b5cf6 |

### 6.2 Dark Theme

| Element | Color |
|--------|-------|
| Pressure text | #58a6ff |
| Flow text | #82c952 |
| Target pressure | #58a6ff |
| Target flow | #82c952 |
| Temperature | #ff7a45 |
| Weight | #a78bfa |

## 7. Usage in Tailwind

```html
<!-- Using DaisyUI colors -->
<div class="bg-base-100 text-base-content">
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-secondary">Secondary</button>
  <span class="badge badge-success">Success</span>
  <span class="badge badge-error">Error</span>
</div>
```

## 8. Semantic Tokens

| Token | Usage |
|-------|-------|
| `--color-primary` | Main actions, links |
| `--color-secondary` | Secondary actions |
| `--color-accent` | Highlights |
| `--color-success` | Success states |
| `--color-warning` | Warning states |
| `--color-error` | Error states |