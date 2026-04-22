# Technology Stack

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Core Framework

### Astro

| Property | Value |
|----------|-------|
| **Framework** | Astro |
| **Version** | ^5.0.0 |
| **Purpose** | Static site generation |
| **Why Astro?** | Content-focused, markdown support, fast builds |

Astro was chosen over other options for:

| Alternative | Why Not |
|-------------|--------|
| Next.js | Overkill for static content |
| 11ty | Astro's Preact support allows component reuse |
| Plain HTML | Insufficient for dynamic features |

### Rendering Strategy

| Environment | Strategy |
|-------------|---------|
| Build | Static generation at build time |
| Runtime | Minimal client-side JavaScript for charts |
| Deployment | GitHub Pages with `pages/` output |

## 2. Styling

### Tailwind CSS

| Property | Value |
|----------|-------|
| **Framework** | Tailwind CSS |
| **Version** | ^4.0.0 |
| **Purpose** | Utility-first styling |

### DaisyUI

| Property | Value |
|----------|-------|
| **Framework** | DaisyUI |
| **Version** | ^5.0.0 |
| **Purpose** | Theme system and component primitives |
| **Themes** | light, dark, coffee, nord |

DaisyUI provides:

| Feature | Usage |
|---------|-------|
| CSS Variables | `--color-base-100`, `--color-primary` |
| Theme System | `data-theme` attribute switching |
| Components | Cards, tabs, dropdowns, buttons |
| Color Harmony | Pre-defined color scales |

### Font

| Property | Value |
|----------|-------|
| **Family** | Montserrat |
| **Weights** | 400 (regular), 700 (bold) |
| **Source** | Google Fonts |
| **Usage** | Logo, headings, badges |

## 3. Charts

### Chart.js

| Property | Value |
|----------|-------|
| **Library** | Chart.js |
| **Version** | ^4.4.0 |
| **Purpose** | Profile visualization |
| **Adapter** | Native (no date adapter needed) |
| **Plugins** | chartjs-plugin-annotation |

### Chart Implementation

| Aspect | Implementation |
|--------|--------------|
| Type | Line chart with dual Y-axis |
| X-Axis | Time (seconds) |
| Y-Axis Left | Pressure (bar) |
| Y-Axis Right | Flow (ml/s) |
| Animation | Fully disabled (no line draw, data point, or transition animations) |
| Chart Updates | Instant rendering when variant/version changes (no fade/transition effects) |
| Interactivity | Tooltips on hover only (no animation effects) |
| Annotations | Phase dividers with labels |

### Code Reuse

The chart logic is **ported from Gaggimate**:

```
gaggimate/web/src/components/ExtendedProfileChart.jsx
                    ↓
gm-profile-database/src/utils/chart.js
```

| Function | Purpose |
|----------|---------|
| `prepareData()` | Convert phases to chart data points |
| `applyEasing()` | Handle transition curves |
| `makeChartData()` | Generate Chart.js config |

## 4. Dependencies (See Section 8 for updated list)

### GitHub Actions

| Action | Purpose |
|--------|---------|
| actions/checkout | Clone repository |
| actions/setup-node | Node.js environment |
| astro/cli-kit | Astro CLI |

## 5. Project Structure

```
gm-profile-database/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── src/
│   ├── layouts/
│   ├── pages/
│   ├── components/
│   └── utils/
├── profiles/              # Source profile data
├── pages/                # Built output
└── documentation/
```

## 6. Environment

### Development

| Tool | Version |
|------|---------|
| Node.js | ^22.0.0 |
| npm | ^10.0.0 |
| OS | Windows/macOS/Linux (pwsh/bash) |

### Build

| Tool | Version |
|------|---------|
| Node.js | ^22.0.0 |
| npm | ^10.0.0 |

### Runtime

| Platform | Requirements |
|----------|------------|
| GitHub Pages | Static hosting |
| Browser | Modern browser with ES2020 |

## 7. Search

### Pagefind

| Property | Value |
|----------|-------|
| **Library** | Pagefind |
| **Version** | ^1.0.0 |
| **Purpose** | Static search indexing |
| **Build Step** | Post-build indexing |

Pagefind was chosen for search because:

| Alternative | Why Not |
|-------------|--------|
| Fuse.js | Client-side only, large bundle for 200+ profiles |
| Lunr.js | Large index size, manual maintenance |
| Algolia | External service, overkill for static content |

### Search Strategy

| Aspect | Implementation |
|--------|--------------|
| Index Generation | Build-time indexing of all profile pages |
| Bundle Size | ~10KB runtime bundle |
| Search Features | Full-text, fuzzy matching, highlighting |
| Performance | <100ms search for 200+ profiles |

### Integration

```bash
# Build command
astro build && npx pagefind --source pages
```

| Feature | Configuration |
|---------|--------------|
| Source Directory | `pages/` (Astro output) |
| Index Location | `pages/_pagefind/` |
| Searchable Content | Profile names, descriptions, tags, authors |
| Exclusions | Header, footer, navigation |

## 8. Updated Dependencies

### Production (Updated)

| Package | Version | Purpose |
|---------|---------|---------|
| astro | ^5.0.0 | Framework |
| @astrojs/tailwind | ^6.0.0 | Tailwind integration |
| tailwindcss | ^4.0.0 | Styling |
| daisyui | ^5.0.0 | Theme system |
| chart.js | ^4.4.0 | Charts |
| chartjs-plugin-annotation | ^3.1.0 | Phase annotations |
| **pagefind** | **^1.0.0** | **Search indexing** |

### Development (Updated)

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^5.0.0 | Type safety |
| @types/node | ^22.0.0 | Node types |
| ajv | ^8.0.0 | JSON schema validation |
| ajv-formats | ^3.0.0 | Format validators |