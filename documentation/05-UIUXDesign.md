# UI/UX Design

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Theme System

### 1.1 DaisyUI Themes

The application uses DaisyUI's theme system with four themes matching Gaggimate:

| Theme | Description | Background |
|-------|-------------|------------|
| `light` | Default light theme | White/cream |
| `dark` | Dark theme | Dark gray |
| `coffee` | Coffee-inspired dark | Warm dark brown |
| `nord` | Light nordic | Cool light gray |

### 1.2 Theme Selector

Located in the **top-right corner** of the header:

```
+------------------------------------------+
| [Logo]  Gaggimate Profiles    [Theme ▼] |
+------------------------------------------+
```

Options: Light, Dark, Coffee, Nord

Theme is stored in `localStorage` and persists across sessions.

### 1.3 CSS Variables

DaisyUI provides these color tokens:

| Token | Purpose |
|-------|---------|
| `--color-base-100` | Primary background |
| `--color-base-200` | Secondary background |
| `--color-base-300` | Tertiary background |
| `--color-base-content` | Text color |
| `--color-primary` | Primary actions |
| `--color-primary-content` | Text on primary |
| `--color-secondary` | Secondary actions |
| `--color-accent` | Accent highlights |
| `--color-neutral` | Neutral elements |
| `--color-info` | Information |
| `--color-success` | Success states |
| `--color-warning` | Warning states |
| `--color-error` | Error states |

### 1.4 Theme Switching

```javascript
// Apply theme
document.documentElement.setAttribute('data-theme', 'coffee');

// Persist in localStorage
localStorage.setItem('gaggimate-daisyui-theme', 'coffee');
```

## 2. Color Palette

### 2.1 Light Theme

| Role | Color | Usage |
|------|-------|-------|
| Primary | Purple-blue | Buttons, links |
| Secondary | Teal-gray | Secondary actions |
| Accent | Orange | Highlights |
| Background | Off-white | Page background |
| Surface | White | Cards |
| Text | Dark gray | Body text |

### 2.2 Dark Theme

| Role | Color | Usage |
|------|-------|-------|
| Primary | Light blue | Buttons, links |
| Secondary | Purple-gray | Secondary actions |
| Accent | Pink | Highlights |
| Background | Dark gray | Page background |
| Surface | Darker gray | Cards |
| Text | Light gray | Body text |

### 2.3 Coffee Theme

| Role | Color | Usage |
|------|-------|-------|
| Primary | Warm blue | Buttons, links |
| Secondary | Green-gray | Secondary actions |
| Accent | Orange | Highlights |
| Background | Coffee brown | Page background |
| Surface | Dark brown | Cards |
| Text | Cream | Body text |

### 2.4 Nord Theme

| Role | Color | Usage |
|------|-------|-------|
| Primary | Blue | Buttons, links |
| Secondary | Purple-gray | Secondary actions |
| Accent | Cyan | Highlights |
| Background | Cool gray | Page background |
| Surface | White | Cards |
| Text | Dark blue-gray | Body text |

## 3. Typography

### 3.1 Font Family

| Element | Font | Weight |
|---------|------|--------|
| Logo | Montserrat | 700 |
| Headings | Montserrat | 700 |
| Body | Montserrat | 400 |
| Code/JSON | Monospace | 400 |

### 3.2 Font Sizes

| Element | Size |
|---------|------|
| Logo | 1.5rem (24px) |
| H1 | 2rem (32px) |
| H2 | 1.5rem (24px) |
| H3 | 1.25rem (20px) |
| Body | 1rem (16px) |
| Small | 0.875rem (14px) |
| Caption | 0.75rem (12px) |

### 3.3 Line Heights

| Element | Line Height |
|---------|-----------|
| Headings | 1.2 |
| Body | 1.5 |
| Small | 1.4 |

## 4. Spacing System

### 4.1 Base Unit

Base unit: 4px

### 4.2 Spacing Scale

| Token | Value |
|-------|-------|
| `xs` | 0.25rem (4px) |
| `sm` | 0.5rem (8px) |
| `md` | 1rem (16px) |
| `lg` | 1.5rem (24px) |
| `xl` | 2rem (32px) |
| `2xl` | 3rem (48px) |

### 4.3 Component Spacing

| Component | Spacing |
|-----------|---------|
| Card padding | 1.5rem |
| Card gap | 1.5rem |
| Section padding | 2rem |
| Section gap | 3rem |

## 5. Component Styling

### 5.1 Cards

| Property | Value |
|----------|-------|
| Background | `--color-base-100` |
| Border | 1px solid `--color-base-300` |
| Border radius | `--radius-box` (1rem) |
| Shadow | Subtle elevation |
| Padding | 1.5rem |

### 5.2 Buttons

| Variant | Background | Text |
|---------|-----------|------|
| Primary | `--color-primary` | `--color-primary-content` |
| Secondary | `--color-secondary` | `--color-secondary-content` |
| Ghost | Transparent | `--color-base-content` |

### 5.3 Badges

| Type | Style |
|------|-------|
| Difficulty | Colored pill (beginner=green, intermediate=yellow, advanced=red) |
| Tag | Outline pill |
| Status | Colored pill (stable=green, beta=yellow, experimental=red) |

### 5.4 Tabs

| State | Style |
|-------|-------|
| Default | Outlined |
| Active | Filled with primary color |
| Hover | Slight background change |

## 5. Variant Display & Behavior

### 5.1 Variant Dropdown Selector

Appears on profile detail pages when the profile has variants (Pattern B or C):

**Location:** Next to the Download button in the profile header

**Interaction:**
- Displays as a dropdown selector (HTML `<select>` or custom dropdown)
- Shows variant labels (e.g., "18g dose", "20g dose")
- Default: First variant selected
- User can select different variants from dropdown

**Behavior on Selection:**
1. Chart updates instantly with selected variant's profile data (no animation)
2. Parameters section updates (temperature, pressure, phases)
3. Phases table updates to show selected variant's phase data
4. Download button remains ready to download selected variant's profile file

### 5.2 Example Flow

For a profile "9 Bar Espresso" with 18g and 20g variants:

```
Profile: 9 Bar Espresso (Beginner)
[Variant: 18g dose ▼]  [Download]

Chart shows 18g phase data
Parameters: Temp 93°C, Pressure 9 bar, Duration 28s

User selects "20g dose" from dropdown:

Chart updates instantly to show 20g phase data
Parameters: Temp 93°C, Pressure 9 bar, Duration 28s (may differ)
[Download] now downloads 20g.json
```

### 5.3 Versioning vs. Variants

When a profile has both version tabs AND variant dropdown:

- **Version Tabs** (top level): Show profile evolution over time
  - "v1.0.0" | "v2.0.0-beta" | "v2.0.0"
- **Variant Dropdown** (below version selection): Show options within selected version
  - "Standard", "18g dose", "20g dose"
- **Chart Updates:** After selecting both version and variant
  - Chart shows: selected version → selected variant's data

### 5.4 Visual Styling

| Element | Style |
|---------|-------|
| Variant Label | Same as tab styling (outlined → filled on active) |
| Dropdown Arrow | `--color-base-content` |
| Hover State | Slight background color change |
| Selected State | Primary color background |

---

## 7. Layout

### 7.1 Page Layout

```
+------------------------------------------+
|                  HEADER                   |
|  [Logo]  Title           [Theme ▼]      |
+------------------------------------------+
|                                          |
|              PAGE CONTENT                |
|                                          |
+------------------------------------------+
|                  FOOTER                  |
|         Copyright / Links                |
+------------------------------------------+
```

### 7.2 Grid System

| Breakpoint | Columns |
|------------|---------|
| < 640px | 1 |
| 640-1024px | 2 |
| > 1024px | 3-4 |

### 7.3 Max Width

| Area | Max Width |
|------|-----------|
| Page | 1280px |
| Content | 1024px |
| Card grid | Auto (responsive) |

## 8. Responsive Breakpoints

| Name | Width | Target |
|------|-------|--------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet portrait |
| lg | 1024px | Tablet landscape |
| xl | 1280px | Desktop |
| 2xl | 1536px | Large desktop |

## 9. Visual Effects

### 9.1 Shadows

| Level | Usage |
|-------|-------|
| sm | Subtle elements |
| md | Cards |
| lg | Modals/dropdowns |

### 9.2 Transitions

| Property | Duration | Easing |
|----------|---------|--------|
| Color | 200ms | ease |
| Transform | 200ms | ease |
| Opacity | 200ms | ease |

### 9.3 Animations

| Animation | Usage |
|-----------|-------|
| Fade in | Page load, modals |
| Slide | Dropdowns |
| Scale | Button hover |

---

## See Also

- [Appendix A: Color Tokens](./Appendices/A-ColorTokens.md)
- [Appendix B: Font Definitions](./Appendices/B-FontDefinitions.md)
- [Appendix D: Wireframes](./Appendices/D-Wireframes.md)