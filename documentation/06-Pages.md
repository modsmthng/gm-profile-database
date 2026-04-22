# Page Layouts

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Page Types

| Page | Route | Description |
|------|-------|------------|
| Homepage | `/` | Profile card grid with search/filter |
| Profile Page | `/profiles/{name}/` | Profile details with chart |
| 404 | `/404` | Not found page |

## 2. Homepage Layout

### 2.1 Page Structure

```
+----------------------------------------------------------+
|  HEADER                                                  |
|  [Logo] Gaggimate Profiles      [Theme ▼] [Search]      |
+----------------------------------------------------------+
|                                                          |
|  HERO SECTION                                            |
|  +----------------------------------------------------+  |
|  |  "Find Your Perfect Profile"                       |  |
|  |  Browse community profiles or submit your own      |  |
|  +----------------------------------------------------+  |
|                                                          |
|  FILTER BAR                                             |
|  +----------------------------------------------------+  |
|  | [All] [Beginner] [Intermediate] [Advanced]       |  |
|  | Tags: [Espresso ▼] [Pressure ▼] [Flow ▼]        |  |
|  +----------------------------------------------------+  |
|                                                          |
|  PROFILE GRID                                           |
|  +------------+ +------------+ +------------+            |
|  | [Card]     | | [Card]     | | [Card]     |            |
|  |            | |            | |            |            |
|  +------------+ +------------+ +------------+            |
|  +------------+ +------------+ +------------+            |
|  | [Card]     | | [Card]     | | [Card]     |            |
|  |            | |            | |            |            |
|  +------------+ +------------+ +------------+            |
|                                                          |
+----------------------------------------------------------+
|  FOOTER                                                  |
|  [About] [Contributing] [GitHub]      CC BY-NC-SA 4.0     |
+----------------------------------------------------------+
```

### 2.2 Section Details

#### Header
- Logo (left)
- Title: "Gaggimate Profiles"
- Theme selector (right)
- Search input (right, collapsible on mobile)

#### Hero Section
- Headline: "Find Your Perfect Profile"
- Subheadline: "Browse community-created brewing profiles"
- CTA button: "Submit Your Profile"

#### Filter Bar
- Difficulty badges: All, Beginner, Intermediate, Advanced
- Tag dropdown (multi-select)
- Machine compatibility dropdown
- Active filter chips with clear option

#### Profile Grid
- Responsive grid of ProfileCards
- Loading state with skeleton cards
- Empty state: "No profiles found"

## 3. Profile Page Layout

### 3.1 Page Structure

```
+----------------------------------------------------------+
|  HEADER                                                  |
|  [Logo] Gaggimate Profiles      [Theme ▼]               |
+----------------------------------------------------------+
|                                                          |
|  BREADCRUMB                                             |
|  Home > Profiles > [Profile Name]                        |
|                                                          |
|  PROFILE HEADER                                         |
|  +----------------------------------------------------+  |
|  | [Profile Picture]                                  |  |
|  |                                                   |  |
|  |  Profile Name                                     |  |
|  |  Author • Date                                    |  |
|  |                                                   |  |
|  |  [Difficulty Badge] [Tags...]                    |  |
|  |                                                   |  |
|  |  [Description text...]                           |  |
|  |                                                   |  |
|  |  [🔗 Discord Thread]  [📥 Download]             |  |
|  +----------------------------------------------------+  |
|                                                          |
|  VERSION TABS (if versions exist)                        |
|  +----------------------------------------------------+  |
|  | [v1.0.0] [v2.0.0-beta] [v2.0.0]               |  |
|  +----------------------------------------------------+  |
|                                                          |
|  VARIANT SELECTOR (if variants exist)                    |
|  +----------------------------------------------------+  |
|  | [Variant: 18g dose ▼]  [📥 Download]           |  |
|  +----------------------------------------------------+  |
|                                                          |
|  PARAMETER TABLE                                        |
|  +----------------------------------------------------+  |
|  | Basket:     VST Precision 18g                   |  |
|  | Brew Ratio: 1:2.5                                |  |
|  | Dose:       18g                                  |  |
|  | Yield:      45g                                  |  |
|  | Temp:       90-96°C                               |  |
|  | Time:       25-35s                                |  |
|  | Grind:      Fine                                  |  |
|  +----------------------------------------------------+  |
|                                                          |
|  CHART SECTION                                          |
|  +----------------------------------------------------+  |
|  |                   Pressure/Time                  |  |
|  |  12┤                                              |  |
|  |  10┤        ╭──╮                                  |  |
|  |   8┤    ╭──╯  ╰──╮    ╭──╮                       |  |
|  |   6┤╭──╯        ╭──╯  ╰──╮                       |  |
|  |   4┤╰────────────────────────╯                      |  |
|  |   2┤                                              |  |
|  |   0┼──────┬──────┬──────┬──────┬──────→          |  |
|  |        10s   20s   30s   40s   50s               |  |
|  |                                                   |  |
|  |  Legend: ── Pressure  - - Flow                    |  |
|  |                                                   |  |
|  +----------------------------------------------------+  |
|                                                          |
|  PHASES TABLE                                           |
|  +----------------------------------------------------+  |
|  | Phase          | Duration | Pressure | Flow      |  |
|  | Preinfusion    | 3s       | 1 bar    | 4 ml/s   |  |
|  | Ramp          | 2s       | 9 bar    | -        |  |
|  | Main Brew     | 25s      | 9 bar    | -        |  |
|  | Finish       | 5s       | 3 bar    | -        |  |
|  +----------------------------------------------------+  |
|                                                          |
|  DOWNLOAD SECTION                                       |
|  +----------------------------------------------------+  |
|  | [Download VST 18g JSON ▼]                        |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
|  FOOTER                                                  |
|  [About] [Contributing] [GitHub]      CC BY-NC-SA 4.0     |
+----------------------------------------------------------+
```

### 3.2 Section Details

#### Profile Header
- Profile picture (if available, placeholder if not)
- Display name (from index.json or name)
- Author and date
- Difficulty badge
- Tags as pills
- Description (markdown rendered)
- Discord link (icon + text)
- Download button

#### Version Tabs
- Displayed only if versions array exists
- Each tab shows version label (or id)
- Active tab highlighted
- Dropdown on mobile

#### Variant Selector
- Displayed as dropdown when variants exist (profile-level or version-level)
- Shows variant label as selected option
- On selection: Chart and parameters update instantly (no animation)
- Download button downloads selected variant's profile file
- Appears alongside Download button in profile header

#### Display Rules
- **Version Tabs:** Show only if profile has versions (Pattern C)
- **Variant Selector:** Show only if profile has variants (Pattern B or C)
- **Chart Updates:** When variant/version selected, chart refreshes with new data immediately
- **Both Present:** Tabs appear first (for version selection), then variant dropdown (for selection within version)

#### Parameter Table
- Grid of key parameters
- Hidden fields that are empty/missing
- Grouped by category

#### Chart Section
- Profile chart with phases
- Legend for pressure/flow
- Phase labels on x-axis
- Hover tooltips with values

#### Phases Table
- Detailed phase breakdown
- Sortable columns
- Collapsible on mobile

#### Download Section
- Single file: Direct download button
- Folder: Dropdown with file list

## 4. 404 Page Layout

```
+----------------------------------------------------------+
|  HEADER                                                  |
|  [Logo] Gaggimate Profiles      [Theme ▼]               |
+----------------------------------------------------------+
|                                                          |
|  CONTENT                                                 |
|  +----------------------------------------------------+  |
|  |                                                   |  |
|  |                    404                           |  |
|  |                                                   |  |
|  |           Page Not Found                         |  |
|  |                                                   |  |
|  |    The page you're looking for doesn't exist.      |  |
|  |                                                   |  |
|  |         [← Back to Profiles]                     |  |
|  |                                                   |  |
|  +----------------------------------------------------+  |
|                                                          |
+----------------------------------------------------------+
|  FOOTER                                                  |
+----------------------------------------------------------+
```

## 5. Navigation Flow

### 5.1 User Flows

| Flow | Path |
|------|------|
| Browse | Homepage → ProfileCard → Profile Page |
| Search | Homepage → Search → Profile Page |
| Filter | Homepage → Filter → ProfileCard → Profile Page |
| Download | Profile Page → DownloadButton → File |

### 5.2 Breadcrumbs

| Page | Breadcrumb |
|------|------------|
| Homepage | Home |
| Profile Page | Home > Profiles > {name} |

## 6. Responsive Behavior

### 6.1 Mobile (< 640px)

| Element | Behavior |
|---------|---------|
| Grid | Single column |
| Tabs | Horizontal scroll or dropdown |
| Filters | Collapsible drawer |
| Chart | Scaled to fit |

### 6.2 Tablet (640-1024px)

| Element | Behavior |
|---------|---------|
| Grid | 2 columns |
| Tabs | Full tabs |
| Filters | Inline filters |

### 6.3 Desktop (> 1024px)

| Element | Behavior |
|---------|---------|
| Grid | 3-4 columns |
| Tabs | Full tabs |
| Filters | Inline with chips |

---

## See Also

- [Appendix D: Wireframes](./Appendices/D-Wireframes.md)