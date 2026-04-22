# Testing Strategy

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Overview

The testing strategy ensures code quality, prevents regressions, and validates functionality across the Gaggimate Profile Store.

## 2. Testing Pyramid

| Level | Coverage | Speed | Quantity |
|-------|----------|-------|----------|
| E2E | Full user flows | Slow | ~10 tests |
| Integration | Component + data | Medium | ~30 tests |
| Unit | Functions/utilities | Fast | ~60 tests |

## 3. Unit Testing

### 3.1 Test Framework

| Tool | Version | Purpose |
|------|---------|---------|
| **Vitest** | ^1.0.0 | Test runner |
| **@vitest/ui** | ^1.0.0 | Test UI |
| **jsdom** | ^24.0.0 | DOM simulation |

**Why Vitest:**
- Native Vite support (fast)
- Jest-compatible API
- Built-in coverage
- Watch mode

### 3.2 Units to Test

| Unit | Test File | Coverage Target |
|------|-----------|----------------|
| Chart utilities | `chart.test.js` | 90% |
| Schema validation | `schema.test.js` | 100% |
| Profile parser | `parser.test.js` | 95% |
| Download resolver | `download.test.js` | 100% |
| Theme utilities | `theme.test.js` | 90% |

### 3.3 Running Unit Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage

# UI mode
npm test -- --ui
```

### 3.4 Coverage Targets

| Metric | Target |
|--------|--------|
| Statements | 85% |
| Branches | 80% |
| Functions | 85% |
| Lines | 85% |

**Critical files:** 100% coverage required for:
- `download.js` (download resolution logic)
- `schema.js` (validation logic)

## 4. Integration Testing

### 4.1 Test Framework

| Tool | Version | Purpose |
|------|---------|---------|
| **@testing-library/preact** | ^3.0.0 | Component testing |
| **@testing-library/user-event** | ^14.0.0 | User interactions |

### 4.2 Components to Test

| Component | Test File | Focus |
|-----------|-----------|-------|
| ProfileCard | `ProfileCard.test.jsx` | Rendering, props, links |
| ProfileChart | `ProfileChart.test.jsx` | Data loading, rendering |
| SearchBar | `SearchBar.test.jsx` | Input, debounce, clear |
| FilterControls | `FilterControls.test.jsx` | Multi-select, state |
| DownloadButton | `DownloadButton.test.jsx` | Click, dropdown |
| ThemeSelector | `ThemeSelector.test.jsx` | Theme switching |
| Pagination | `Pagination.test.jsx` | Page navigation |

## 5. End-to-End Testing

### 5.1 Test Framework

| Tool | Version | Purpose |
|------|---------|---------|
| **Playwright** | ^1.40.0 | E2E testing |
| **@playwright/test** | ^1.40.0 | Test runner |

**Why Playwright:**
- Cross-browser (Chrome, Firefox, Safari)
- Auto-wait for elements
- Network interception
- Screenshots/videos

### 5.2 Test Scenarios

| Scenario | File | Priority |
|----------|------|----------|
| Browse profiles | `browse.spec.js` | Critical |
| Search profiles | `search.spec.js` | Critical |
| Filter profiles | `filter.spec.js` | High |
| View profile details | `profile-detail.spec.js` | Critical |
| Download profile | `download.spec.js` | Critical |
| Switch themes | `theme.spec.js` | Medium |
| Pagination | `pagination.spec.js` | High |
| Accessibility | `a11y.spec.js` | High |

### 5.3 Running E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific browser
npm run test:e2e -- --project=chromium

# Debug mode
npm run test:e2e -- --debug

# Generate report
npm run test:e2e -- --reporter=html
```

## 6. Visual Regression Testing

### 6.1 Tool

| Tool | Version | Purpose |
|------|---------|---------|
| **@playwright/test** | ^1.40.0 | Screenshot comparison |

### 6.2 Test Scenarios

| Component | Screenshot |
|-----------|-----------|
| Homepage (light theme) | `homepage-light.png` |
| Homepage (dark theme) | `homepage-dark.png` |
| Profile card | `profile-card.png` |
| Profile detail | `profile-detail.png` |
| Chart rendering | `chart.png` |

## 7. CI Integration

### 7.1 GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### 7.2 Required Checks

| Check | Fails Build? |
|-------|-------------|
| Unit tests pass | Yes |
| Coverage >85% | Yes |
| E2E tests pass | Yes |
| A11y violations | Yes |
| Visual changes | No (requires approval) |

## 8. Testing Commands

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:a11y": "playwright test tests/e2e/a11y.spec.js",
    "test:visual": "playwright test tests/visual/",
    "test:all": "npm test && npm run test:e2e"
  }
}
```

## 9. Test Data

### 9.1 Fixtures

Store test fixtures in `tests/fixtures/`:

```
tests/
├── fixtures/
│   ├── profiles/
│   │   ├── simple-profile.json
│   │   ├── variants-profile.json
│   │   └── versions-profile.json
│   └── profile-data/
│       ├── 9bar.json
│       └── lever.json
```

## 10. Best Practices

### 10.1 Test Principles

| Principle | Example |
|-----------|---------|
| **Arrange-Act-Assert** | Set up → Execute → Verify |
| **One assertion per test** | Or closely related assertions |
| **Descriptive names** | `it('should show error when fetch fails')` |
| **Independent tests** | No shared state between tests |

### 10.2 What NOT to Test

- Third-party library internals (Chart.js, DaisyUI)
- Astro framework behavior
- Browser APIs (unless wrapping them)
- CSS styling (use visual regression instead)

### 10.3 Test Coverage Goals

| Code Type | Target |
|-----------|--------|
| Business logic | 100% |
| Utilities | 95% |
| Components | 85% |
| Integration | 80% |
| E2E | Critical paths |

---

**Next Steps:**
1. Set up test framework (Vitest + Playwright)
2. Write tests alongside implementation
3. Run tests locally before committing
4. Review coverage reports in CI

**Reference:** See [Appendix E: Implementation Examples](./Appendices/E-ImplementationExamples.md) for detailed test code examples.
