# Components

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Component Overview

| Component | Category | Description |
|-----------|----------|------------|
| ProfileCard | Cards | Profile preview card |
| ProfileChart | Charts | Pressure/flow visualization |
| Header | Navigation | Page header with logo and theme |
| ThemeSelector | Navigation | Theme switcher dropdown |
| VersionTabs | Tabs | Version navigation |
| VariantTabs | Tabs | Variant navigation |
| DownloadButton | Download | Single file download |
| DownloadDropdown | Download | Multi-file download selector |
| Badge | UI | Status/tag badges |
| Link | UI | External link display |
| ParameterTable | UI | Parameter display grid |
| FilterBar | Filters | Search and filter controls |

---

## 2. ProfileCard

### 2.1 Description

Displays a profile preview in the card grid on the homepage.

### 2.2 Props

```typescript
interface ProfileCardProps {
  profile: ProfileIndex;
  className?: string;
}
```

### 2.3 Properties

| Prop | Type | Required | Description |
|------|------|----------|------------|
| `profile` | ProfileIndex | Yes | Profile index data |
| `className` | string | No | Additional CSS classes |

### 2.4 ProfileIndex Type

```typescript
interface ProfileIndex {
  name: string;
  displayName?: string;
  picture?: string;
  author?: string;
  date?: string;
  complexity?: 'low' | 'mid' | 'high';
  tags?: string[];
  link?: string;
  downloadPath: string;
  versions?: Array<{
    id: string;
    variants?: Array<{ id: string }>;
  }>;
  variants?: Array<{
    id: string;
  }>;
}
```

### 2.5 Visual States

| State | Display |
|-------|---------|
| Default | Card with image, name, complexity badge |
| Hover | Slight elevation, border highlight |
| Error | Error banner on card |
| Loading | Skeleton placeholder |

### 2.6 Example Usage

```astro
<ProfileCard profile={profile} className="hover:shadow-lg" />
```

### 2.7 Visual Output

```
+--------------------------------+
|  [Profile Image]               |
|                                |
|  Profile Name                  |
|  Author • Date                 |
|                                |
|  Profile Complexity: [Low] [Espresso]        |
|                                |
|  🔗 Discord Thread           |
+--------------------------------+
```

---

## 3. ProfileChart

### 3.1 Description

Displays the pressure/flow profile chart using Chart.js.

### 3.2 Props

```typescript
interface ProfileChartProps {
  profile: ProfileData;
  className?: string;
  selectedPhase?: number | null;
}
```

### 3.3 Properties

| Prop | Type | Required | Description |
|------|------|----------|------------|
| `profile` | ProfileData | Yes | Gaggimate profile JSON |
| `className` | string | No | Container CSS classes |
| `selectedPhase` | number | No | Active phase index (null for none) |

### 3.4 ProfileData Type

```typescript
interface ProfileData {
  id: string;
  label?: string;
  type: 'standard' | 'pro';
  temperature?: number;
  phases: Array<{
    name: string;
    phase: 'preinfusion' | 'brew';
    valve: 0 | 1;
    duration: number;
    temperature?: number;
    pump?: {
      target: 'pressure' | 'flow';
      pressure?: number;
      flow?: number;
    };
    transition?: {
      type: 'instant' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
      duration?: number;
      adaptive?: boolean;
    };
    targets?: Array<{
      type: 'volumetric' | 'pressure' | 'flow' | 'pumped';
      operator?: 'gte' | 'lte';
      value: number;
    }>;
  }>;
}
```

### 3.5 Visual States

| State | Display |
|-------|---------|
| Default | Chart with pressure/flow lines |
| Loading | Chart skeleton |
| Empty | No chart message |
| Error | Error message |

### 3.6 Chart Configuration

| Setting | Value |
|---------|-------|
| Type | Line chart |
| X-Axis | Time (seconds) |
| Y-Axis Left | Pressure (bar), 0-12 |
| Y-Axis Right | Flow (ml/s), 0-10 |
| Animation | Disabled |
| Points | Hidden (radius: 0) |
| Interpolation | Monotone |
| Phase Annotations | Vertical lines with labels |

### 3.7 Example Usage

```astro
<ProfileChart profile={profileData} selectedPhase={null} />
```

---

## 4. ThemeSelector

### 4.1 Description

Dropdown selector for switching between DaisyUI themes.

### 4.2 Props

```typescript
interface ThemeSelectorProps {
  className?: string;
}
```

### 4.3 Properties

| Prop | Type | Required | Description |
|------|------|----------|------------|
| `className` | string | No | CSS classes |

### 4.4 Theme Options

| Value | Label |
|-------|-------|
| `light` | Light |
| `dark` | Dark |
| `coffee` | Coffee |
| `nord` | Nord |

### 4.5 Behavior

| Action | Result |
|--------|--------|
| Page load | Apply stored theme or default |
| Selection | Update `data-theme`, persist to localStorage |
| Invalid theme | Ignore selection |

### 4.6 Visual Output

```
[Theme ▼]
   └─ Light
   ├─ Dark
   ├─ Coffee
   └─ Nord
```

---

## 5. VersionTabs

### 5.1 Description

Tab navigation for profile versions.

### 5.2 Props

```typescript
interface VersionTabsProps {
  versions: Array<{
    id: string;
    label?: string;
    status?: 'stable' | 'beta' | 'experimental';
  }>;
  activeVersion: string;
  onSelect: (id: string) => void;
  className?: string;
}
```

### 5.3 Properties

| Prop | Type | Required | Description |
|------|------|----------|------------|
| `versions` | Version[] | Yes | List of versions |
| `activeVersion` | string | Yes | Currently active version id |
| `onSelect` | function | Yes | Callback when version selected |
| `className` | string | No | CSS classes |

### 5.4 Version Type

```typescript
interface Version {
  id: string;
  label?: string;
  status?: 'stable' | 'beta' | 'experimental';
}
```

### 5.5 Visual States

| State | Display |
|-------|---------|
| Default | Horizontal tabs |
| Active | Filled background |
| Hover | Slight background |
| Single version | Tabs hidden |

### 5.6 Example Usage

```astro
<VersionTabs
  versions={profile.versions}
  activeVersion={activeVersionId}
  onSelect={(id) => setActiveVersion(id)}
/>
```

---

## 6. VariantSelector

### 6.1 Description

Dropdown selector for profile variants. Updates chart and parameters when user selects a different variant.

### 6.2 Props

```typescript
interface VariantSelectorProps {
  variants: Array<{
    id: string;
    label: string;
  }>;
  selectedVariantId: string;
  onSelect: (id: string) => void;
  className?: string;
}
```

### 6.3 Properties

| Prop | Type | Required | Description |
|------|------|----------|------------|
| `variants` | Variant[] | Yes | List of variants |
| `selectedVariantId` | string | Yes | Currently selected variant id |
| `onSelect` | function | Yes | Callback when variant selected |
| `className` | string | No | CSS classes |

### 6.4 Variant Type

```typescript
interface Variant {
  id: string;
  label: string;
}
```

### 6.5 Visual States

| State | Display |
|-------|---------|
| Default | Dropdown selector |
| Selected | Shows selected variant label |
| Hover | Slight background highlight |
| Open | Dropdown list visible |
| Single variant | Selector hidden |

### 6.6 Behavior

When variant is selected:
1. `onSelect` callback fires with selected variant id
2. Parent component fetches variant's profile data
3. Chart component receives new phase data and re-renders instantly (no animation)
4. Parameters section updates with new temperature/pressure values
5. Download button remains ready to download selected variant

### 6.7 Integration with Chart

```astro
<VariantSelector 
  variants={profile.variants}
  selectedVariantId={activeVariantId}
  onSelect={(id) => {
    // Load variant profile data
    const variantProfile = loadVariant(id)
    // Update chart
    updateChart(variantProfile)
    // Update parameters
    updateParameters(variantProfile)
  }}
/>
```

---

## 7. DownloadButton

### 7.1 Description

Single-file download button.

### 7.2 Props

```typescript
interface DownloadButtonProps {
  href: string;
  label?: string;
  className?: string;
}
```

### 7.3 Properties

| Prop | Type | Required | Description |
|------|------|----------|------------|
| `href` | string | Yes | Download URL |
| `label` | string | No | Button label |
| `className` | string | No | CSS classes |

### 7.4 Visual Output

```
[📥 Download JSON]
```

---

## 8. DownloadDropdown

### 8.1 Description

Multi-file download selector with dropdown.

### 8.2 Props

```typescript
interface DownloadDropdownProps {
  files: Array<{
    href: string;
    label: string;
  }>;
  defaultLabel?: string;
  className?: string;
}
```

### 8.3 Properties

| Prop | Type | Required | Description |
|------|------|----------|------------|
| `files` | File[] | Yes | Downloadable files |
| `defaultLabel` | string | No | Default button label |
| `className` | string | No | CSS classes |

### 8.4 File Type

```typescript
interface File {
  href: string;
  label: string;
}
```

### 8.5 Visual Output

```
[📥 Download ▼]
   ├─ v01/18g.json
   ├─ v01/20g.json
   ├─ v02/18g.json
   └─ v02/20g.json
```

---

## 9. Badge

### 9.1 Description

Reusable badge/pill component.

### 9.2 Props

```typescript
interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'accent' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

### 9.3 Properties

| Prop | Type | Required | Description |
|------|------|----------|------------|
| `variant` | string | No | Color variant |
| `size` | string | No | Badge size |
| `className` | string | No | CSS classes |

### 9.4 Variants

| Value | Usage |
|-------|-------|
| `primary` | Main actions, primary info |
| `secondary` | Secondary info |
| `accent` | Highlights |
| `neutral` | Default, tags |

### 9.5 Special Badges

| Type | Implementation |
|------|---------------|
| Difficulty | Color by level (green/yellow/red) |
| Status | Color by status (stable/beta/experimental) |
| Tag | Outline style |

---

## 10. Link

### 10.1 Description

External link with icon.

### 10.2 Props

```typescript
interface LinkProps {
  href: string;
  icon?: 'discord' | 'download' | 'external';
  children: string;
  className?: string;
}
```

### 10.2 Properties

| Prop | Type | Required | Description |
|------|------|----------|------------|
| `href` | string | Yes | Link URL |
| `icon` | string | No | Icon type |
| `children` | string | Yes | Link text |
| `className` | string | No | CSS classes |

### 10.3 Icon Types

| Value | Icon |
|-------|------|
| `discord` | Discord icon |
| `download` | Download icon |
| `external` | External link icon |

### 10.4 Visual Output

```
🔗 Discord Thread
```

---

## 11. ParameterTable

### 11.1 Description

Grid display for profile parameters.

### 11.2 Props

```typescript
interface ParameterTableProps {
  parameters: Record<string, string | number>;
  className?: string;
}
```

### 11.3 Properties

| Prop | Type | Required | Description |
|------|------|----------|------------|
| `parameters` | object | Yes | Key-value pairs |
| `className` | string | No | CSS classes |

### 11.4 Visual Output

```
+------------------+------------------+
| Basket:          | VST Precision    |
| Brew Ratio:     | 1:2.5           |
| Dose:           | 18g             |
| Yield:          | 45g             |
+------------------+------------------+
```

---

## 12. FilterBar

### 12.1 Description

Search and filter controls for the homepage.

### 12.2 Props

```typescript
interface FilterBarProps {
  tags: string[];
  difficulties: string[];
  machines: string[];
  className?: string;
}
```

### 12.3 Properties

| Prop | Type | Required | Description |
|------|------|----------|------------|
| `tags` | string[] | Yes | Available tags |
| `difficulties` | string[] | Yes | Difficulty levels |
| `machines` | string[] | Yes | Machine compatibility |
| `className` | string | No | CSS classes |

### 12.4 Filter State

```typescript
interface FilterState {
  search: string;
  tags: string[];
  difficulty: string | null;
  machine: string | null;
}
```

### 12.5 Events

| Event | Payload | Description |
|-------|--------|------------|
| `filter-change` | FilterState | Filter updated |

---

## 13. Utility Components

### 13.1 Header

```typescript
interface HeaderProps {
  title?: string;
  className?: string;
}
```

### 13.2 Footer

```typescript
interface FooterProps {
  className?: string;
}
```

### 13.3 Breadcrumb

```typescript
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
  className?: string;
}
```