# Accessibility

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Overview

The Gaggimate Profile Store is committed to WCAG 2.1 Level AA compliance to ensure all users can access and use the catalog.

## 2. Keyboard Navigation

### 2.1 Focus Management

| Element | Behavior |
|---------|---------|
| Profile cards | Focusable, enter to navigate |
| Search input | Focusable, escape to clear |
| Filter dropdowns | Arrow keys to navigate options |
| Theme selector | Arrow keys to select theme |
| Tabs (versions/variants) | Left/right arrows to switch |
| Download button | Focusable, enter/space to activate |

### 2.2 Focus Indicators

| State | Visual |
|-------|--------|
| Focused | 2px outline in primary color |
| Focused (keyboard) | Enhanced outline with offset |
| Skip to content | Link visible on focus |

### 2.3 Tab Order

```
1. Skip to content link
2. Logo (home link)
3. Theme selector
4. Search input
5. Filter controls (difficulty, tags, machine, sort)
6. Profile cards (row by row)
7. Pagination controls
```

## 3. Screen Reader Support

### 3.1 Semantic HTML

| Element | Semantic Tag |
|---------|-------------|
| Main content | `<main>` |
| Navigation | `<nav>` |
| Search | `<search>` or `role="search"` |
| Cards | `<article>` |
| Headings | Proper hierarchy (h1 → h2 → h3) |

### 3.2 ARIA Labels

| Element | ARIA Attribute | Value |
|---------|---------------|-------|
| Search input | `aria-label` | "Search profiles" |
| Filter button | `aria-label` | "Filter profiles" |
| Theme selector | `aria-label` | "Select theme" |
| Profile card | `aria-label` | "{displayName} profile" |
| Download button | `aria-label` | "Download {variant} profile" |
| Pagination | `aria-label` | "Pagination navigation" |
| Current page | `aria-current` | "page" |

### 3.3 Live Regions

| Element | ARIA Role | Behavior |
|---------|-----------|----------|
| Search results | `aria-live="polite"` | Announce result count |
| Filter updates | `aria-live="polite"` | Announce active filters |
| Error messages | `aria-live="assertive"` | Announce errors immediately |

### 3.4 Chart Accessibility

| Feature | Implementation |
|---------|--------------|
| Alt text | Chart described in text below |
| Data table | Tabular data provided as alternative |
| ARIA label | "Pressure and flow chart for {profile}" |

**Example accessible chart:**

```html
<div role="img" aria-label="Pressure and flow chart for 9 Bar Espresso">
  <canvas id="chart"></canvas>
</div>
<details>
  <summary>View data as table</summary>
  <table>
    <caption>Profile data</caption>
    <thead>
      <tr>
        <th>Time (s)</th>
        <th>Pressure (bar)</th>
        <th>Flow (ml/s)</th>
      </tr>
    </thead>
    <tbody>
      <!-- Generated from profile data -->
    </tbody>
  </table>
</details>
```

## 4. Color Contrast

### 4.1 WCAG AA Requirements

| Element | Minimum Ratio |
|---------|--------------|
| Body text | 4.5:1 |
| Large text (18pt+) | 3:1 |
| UI components | 3:1 |
| Active states | 3:1 |

### 4.2 Theme Compliance

All four themes (light, dark, coffee, nord) must meet contrast requirements.

#### Testing Checklist

- [ ] Text on background: 4.5:1
- [ ] Buttons: 3:1 against background
- [ ] Links: 4.5:1 and distinct from text
- [ ] Chart lines: 3:1 against background
- [ ] Focus indicators: 3:1 against background

### 4.3 Color Independence

Information conveyed by color must also be available through:
- Text labels
- Icons
- Patterns
- Position

**Example:** Difficulty badges use both color AND text:
- 🟢 Beginner (not just green)
- 🟡 Intermediate (not just yellow)
- 🔴 Advanced (not just red)

## 5. Form Accessibility

### 5.1 Labels

| Input | Label Type |
|-------|-----------|
| Search | Visible + `<label>` |
| Filters | Visible + `<label>` |
| Theme selector | `aria-label` |

### 5.2 Error Messages

| Error Type | Announcement |
|-----------|-------------|
| No results | "No profiles found. Try different filters." |
| Load failure | "Failed to load profiles. Please refresh." |
| Invalid input | "Please enter valid search term." |

## 6. Responsive Design

### 6.1 Text Scaling

| Zoom Level | Behavior |
|-----------|----------|
| 100% | Default layout |
| 200% | Reflow without horizontal scroll |
| 400% | Single column, readable |

### 6.2 Mobile Accessibility

| Feature | Mobile Behavior |
|---------|----------------|
| Touch targets | Minimum 44x44px |
| Spacing | Adequate between interactive elements |
| Font size | Minimum 16px for body text |
| Orientation | Support both portrait/landscape |

## 7. Testing Checklist

### 7.1 Automated Testing

- [ ] axe DevTools: 0 violations
- [ ] Lighthouse Accessibility: 100 score
- [ ] WAVE: 0 errors
- [ ] Pa11y CI: Passing

### 7.2 Manual Testing

- [ ] Keyboard-only navigation (unplug mouse)
- [ ] Screen reader (NVDA, JAWS, VoiceOver)
- [ ] High contrast mode (Windows)
- [ ] Zoom to 200% and 400%
- [ ] Mobile screen reader (TalkBack, VoiceOver)

### 7.3 Browser Testing

- [ ] Chrome + ChromeVox
- [ ] Firefox + NVDA
- [ ] Safari + VoiceOver
- [ ] Edge + Narrator

## 8. Skip Links

```html
<a href="#main" class="skip-link">Skip to main content</a>
<a href="#search" class="skip-link">Skip to search</a>
```

**Styling:**
```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: var(--color-primary);
  color: var(--color-primary-content);
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

## 9. Documentation

All accessibility features should be documented in:
- Component JSDoc comments
- README accessibility section
- Contributing guide

---

**Next Steps:**
1. Run automated accessibility tests during CI
2. Manual testing with screen readers
3. User testing with assistive technology users
