# CI/CD Pipeline

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Overview

The project uses GitHub Actions for continuous integration and deployment to GitHub Pages.

## 2. Workflow File

```
.github/workflows/deploy.yml
```

## 3. Triggers

| Trigger | Action |
|--------|--------|
| Push to `main` | Build and deploy |
| Pull request | Validate only |
| Manual | Run on demand |

## 4. Jobs

### 4.1 Job: validate

| Property | Value |
|----------|-------|
| Runs on | ubuntu-latest |
| Timeout | 10 minutes |

#### Steps

1. Checkout code
2. Setup Node.js (v22)
3. Install dependencies
4. Run schema validation
5. Run JSON linting
6. Run unit tests
7. Build Astro site
8. Generate search index (Pagefind)
9. Run accessibility tests
10. Run performance tests (Lighthouse)

#### Validation Checks

```bash
npm run validate
```

- JSON schema validation for all `index.json` files using Ajv
- Schema: `src/schemas/index.schema.json`
- Check required fields (name, displayName, etc.)
- Verify profile JSON structure against `src/schemas/profile.schema.json`
- Generate validation report

**Example validation script:**
```javascript
// scripts/validate.js
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { glob } from 'glob';
import { readFile } from 'fs/promises';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Load schemas
const indexSchema = JSON.parse(await readFile('src/schemas/index.schema.json', 'utf-8'));
const profileSchema = JSON.parse(await readFile('src/schemas/profile.schema.json', 'utf-8'));

const validateIndex = ajv.compile(indexSchema);
const validateProfile = ajv.compile(profileSchema);

// Validate all index.json files
const indexFiles = await glob('profiles/*/index.json');
const errors = [];

for (const file of indexFiles) {
  const data = JSON.parse(await readFile(file, 'utf-8'));
  if (!validateIndex(data)) {
    errors.push({ file, errors: validateIndex.errors });
  }
}

// Report results
if (errors.length > 0) {
  console.error('Validation failed:', errors);
  process.exit(1);
}

console.log(`✓ Validated ${indexFiles.length} profiles`);
```

```bash
npm run lint
```

- JSON syntax validation
- Schema conformance
- File structure checks

```bash
npm test
```

- Run Vitest unit tests
- Coverage must be >85%
- All tests must pass

```bash
npm run build
```

- Astro build to `pages/` folder
- Must complete without errors

```bash
npx pagefind --source pages
```

- Generate search index from built HTML
- Creates `pages/_pagefind/` directory
- Index includes profile names, descriptions, tags, authors

```bash
npm run test:a11y
```

- Run accessibility tests with axe
- Zero violations allowed
- Tests all page types (home, profile detail)

```bash
npm run test:perf
```

- Run Lighthouse performance tests
- Performance score must be >90
- LCP must be <2.5s
- See [Performance](./14-Performance.md) for budgets

### 4.2 Job: deploy

| Property | Value |
|----------|-------|
| Runs on | ubuntu-latest |
| Needs | validate |
| If | main branch only |

#### Steps

1. Checkout code
2. Setup Node.js (v22)
3. Install dependencies
4. Build Astro site
5. Generate search index (Pagefind)
6. Deploy to GitHub Pages

#### Deployment

```yaml
- name: Build site
  run: |
    npm ci
    npm run build
    npx pagefind --source pages

- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v4
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./pages
    cname: your-custom-domain.com  # Optional
```

**Note:** The `pages/` directory now includes:
- Static HTML files
- CSS/JS assets
- Profile JSON files (in `/profiles/`)
- Search index (`/_pagefind/`)

## 5. Build Output

### 5.1 Output Directory

```
pages/
├── index.html
├── profiles/
│   └── {name}/
│       └── index.html
├── assets/
└── ...
```

### 5.2 Source Directory

```
src/ → pages/
profiles/ → pages/profiles/
public/ → pages/
```

## 6. Environment

### 6.1 Node.js Version

| Environment | Version |
|-------------|---------|
| CI | ^22.0.0 |
| Development | ^22.0.0 |

### 6.2 Environment Variables

| Variable | Usage |
|----------|-------|
| `GITHUB_TOKEN` | GitHub API (auto-provided) |
| `NODE_ENV` | development/production |

## 7. Validation Pipeline

### 7.1 Schema Validation

Using Ajv for JSON schema validation:

```javascript
const schema = {
  type: 'object',
  required: ['name', 'downloadPath'],
  properties: {
    name: { type: 'string' },
    downloadPath: { type: 'string' },
    // ... optional fields
  }
};
```

### 7.2 Validation Errors

| Error Type | Severity | Action |
|-----------|----------|--------|
| Missing required | Error | Fail CI |
| Invalid type | Error | Fail CI |
| Unknown field | Warning | Log, continue |
| Missing optional | Warning | Log, continue |

### 7.3 Validation Report

Generated at build time:

```
validation-report.json
```

```json
{
  "timestamp": "2026-04-22T12:00:00Z",
  "total": 15,
  "valid": 13,
  "errors": [
    {
      "profile": "broken-profile",
      "file": "index.json",
      "errors": ["Missing downloadPath"]
    }
  ]
}
```

## 8. Deployment Flow

### 8.1 Push to Main

```
Push → CI: validate → CI: build → Deploy → GitHub Pages
```

### 8.2 Pull Request

```
PR → CI: validate → CI: build → Preview (optional)
```

### 8.3 GitHub Pages Settings

| Setting | Value |
|---------|-------|
| Source | gh-pages branch |
| Folder | / (root) |
| Custom domain | Optional |

## 9. Scripts

### 9.1 Package Scripts (Updated)

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "validate": "node scripts/validate.js",
    "lint": "eslint src/ --ext .js,.jsx,.astro",
    "lint:json": "jsonlint profiles/**/*.json",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:a11y": "playwright test tests/e2e/a11y.spec.js",
    "test:perf": "lighthouse http://localhost:4321 --output=json --output-path=./lighthouse-results.json",
    "check": "npm run validate && npm run lint && npm test",
    "build:full": "npm run build && npx pagefind --source pages"
  }
}
```

### 9.2 Validation Script

```bash
node scripts/validate.js
```

**Purpose:**
- Validates all `profiles/*/index.json` against schema
- Validates profile JSON files (optional)
- Generates validation report
- Exits with code 1 if errors found

### 9.3 Build Script (with Pagefind)

```bash
npm run build:full
```

**Purpose:**
- Builds Astro site to `pages/`
- Generates Pagefind search index
- Ready for deployment

### 9.4 Test Scripts

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Accessibility tests
npm run test:a11y

# Performance tests (requires running server)
npm run preview &
npm run test:perf
```

## 10. Error Handling

### 10.1 Build Failures

| Error | Action |
|-------|-------|
| TypeScript error | Fail build |
| Schema error | Fail build |
| Missing file | Fail build |

### 10.2 CI Failures

| Error | Action |
|--------|--------|
| Validation failure | Fail CI |
| Build failure | Fail CI |
| Deploy failure | Retry once |

### 10.3 Notifications

| Event | Notification |
|-------|-------------|
| PR fail | PR status update |
| Main fail | GitHub notification |

---

## 11. Local Development

### 11.1 Setup

```bash
git clone https://github.com/marxd262/gm-profile-database.git
cd gm-profile-database
npm install
npm run dev
```

### 11.2 Development Server

```bash
npm run dev
# Opens http://localhost:4321
```

### 11.3 Build Locally

```bash
npm run build
# Output to pages/
```

### 11.4 Validation

```bash
npm run validate
npm run lint
```

---

## 12. Complete CI/CD Workflow

### 12.1 Full Workflow File

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  validate:
    name: Validate and Test
    runs-on: ubuntu-latest
    timeout-minutes: 10

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Validate profiles
        run: npm run validate

      - name: Lint code
        run: npm run lint

      - name: Run unit tests
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

      - name: Build site
        run: npm run build

      - name: Generate search index
        run: npx pagefind --source pages

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Preview site
        run: npm run preview &

      - name: Wait for server
        run: npx wait-on http://localhost:4321

      - name: Run accessibility tests
        run: npm run test:a11y

      - name: Run Lighthouse
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4321
            http://localhost:4321/profiles/9bar-espresso/
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true

  deploy:
    name: Deploy to GitHub Pages
    runs-on: ubuntu-latest
    needs: validate
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Generate search index
        run: npx pagefind --source pages

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./pages

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 12.2 Lighthouse Budget File

Create `lighthouse-budget.json` in project root:

```json
{
  "ci": {
    "assert": {
      "preset": "lighthouse:no-pwa",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 1.0}],
        "categories:best-practices": ["error", {"minScore": 0.95}],
        "categories:seo": ["error", {"minScore": 0.95}],
        "first-contentful-paint": ["error", {"maxNumericValue": 1800}],
        "largest-contentful-paint": ["error", {"maxNumericValue": 2500}],
        "cumulative-layout-shift": ["error", {"maxNumericValue": 0.1}],
        "total-byte-weight": ["error", {"maxNumericValue": 512000}],
        "resource-summary:script:size": ["error", {"maxNumericValue": 153600}],
        "resource-summary:stylesheet:size": ["error", {"maxNumericValue": 51200}]
      }
    }
  }
}
```

### 12.3 PR Checks

For pull requests, the workflow:
1. ✅ Validates all profiles
2. ✅ Runs tests
3. ✅ Builds successfully
4. ✅ Checks accessibility
5. ✅ Checks performance
6. ❌ Does NOT deploy

### 12.4 Main Branch Deploy

For pushes to main, the workflow:
1. ✅ All validation checks
2. ✅ Deploys to GitHub Pages
3. ✅ Live at `https://marxd262.github.io/gm-profile-database`

---

## 13. Workflow Diagram

```
                    ┌─────────────────┐
                    │     Push/PR     │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Checkout Code │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   Setup Node    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Install Deps    │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                           │
              ▼                           ▼
     ┌─────────────────┐        ┌─────────────────┐
     │    Validate     │        │     Build      │
     └────────┬────────┘        └────────┬────────┘
              │                        │
              │     ┌──────────────────┘
              │     │
              ▼     ▼
     ┌─────────────────┐
     │  Validation OK?  │
     └────────┬────────┘
              │
      ┌───────┴───────┐
      │             │
      ▼             ▼
    ┌───┐       ┌───────┐
    │No │       │ Yes  │
    └───┘       └──┬───┘
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
   ┌──────────┐       ┌─────────────────┐
   │ Fail CI  │       │ Push to main?    │
   └──────────┘       └────────┬────────┘
                              │
                    ┌────────┴────────┐
                    │                 │
                    ▼                 ▼
              ┌──────────┐     ┌─────────────────┐
              │ No Deploy│     │  Deploy Pages   │
              └──────────┘     └─────────────────┘
```