# Directory Structure

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Root Level

```
gm-profile-database/
├── .astro/
│   └── ...             # Astro build cache
├── .github/
│   └── workflows/
│       └── deploy.yml # CI/CD pipeline
├── .vscode/
│   └── settings.json # Editor config
├── documentation/
│   └── ...          # Design documents
├── public/
│   └── assets/     # Static assets
│       ├── img/    # Profile images
│       ├── icons/   # UI icons
│       └── logos/   # Brand logos
├── profiles/         # Profile source files
│   ├── 9bar/
│   └── lever-classic/
├── src/
│   ├── layouts/
│   ├── pages/
│   ├── components/
│   └── utils/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── LICENSE
├── README.md
└── CONTRIBUTING.md
```

## 2. Source Directory (`src/`)

```
src/
├── config/
│   └── site.ts        # Site configuration
├── schemas/           # JSON validation schemas
│   ├── index.schema.json
│   └── profile.schema.json
├── layouts/
│   ├── Base.astro    # HTML base template
│   └── ProfileLayout.astro
├── pages/
│   ├── index.astro       # Homepage
│   ├── profiles/
│   │   └── [name]/
│   │       └── index.astro # Profile detail
│   └── 404.astro
├── components/
│   ├── cards/
│   │   └── ProfileCard.astro
│   ├── charts/
│   │   └── ProfileChart.astro
│   ├── navigation/
│   │   ├── Header.astro
│   │   └── ThemeSelector.astro
│   ├── search/
│   │   ├── SearchBar.astro
│   │   └── FilterControls.astro
│   ├── pagination/
│   │   └── Pagination.astro
│   ├── tabs/
│   │   ├── VersionTabs.astro
│   │   └── VariantTabs.astro
│   ├── download/
│   │   ├── DownloadButton.astro
│   │   └── DownloadDropdown.astro
│   └── ui/
│       ├── Badge.astro
│       ├── Link.astro
│       └── ParameterTable.astro
├── utils/
│   ├── chart.js        # Chart.js utilities
│   ├── schema.js      # JSON validation
│   ├── parser.js     # Profile parsing
│   ├── download.js   # Download path resolution
│   └── theme.js     # Theme utilities
├── styles/
│   └── theme.css    # DaisyUI themes
└── content/
    └── config.ts    # Astro content config
```

## 2.5 Schema Directory (`src/schemas/`)

JSON schemas for validation, used by Ajv during build and CI.

```
src/schemas/
├── index.schema.json     # Validates index.json files
└── profile.schema.json   # Validates profile JSON files
```

### Schema Usage

| File | Validates | Used By |
|------|-----------|---------|
| `index.schema.json` | `profiles/*/index.json` | Build script, CI validation |
| `profile.schema.json` | `profiles/*/*.json` | Build script, optional validation |

**Reference:** See [Data Schema - Section 9.3](./04-DataSchema.md#93-complete-json-schemas) for complete schema definitions.

## 3. Profile Directory (`profiles/`)

### Choose Your Profile Structure

Before organizing your profile, decide which pattern fits your needs:

| Pattern | Use Case | Complexity |
|---------|----------|-----------|
| **A: Simple** | Single profile, no variants/versions | ⭐ |
| **B: Variants** | Multiple options at same extraction level | ⭐⭐ |
| **C: Versions** | Profile evolution over time with optional variants | ⭐⭐⭐ |

---

### Pattern A: Simple Profile (No Variants/Versions)

**Use when:** You have a single profile with no variations  
**Complexity:** ⭐ (Easiest)

```
profiles/9bar-espresso/
├── index.json
└── 9bar-espresso.json
```

**index.json structure:**
```json
{
  "name": "9bar-espresso",
  "displayName": "9 Bar Espresso",
  "file": "9bar-espresso.json",
  "downloadPath": "/profiles/9bar-espresso/",
  "description": "A classic 9 bar extraction profile",
  "author": "Gaggimate",
  "date": "2026-04-22",
  "complexity": "low",
  "tags": ["espresso", "classic"]
}
```

---

### Pattern B: Variants Only (Recommended)

**Use when:** You have one profile with multiple options (doses, roast levels, etc.)  
**Complexity:** ⭐⭐ (Easy, most common)

```
profiles/9bar-espresso/
├── index.json
├── 18g.json
└── 20g.json
```

**index.json structure:**
```json
{
  "name": "9bar-espresso",
  "displayName": "9 Bar Espresso",
  "description": "A classic 9 bar extraction profile",
  "author": "Gaggimate",
  "date": "2026-04-22",
  "complexity": "low",
  "tags": ["espresso", "classic"],
  "variants": [
    {
      "id": "18g",
      "file": "18g.json",
      "label": "18g dose",
      "downloadPath": "/profiles/9bar-espresso/"
    },
    {
      "id": "20g",
      "file": "20g.json",
      "label": "20g dose",
      "downloadPath": "/profiles/9bar-espresso/"
    }
  ]
}
```

---

### Pattern C: Versions with Nested Variants (Advanced)

**Use when:** Your profile evolves over time AND has multiple options per version  
**Complexity:** ⭐⭐⭐ (Advanced)

```
profiles/lever-classic/
├── index.json
├── v1.0.0/
│   ├── standard.json
│   ├── 18g.json
│   └── 20g.json
├── v2.0.0-beta/
│   ├── standard.json
│   ├── 18g.json
│   └── 20g.json
└── v2.0.0/
    ├── standard.json
    ├── 18g.json
    └── 20g.json
```

**index.json structure:**
```json
{
  "name": "lever-classic",
  "displayName": "Lever Classic",
  "description": "Profile for lever-operated machines",
  "author": "Gaggimate",
  "complexity": "high",
  "tags": ["lever", "classic"],
  "versions": [
    {
      "id": "v1.0.0",
      "label": "Version 1.0.0",
      "releaseDate": "2026-04-20",
      "variants": [
        {
          "id": "standard",
          "file": "v1.0.0/standard.json",
          "label": "Standard"
        },
        {
          "id": "18g",
          "file": "v1.0.0/18g.json",
          "label": "18g dose"
        }
      ]
    },
    {
      "id": "v2.0.0-beta",
      "label": "Version 2.0.0-beta",
      "releaseDate": "2026-04-22",
      "variants": [
        {
          "id": "standard",
          "file": "v2.0.0-beta/standard.json",
          "label": "Standard"
        }
      ]
    }
  ]
}
```

---

### Version Naming Convention

- **Format:** `v[MAJOR].[MINOR].[PATCH]`
- **Examples:**
  - `v1.0.0` — Stable release
  - `v2.0.0-beta` — Pre-release version
  - `v2.1.1-beta` — Beta with patch updates
- **Note:** Naming is flexible; use semantic versioning or descriptive names that make sense to you

## 4. Public Directory (`public/`)

```
public/
├── assets/
│   ├── img/
│   │   ├── 9bar.jpg
│   │   └── lever-classic.png
│   ├── icons/
│   │   ├── discord.svg
│   │   ├── download.svg
│   │   ├── filter.svg
│   │   └── search.svg
│   └── logos/
│       ├── gaggimate-logo.svg
│       └── favicon.svg
├── robots.txt
└── og-image.png           # Default OG image
```

## 5. GitHub Directory (`.github/`)

```
.github/
└── workflows/
    └── deploy.yml        # CI/CD workflow
```

## 6. Documentation Directory

See [metadata.yaml](./metadata.yaml) for full structure.

## 7. Path Conventions

### Source Paths

| Purpose | Path |
|---------|------|
| Profile source | `profiles/{name}/` |
| Generated pages | `pages/` |
| Static assets | `public/assets/` |
| Components | `src/components/` |

### URL Paths

| Purpose | Path |
|---------|------|
| Homepage | `/` |
| Profile page | `/profiles/{name}/` |
| Profile download | `/{profile.downloadPath}` |
| Assets | `/assets/` |

## 8. File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Folders | kebab-case | `v01-classic`, `lever-profile` |
| JSON files | kebab-case | `9bar.json`, `vst-20g.json` |
| Components | PascalCase | `ProfileCard.astro`, `VersionTabs.astro` |
| Utilities | camelCase | `chart.js`, `schema.js` |
| CSS files | kebab-case | `theme.css` |

## 9. Testing Directory (`tests/`)

```
tests/
├── unit/
│   ├── chart.test.js
│   ├── download.test.js
│   ├── parser.test.js
│   └── schema.test.js
├── integration/
│   ├── ProfileCard.test.jsx
│   ├── ProfileChart.test.jsx
│   ├── SearchBar.test.jsx
│   └── Pagination.test.jsx
├── e2e/
│   ├── user-flow.spec.js
│   ├── search.spec.js
│   ├── filter.spec.js
│   ├── a11y.spec.js
│   └── download.spec.js
├── visual/
│   └── components.spec.js
├── fixtures/
│   ├── profiles/
│   │   ├── simple-profile.json
│   │   ├── variants-profile.json
│   │   └── versions-profile.json
│   └── profile-data/
│       ├── 9bar.json
│       └── lever.json
└── mocks/
    ├── handlers.js
    └── profiles.js
```

### Testing Structure

| Directory | Purpose |
|-----------|---------|
| `unit/` | Utility function tests |
| `integration/` | Component tests |
| `e2e/` | End-to-end Playwright tests |
| `visual/` | Visual regression tests |
| `fixtures/` | Test data |
| `mocks/` | Mock API handlers |

**Reference:** See [Testing Strategy](./13-Testing.md) for complete testing documentation.