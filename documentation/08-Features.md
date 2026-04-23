# Features

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Search & Filtering

### 1.1 Overview

The homepage includes advanced search and filtering capabilities to help users find profiles.

### 1.2 Search Implementation

| Feature | Implementation |
|---------|--------------|
| **Library** | Pagefind |
| **Index** | Build-time static index |
| **Bundle Size** | ~10KB runtime |
| **Search Speed** | <100ms for 200+ profiles |
| **Features** | Full-text, fuzzy matching, highlighting |

### 1.3 Search Behavior

| Feature | Details |
|---------|---------|
| Text search | Searches displayName, name, description, author, tags |
| Fuzzy matching | Automatically handled by Pagefind |
| Debounce | 300ms delay before search |
| Results | Real-time grid updates |
| Highlighting | Matched terms highlighted in results |
| Empty state | Helpful message when no results |

### 1.4 Filters

| Filter | Type | Options |
|--------|------|--------|
| Complexity | Single select | All, Low, Mid, High |
| Tags | Multi select | All tags from profiles |
| Machine | Single select | All, then individual machines |
| Sort | Single select | Newest, A-Z, Difficulty |

**Filter + Search Behavior:**
- Filters narrow down the search index
- Search then queries within filtered results
- All filters can be combined with search

### 1.5 Filter State

```typescript
interface FilterState {
  search: string;      // Empty = no text filter
  tags: string[];      // Empty = no tag filter
  complexity: string;  // "all" = no complexity filter
  machine: string;     // "all" = no machine filter
  sort: 'newest' | 'alpha' | 'complexity';
  page: number;        // Current pagination page
}
```

### 1.6 UI Components

| Component | Description |
|-----------|-------------|
| Search input | Text field with search icon, powered by Pagefind |
| Complexity pills | Horizontal button group |
| Tag dropdown | Multi-select dropdown with checkboxes |
| Machine dropdown | Single-select dropdown |
| Sort dropdown | Single-select dropdown |
| Active filters | Chips showing active filters with X to remove |
| Clear all | Button to reset all filters |
| Results count | "Showing X of Y profiles" |

### 1.7 Pagination

| Feature | Implementation |
|---------|--------------|
| **Type** | Traditional numbered pagination |
| **Profiles per page** | 24 profiles |
| **Navigation** | Previous, 1, 2, 3, ..., Next |
| **URL** | `/?page=2` for page 2 |
| **State** | Preserved in URL for bookmarking |

#### Pagination Behavior

- Page 1 shows profiles 1-24
- Page 2 shows profiles 25-48
- Filters/search reset to page 1
- Last page shows remaining profiles (may be < 24)

#### Pagination Controls

```
Showing 25-48 of 156 profiles

[← Previous]  [1]  [2]  [3]  [4]  [5]  ...  [7]  [Next →]
```

- Current page highlighted in primary color
- Previous/Next disabled when at boundaries
- Shows max 7 page numbers with ellipsis

### 1.8 Empty State

When no profiles match:

```
No profiles found matching your filters.

Try:
- Removing some filters
- Using different search terms
- Clearing all filters

[Clear All Filters]
```

---

## 2. Chart Generation

### 2.1 Overview

Charts visualize the pressure/flow profile as generated from the JSON data.

### 2.2 Implementation

The chart logic is ported from Gaggimate's `ExtendedProfileChart.jsx` as vanilla JavaScript.

### 2.3 Data Processing

```typescript
// Phase data → Chart data points
function prepareData(phases: Phase[], target: 'pressure' | 'flow'): DataPoint[] {
  // Generates data points at 0.1s intervals
  // Applies easing functions for transitions
  // Handles flow/pressure target switching
}
```

### 2.4 Easing Functions

| Function | Curve |
|----------|-------|
| `linear` | Straight line |
| `ease-in` | t² |
| `ease-out` | 1 - (1-t)² |
| `ease-in-out` | S-curve |

### 2.5 Chart Configuration

| Setting | Value |
|---------|-------|
| Type | Line chart |
| X-Axis | Time (seconds) |
| Y-Axis Left | Pressure (bar), 0-12, labels at 0, 2, 4, 6, 8, 10, 12 |
| Y-Axis Right | Flow (ml/s), 0-10, labels at 0, 2, 4, 6, 8, 10 |
| Line style | Solid for target, dashed for secondary |
| Points | Hidden |
| Hover | Tooltip with values |

### 2.6 Chart Data Loading

| Aspect | Implementation |
|--------|--------------|
| **Strategy** | Fetch profile JSON at runtime |
| **Source** | `/profiles/{name}/{file}` |
| **Caching** | Browser HTTP cache |
| **Preloading** | `<link rel="preload">` on profile page |

#### Loading Flow

```
1. Profile page loads (static HTML)
2. Preload link fetches profile JSON
3. Chart component mounts
4. If JSON cached: instant render
5. If not cached: show loading skeleton
6. Fetch completes → render chart
```

#### Error Handling

| Error | Behavior |
|-------|---------|
| Fetch fails | Show error message with retry button |
| Invalid JSON | Show error message, contact author |
| Missing phases | Show error, profile still visible |

#### Loading State

While fetching profile data:

```
+--------------------------------+
|                                |
|    Loading chart...            |
|    [Skeleton animation]        |
|                                |
+--------------------------------+
```

#### Implementation

```javascript
async function loadProfileData(profilePath) {
  try {
    const response = await fetch(profilePath);
    if (!response.ok) throw new Error('Profile not found');
    return await response.json();
  } catch (error) {
    showChartError(error);
    return null;
  }
}
```

### 2.7 Phase Annotations

| Element | Description |
|---------|-------------|
| Vertical lines | Phase boundaries |
| Labels | Phase names (rotated) |
| Colors | Match theme |
| Positioning | Automatic based on chart width |

### 2.8 Legend

| Item | Display |
|------|--------|
| Pressure | Solid line, left axis |
| Flow | Dashed line, right axis |

---

## 3. Variant Selection & Chart Updates

### 3.1 Overview

When a profile has variants (Pattern B or C), users can select different variants from a dropdown. The chart updates dynamically to show the selected variant's data.

### 3.2 How Variants Work

1. **Display:** Variant dropdown selector appears when profile has variants
2. **Selection:** User selects variant from dropdown
3. **Chart Update:** Selected variant's profile data loads and chart re-renders
4. **Parameters Update:** All profile parameters (temperature, pressure) update
5. **Download:** User can download selected variant's profile file

### 3.3 Chart Animation Behavior

- **Static Rendering:** Chart renders without animation
- **No Transitions:** No fade/transition effects between variant changes
- **Instant Update:** Chart data updates immediately when variant selected
- **No Line Draw Animation:** Chart displays complete immediately
- **Tooltips Only:** Hover tooltips are the only interactive animation

### 3.4 Versioning + Variants Combined

When profile has both versions and variants:

1. User selects version first (tabs)
2. Then selects variant within that version (dropdown)
3. Chart shows variant data from selected version
4. Download button downloads that specific variant's file

### 3.5 Flow Example

```
User Views Profile: "9 Bar Espresso"
├─ Variant Dropdown shows: "18g dose" (default)
├─ Chart displays 18g variant data
└─ Download button downloads 18g.json

User selects "20g dose" from dropdown:
├─ Chart instantly updates with 20g data
├─ Parameters section updates
├─ Download button now downloads 20g.json
└─ No animation effects during update
```

---

## 4. Download System

### 4.1 Overview

Downloads allow users to save profile JSON files to their devices.

### 4.2 Path Resolution

| downloadPath | Behavior |
|--------------|----------|
| File path (ends in .json) | Direct download |
| Folder path (ends in /) | Show dropdown |

### 4.3 Download Button

For single file:

```
[📥 Download Profile]
```

- Triggers browser download
- Uses profile name for filename

### 4.4 Download Dropdown

For folder path:

```
[📥 Download ▼]
   ├─ 9bar.json
   ├─ v01/
   │   ├─ 18g.json
   │   └─ 20g.json
   └─ v02/
       ├─ 18g.json
       └─ 20g.json
```

### 4.5 File Discovery

Files in the folder are discovered at build time:

```javascript
// Scan folder for JSON files
function getDownloadableFiles(folderPath: string): File[] {
  // Returns nested structure for display
}
```

### 4.6 Download Flow

1. User clicks download button/dropdown item
2. Browser navigates to file URL
3. Browser handles download natively

---

## 5. Error Handling

### 5.1 Overview

The system handles errors gracefully without breaking builds or pages.

### 5.2 Build Time Errors

| Error | Behavior |
|-------|---------|
| Invalid JSON | Skip file, log error, continue build |
| Missing required field | Add error to validation report |
| Missing optional field | Use default or hide field |

### 5.3 Runtime Errors

| Error | Behavior |
|-------|---------|
| Chart render failure | Show error message, profile still visible |
| Missing image | Show placeholder |
| Invalid theme | Fall back to light |

### 5.4 Error Display

#### Card Error

```
+--------------------------------+
|  ⚠️ Error Loading Profile     |
|                                |
|  Missing required field:       |
|  downloadPath                 |
|                                |
|  Contact the profile author   |
|  to fix this issue.           |
+--------------------------------+
```

#### Chart Error

```
+--------------------------------+
|  ⚠️ Chart unavailable        |
|                                |
|  Profile data could not be     |
|  visualized.                 |
+--------------------------------+
```

### 4.5 Validation Report

CI generates a validation report:

```json
{
  "profiles": 15,
  "valid": 13,
  "errors": [
    {
      "profile": "9bar",
      "file": "index.json",
      "errors": ["Missing downloadPath"]
    }
  ]
}
```

---

## 5. Theme System

### 5.1 Overview

Four DaisyUI themes are available, matching the Gaggimate UI.

### 5.2 Themes

| Theme | Description |
|-------|-------------|
| light | Default light theme |
| dark | Dark theme |
| coffee | Coffee-inspired warm dark |
| nord | Light nordic theme |

### 5.3 Persistence

```javascript
// Save to localStorage
localStorage.setItem('gaggimate-daisyui-theme', 'coffee');

// Load on page init
const theme = localStorage.getItem('gaggimate-daisyui-theme') || 'light';
```

### 5.4 Switching

```javascript
function setTheme(theme: string) {
  if (AVAILABLE_THEMES.includes(theme)) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gaggimate-daisyui-theme', theme);
  }
}
```

### 5.5 Available Themes List

```javascript
const AVAILABLE_THEMES = ['light', 'dark', 'coffee', 'nord'];
```

---

## 6. Version/Variant Navigation

### 6.1 Overview

Flexible navigation system for profiles with multiple versions and variants.

### 6.2 URL Structure

| Pattern | Description |
|---------|-------------|
| `/profiles/{name}/` | Default version/variant |
| `/profiles/{name}/?v={versionId}` | Specific version |
| `/profiles/{name}/?v={versionId}&var={variantId}` | Specific version + variant |

### 6.3 Default Selection

| Condition | Default |
|-----------|---------|
| Single version | That version |
| Multiple versions | First version |
| Single variant | That variant |
| Multiple variants | First variant |

### 6.4 State Management

```typescript
interface ProfileState {
  profile: ProfileIndex;
  activeVersion: string;
  activeVariant: string;
  profileData: ProfileData;
}
```

### 6.5 Tab Behavior

| Action | Result |
|--------|--------|
| Click version tab | Update URL, load variant data |
| Click variant tab | Update chart, update parameters |
| No versions | Version tabs hidden |
| No variants | Variant tabs hidden |

---

## 7. Markdown Rendering

### 7.1 Overview

Profile descriptions support markdown formatting.

### 7.2 Supported Syntax

| Syntax | Rendered |
|--------|---------|
| `# Heading` | H1 |
| `## Heading` | H2 |
| `**bold**` | Bold |
| `*italic*` | Italic |
| `- list` | Bullet list |
| `[link](url)` | Link |
| `` `code` `` | Inline code |

### 7.3 Security

Markdown is sanitized to prevent XSS:
- No raw HTML
- Links sanitized
- Script tags stripped

---

## 8. Image Handling

### 8.1 Profile Pictures

| Source | Display |
|--------|--------|
| `picture` field set | Load from path |
| No picture | Show placeholder |
| Image load error | Show placeholder |

### 8.2 Placeholder

Generated SVG with profile initials:

```
+--------------------+
|      9B           |
+--------------------+
```

### 8.3 Image Optimization

| Aspect | Implementation |
|--------|---------------|
| Format | WebP with JPEG fallback |
| Sizing | Responsive srcset |
| Loading | Lazy loading |