# Performance

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Overview

Performance is critical for user experience and SEO. This document defines performance budgets, optimization strategies, and monitoring approaches.

## 2. Performance Budgets

### 2.1 Lighthouse Scores

| Metric | Target | Minimum |
|--------|--------|---------|
| **Performance** | 95 | 90 |
| **Accessibility** | 100 | 100 |
| **Best Practices** | 100 | 95 |
| **SEO** | 100 | 95 |

### 2.2 Core Web Vitals

| Metric | Target | Maximum |
|--------|--------|---------|
| **LCP** (Largest Contentful Paint) | <1.5s | 2.5s |
| **FID** (First Input Delay) | <50ms | 100ms |
| **CLS** (Cumulative Layout Shift) | <0.05 | 0.1 |
| **FCP** (First Contentful Paint) | <1.0s | 1.8s |
| **TTI** (Time to Interactive) | <2.5s | 3.8s |

### 2.3 Bundle Size Budgets

| Asset Type | Target | Maximum |
|-----------|--------|---------|
| **HTML** (homepage) | <30KB | 50KB |
| **HTML** (profile page) | <40KB | 60KB |
| **CSS** (critical) | <15KB | 25KB |
| **CSS** (total) | <30KB | 50KB |
| **JS** (critical) | <30KB | 50KB |
| **JS** (total) | <100KB | 150KB |
| **Fonts** | <50KB | 75KB |
| **Images** (per profile) | <50KB | 100KB |

### 2.4 Network Budgets

| Metric | Target | Maximum |
|--------|--------|---------|
| **Total page weight** | <300KB | 500KB |
| **HTTP requests** | <20 | 30 |
| **Time to first byte** | <200ms | 500ms |

## 3. Optimization Strategies

### 3.1 HTML Optimization

| Strategy | Implementation |
|----------|--------------|
| **Minification** | Astro auto-minifies |
| **Critical CSS** | Inline above-fold styles |
| **Preload** | Profile JSON preloading |
| **DNS Prefetch** | Google Fonts |

### 3.2 CSS Optimization

| Strategy | Implementation |
|----------|--------------|
| **Tailwind purge** | Automatic unused class removal |
| **Critical CSS** | Inline for above-fold content |
| **CSS splitting** | Per-route CSS chunks |
| **Minification** | PostCSS cssnano |

### 3.3 JavaScript Optimization

| Strategy | Implementation |
|----------|--------------|
| **Code splitting** | Per-route bundles |
| **Tree shaking** | Remove unused code |
| **Minification** | Terser for production |
| **Defer non-critical** | `defer` or `async` attributes |
| **Chart.js optimization** | Import only needed components |

### 3.4 Image Optimization

| Strategy | Implementation |
|----------|--------------|
| **Format** | WebP with JPEG fallback |
| **Responsive** | `srcset` with multiple sizes |
| **Lazy loading** | Native `loading="lazy"` |
| **Dimensions** | Always specify width/height |
| **Compression** | Quality: 80-85% |

**Image Guidelines:**
- Profile cards: 400×300px max
- Maximum file size: 50KB (target), 100KB (max)
- Use tools: `sharp`, `imagemin`, or Astro's built-in optimizer

### 3.5 Font Optimization

| Strategy | Implementation |
|----------|--------------|
| **Subset** | Only Latin characters |
| **Preload** | Critical font files |
| **Display swap** | `font-display: swap` |
| **Variable fonts** | Single file, multiple weights |
| **Woff2 only** | Modern format only |

## 4. Loading Strategies

### 4.1 Critical Rendering Path

```
1. HTML arrives (30-50KB)
2. Critical CSS parsed (inline)
3. Web fonts loaded (preloaded)
4. First paint (<1s target)
5. Deferred JS loads
6. Lazy images load as scrolled
7. Full interactivity (<2.5s target)
```

### 4.2 Resource Prioritization

| Priority | Resources |
|----------|-----------|
| **Critical** | HTML, critical CSS, Montserrat font |
| **High** | Above-fold images, main JS bundle |
| **Medium** | Pagefind index, Chart.js |
| **Low** | Below-fold images, analytics |

### 4.3 Lazy Loading

| Resource | Strategy |
|----------|---------|
| **Profile cards** | Lazy load images after first 6 |
| **Charts** | Load data on profile page visit |
| **Search index** | Load after page interactive |
| **Below-fold** | Intersection Observer |

## 5. Caching Strategy

### 5.1 Cache Headers

| Resource | Cache-Control | Max-Age |
|----------|--------------|---------|
| **HTML** | `no-cache` | Revalidate |
| **CSS/JS** | `public, immutable` | 1 year |
| **Images** | `public, immutable` | 1 year |
| **Fonts** | `public, immutable` | 1 year |
| **Profile JSON** | `public, max-age=3600` | 1 hour |

## 6. Pagination Impact

### 6.1 Performance Benefits

With 200+ profiles, pagination provides:

| Metric | Without Pagination | With Pagination (24/page) |
|--------|-------------------|-------------------------|
| Initial HTML | ~200KB | ~50KB |
| Images loaded | 200+ | 24 |
| Rendering time | ~5s | ~1s |
| Memory usage | High | Low |

### 6.2 Pagination Optimization

| Optimization | Implementation |
|--------------|--------------|
| **Prefetch next page** | `<link rel="prefetch">` when user nears bottom |
| **URL state** | Use `?page=2` for bookmarking |
| **Scroll restoration** | Remember position when navigating back |

## 7. Monitoring

### 7.1 Build-Time Checks

| Check | Tool | Threshold |
|-------|------|-----------|
| Bundle size | `astro build` | <150KB JS |
| Image size | Custom script | <100KB per image |
| Unused CSS | PurgeCSS | 0% waste |

### 7.2 CI Performance Tests

```yaml
# .github/workflows/performance.yml
name: Performance

on: [push, pull_request]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4321
            http://localhost:4321/profiles/9bar-espresso/
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
```

### 7.3 Production Monitoring

| Tool | Purpose |
|------|---------|
| **Google Search Console** | Core Web Vitals in the wild |
| **GitHub Pages analytics** | Basic traffic patterns |
| **Custom RUM** | Real user monitoring (optional) |

## 8. Performance Checklist

### 8.1 Build Checklist

- [ ] All images optimized (<100KB each)
- [ ] Bundle size under budget (<150KB JS)
- [ ] Critical CSS inlined
- [ ] Fonts preloaded
- [ ] Unused CSS purged
- [ ] Source maps disabled in production

### 8.2 Deployment Checklist

- [ ] Lighthouse Performance >90
- [ ] LCP <2.5s
- [ ] CLS <0.1
- [ ] No console errors
- [ ] All resources cacheable
- [ ] HTTPS enabled
- [ ] Compression enabled (GitHub Pages auto-enables)

## 9. Troubleshooting

### 9.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **High LCP** | Large images above fold | Optimize + preload |
| **High CLS** | No image dimensions | Add width/height |
| **Large JS bundle** | Full Chart.js imported | Import only needed modules |
| **Slow search** | Large Pagefind index | Optimize searchable content |
| **Font flash** | No preload | Preload critical fonts |

## 10. Continuous Improvement

### 10.1 Regular Audits

| Frequency | Audit |
|-----------|-------|
| **Every PR** | Lighthouse CI |
| **Weekly** | Manual testing on slow 3G |
| **Monthly** | Full performance review |
| **Quarterly** | Third-party script audit |

### 10.2 Future Optimizations

| Optimization | Effort | Impact |
|-------------|--------|--------|
| Service Worker caching | Medium | High |
| HTTP/3 support | Low (automatic) | Medium |
| Partial hydration (Astro Islands) | Low | Medium |
| Image CDN | High | Medium |
| Edge caching (Cloudflare) | Medium | High |

---

**Performance is not a one-time task—it requires continuous monitoring and optimization.**
