# Profile Creator Web App - Implementation Plan

## Overview

**Profile Creator** is a self-contained single HTML file for creating and editing `index.json` files for the Gaggimate Profile Store. It provides a form-based UI with real-time validation, drag-and-drop file loading, file save via the File System Access API, and automatic pattern detection.

The build output is one file: `profile-creator.html`. Double-click to open in a browser. No install, no server, no Node.js required to run.

**Status**: Plan updated — rewrite from TUI (Ink) to single-file HTML app (Vite + `vite-plugin-singlefile` + Preact).

---

## Project Structure

```
tools/profile-creator/
├── package.json              # Dependencies: preact, ajv, ajv-formats, vite, vite-plugin-singlefile
├── tsconfig.json             # TypeScript configuration (ES2022, strict mode)
├── vite.config.ts            # Vite config: Preact plugin + singlefile plugin
├── index.html                # Entry HTML (mounts <App />)
├── PLAN.md                   # This file
├── schema/
│   └── index.schema.json     # Copy of src/schemas/index.schema.json (inlined at build)
├── src/
│   ├── main.tsx              # Entry point: renders <App /> into #root
│   ├── app.tsx               # Root component: state, layout, drag-drop, keyboard shortcuts
│   ├── types.ts              # All TypeScript interfaces (AppState, Variant, Version, etc.)
│   ├── schema.ts             # Ajv compiler + validator (schema imported as JSON)
│   ├── validate.ts           # buildJsonForValidation(), mapToFieldErrors()
│   ├── output.ts             # buildJson(), saveFile(), downloadFallback()
│   ├── load.ts               # loadFromText(), detectPattern(), createEmptyState()
│   │
│   ├── components/
│   │   ├── DropZone.tsx      # Full-page drag-and-drop overlay
│   │   ├── Header.tsx        # Title + pattern selector [A] [B] [C] + file name
│   │   ├── ProfileFields.tsx # Form section: base profile fields
│   │   ├── VariantsPanel.tsx # Section: variant navigator + VariantEditor
│   │   ├── VariantEditor.tsx # Variant form fields
│   │   ├── VersionsPanel.tsx # Section: version navigator + nested variants (Pattern C)
│   │   ├── FieldRow.tsx      # Reusable labeled input row with inline error
│   │   ├── StatusBar.tsx     # Bottom bar: validation status + Open/Save/Save As buttons
│   │   └── Toast.tsx         # Temporary save/error notification (auto-dismiss 2s)
│   │
│   └── hooks/
│       ├── useValidation.ts  # Debounced (200ms) validation, returns field errors
│       ├── useFileSystem.ts  # File System Access API: open, save, saveAs + fallback
│       └── useDragDrop.ts    # Global drag-and-drop handler for JSON files
│
└── dist/
    └── profile-creator.html  # Build output — single self-contained file
```

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Bundler | Vite | Fast dev server; clean build pipeline |
| Single-file bundling | `vite-plugin-singlefile` | Inlines all JS + CSS into one `.html` at build time |
| UI | Preact | Consistent with parent project; small bundle (~4KB) |
| Validation | Ajv v8 | Works in-browser; same as original TUI version |
| Styling | Tailwind CSS (via CDN in dev / inlined at build) | Consistent with parent project |
| Language | TypeScript | Strict mode |

---

## Single-File Build

`vite-plugin-singlefile` intercepts the Vite build and inlines all JS chunks and CSS into the HTML file as `<script>` and `<style>` tags. No external asset references remain.

**`vite.config.ts`:**
```typescript
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [preact(), viteSingleFile()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: Infinity, // inline everything, no external assets
  },
});
```

**Build output:**
```bash
npm run build
# → dist/profile-creator.html  (~300-500KB, self-contained)
```

The schema JSON (`index.schema.json`) is imported directly as a module — Vite inlines it into the bundle automatically.

**Development** still uses the normal Vite dev server:
```bash
npm run dev   # http://localhost:5173 — hot reload, source maps
```

---

## Architecture & Data Flow

### State Management

All state lives in **AppState** (`src/types.ts`):

```typescript
interface AppState {
  pattern: 'A' | 'B' | 'C';
  base: BaseFields;
  patternA: { file: string; downloadPath: string };
  variants: Variant[];               // Pattern B flat list
  versions: Version[];               // Pattern C — each Version contains its own variants[]
  activeVersionIndex: number;
  activeVariantIndex: number;
  loadedFileName?: string;           // Display only (e.g. "index.json")
  fileHandle?: FileSystemFileHandle; // Retained for in-place saves (Chrome/Edge)
  isModified: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  isDragOver: boolean;               // True while a file is being dragged over the window
}
```

Pattern switching keeps both `variants` and `versions` arrays in state at all times. `buildJson()` writes only the array that belongs to the active pattern. Switching patterns doesn't discard the other array — it's just ignored on save.

### Page Layout

```
┌──────────────────────────────────────────────┐
│  GAGGIMATE PROFILE CREATOR   [A]  [B]  [C]   │  Header
│  my-profile/index.json  ●                    │  (● = unsaved changes)
├──────────────────────────────────────────────┤
│  Profile Fields                              │
│    Name *         [___________________]      │
│    Display Name   [___________________]      │
│    Description    [___________________]      │
│    Author         [___________________]      │
│    Date           [___________________]      │
│    Complexity     [ low ▾ ]                  │
│    Tags           [___________________]      │
│    ...                                       │
├──────────────────────────────────────────────┤
│  Variants  ◄  1 / 1  ►   [+ Add]  [✕ Delete]│
│    ID *            [___________________]     │
│    File *          [___________________]     │
│    Label           [___________________]     │
│    ...                                       │
├──────────────────────────────────────────────┤
│  ✓ Valid   [Open]  [Save]  [Save As]         │  Status bar
└──────────────────────────────────────────────┘
```

When dragging a file over the window, `<DropZone />` renders a full-page overlay:

```
┌──────────────────────────────────────────────┐
│                                              │
│                                              │
│          ⬇  Drop index.json here            │
│                                              │
│                                              │
└──────────────────────────────────────────────┘
```

---

## Drag and Drop (`useDragDrop.ts`)

Drag-and-drop is the primary way to open a file. It requires no browser dialog.

```typescript
// useDragDrop.ts
export function useDragDrop(onLoad: (text: string, fileName: string) => void) {
  useEffect(() => {
    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.dataTransfer!.dropEffect = 'copy';
    };

    const onDrop = async (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files[0];
      if (!file) return;
      const text = await file.text();
      onLoad(text, file.name);
    };

    window.addEventListener('dragover', onDragOver);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragover', onDragOver);
      window.removeEventListener('drop', onDrop);
    };
  }, [onLoad]);
}
```

The dropped `File` object comes from the browser's drag event — no File System Access API handle is available from drag-and-drop. So after a drag-load, the first **[Save]** triggers `showSaveFilePicker()` to get a handle, then subsequent saves write in-place.

---

## File I/O (`useFileSystem.ts`)

### Open via picker (fallback when no drag-drop)

```typescript
async function openFile(): Promise<{ text: string; fileName: string; handle: FileSystemFileHandle }> {
  const [handle] = await window.showOpenFilePicker({
    types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
  });
  const file = await handle.getFile();
  return { handle, text: await file.text(), fileName: file.name };
}
```

### Save (in-place)

```typescript
async function saveFile(handle: FileSystemFileHandle, json: string): Promise<void> {
  const writable = await handle.createWritable();
  await writable.write(json);
  await writable.close();
}
```

### Save As

```typescript
async function saveAs(json: string): Promise<FileSystemFileHandle> {
  const handle = await window.showSaveFilePicker({
    suggestedName: 'index.json',
    types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }],
  });
  await saveFile(handle, json);
  return handle;
}
```

### Fallback (Firefox / Safari — no File System Access API)

```typescript
function isFileSystemAccessSupported(): boolean {
  return typeof window.showOpenFilePicker === 'function';
}

function downloadFallback(json: string): void {
  const blob = new Blob([json], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'index.json';
  a.click();
  URL.revokeObjectURL(a.href);
}
```

In fallback mode: **[Open]** uses `<input type="file">`, **[Save]** triggers a download. A banner is shown informing the user that in-place save is unavailable.

---

## Components

### DropZone.tsx
- Listens globally via `useDragDrop` hook
- Renders a full-page semi-transparent overlay with drop prompt when `isDragOver` is true
- Otherwise invisible (zero DOM cost)

### Header.tsx
- App title
- Pattern selector: `[A]` `[B]` `[C]` buttons (active = highlighted)
- Loaded file name + unsaved `●` indicator

### ProfileFields.tsx
- Labeled inputs for all base fields
- Pattern A adds `file` + `downloadPath` fields at top
- `complexity` renders as `<select>` (enum: low / mid / high)
- `tags` and `machineCompatibility` render as comma-separated text inputs (split/join on change)
- Inline validation errors below each field

### VariantEditor.tsx
- Single-variant form: `id`, `file`, `label`, `downloadPath`, `basket`, `brewRatio`, `doseRange`, `yieldRange`, `tempRange`, `timeRange`, `grindSize`, `notes`

### VariantsPanel.tsx
- Navigator header: `◄ 1 / N ►` (prev/next buttons)
- `[+ Add Variant]` clones the current variant as starting point, increments id suffix
- `[✕ Delete]` removes active variant; disabled when only 1 remains (`minItems: 1`)
- Renders `<VariantEditor />` for the active variant index

### VersionsPanel.tsx (Pattern C only)
- Outer navigator: `◄ Version 1 / N ►`
- Version-level fields: `id` (must match `^v\d+(\.\d+)*(-[a-z]+)?$`), `label`, `releaseDate`, `status` (select), `changelog`
- `[+ Add Version]` / `[✕ Delete Version]`
- Nested `<VariantsPanel />` scoped to `versions[activeVersionIndex].variants`

### FieldRow.tsx
- Props: `label`, `value`, `onChange`, `required`, `error`, `type` (`text` | `date` | `url` | `select`)
- `<label>` + `<input>` (or `<select>`) + error `<p>` in red

### StatusBar.tsx
- Left: `✓ Valid` (green) or `✗ N errors` (red)
- Right: `[Open]` `[Save]` `[Save As]` buttons
- Centre: fallback-mode browser warning if File System Access API unavailable

### Toast.tsx
- Fixed-position notification (bottom-right)
- Auto-dismisses after 2s
- States: `saving` (spinner), `saved` (green ✓), `error` (red ✗ + message)

---

## Validation

Ajv runs entirely in-browser against the inlined schema:

1. User edits a field → 200ms debounce fires
2. `buildJsonForValidation(state)` assembles current state into a JSON object
3. Ajv validates against `index.schema.json` (the `oneOf` enforces the active pattern)
4. `mapToFieldErrors()` converts Ajv error paths to a `Record<string, string>` keyed by field name
5. Each `<FieldRow />` reads `errors[fieldName]` and renders inline if present

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl+S` | Save (in-place if handle exists, else Save As) |
| `Ctrl+Shift+S` | Save As (always opens picker) |
| `Ctrl+O` | Open file picker |
| `Ctrl+N` | Add new variant (Pattern B) or new version (Pattern C) |
| `Ctrl+D` | Delete current variant/version |
| Tab / Shift+Tab | Standard browser focus order |

---

## Build & Distribution

### Development
```bash
cd tools/profile-creator
npm install
npm run dev         # Vite dev server at http://localhost:5173
npm run typecheck   # tsc --noEmit
```

### Production Build
```bash
npm run build
# → dist/profile-creator.html  (~300-500KB, no external dependencies)
```

### Using the built file
1. Copy `dist/profile-creator.html` anywhere (Desktop, profile folder, USB drive)
2. Double-click → opens in default browser
3. Drag an `index.json` onto the page, or click `[Open]`
4. Edit, then `[Save]` (Chrome/Edge: writes in-place; Firefox: downloads)

No install. No Node.js. No server.

---

## Browser Compatibility

| Browser | Open | Drag & Drop | Save (in-place) | Save As |
|---|---|---|---|---|
| Chrome 86+ | ✓ | ✓ | ✓ | ✓ |
| Edge 86+ | ✓ | ✓ | ✓ | ✓ |
| Firefox | ✓ (file input) | ✓ | ✗ (download) | ✗ (download) |
| Safari 15.2+ | ✓ | ✓ | ✓ | ✓ |

Drag-and-drop works in all browsers — it uses the standard HTML5 `DragEvent` API, not File System Access.

---

## TODO — Implementation Order

1. **Scaffold**: `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
2. **Port types**: `types.ts` — add `isDragOver`, replace `savePath` with `fileHandle`
3. **Port validation**: `schema.ts`, `validate.ts` — unchanged logic, swap `fs.readFile` for `import schemaJson from './schema/index.schema.json'`
4. **Port load/output**: `load.ts`, `output.ts` — replace Node `fs` with `FileReader` / File System Access API
5. **Add hooks**: `useValidation.ts`, `useFileSystem.ts`, `useDragDrop.ts`
6. **Build core components**: `FieldRow`, `Header`, `ProfileFields`, `VariantEditor`, `VariantsPanel`
7. **Wire state**: `app.tsx` — connect all hooks and components
8. **Add secondary components**: `DropZone`, `StatusBar`, `Toast`
9. **Pattern C**: `VersionsPanel` with nested `VariantsPanel`
10. **Styling**: Tailwind layout pass, color tokens, dark/light
11. **Keyboard shortcuts**: `keydown` listener in `app.tsx`
12. **Build verification**: `npm run build`, open `dist/profile-creator.html`, smoke test all three patterns

---

## Known Limitations

1. No in-place save on Firefox (File System Access API unsupported) — falls back to download
2. After drag-and-drop load, the first save opens a Save As dialog (no handle from drag events)
3. No image preview for the `picture` field
4. No offline schema update — schema is frozen at build time (copy from `src/schemas/`)

---

## Future Enhancements

- [ ] Image preview for `picture` field URL
- [ ] Profile templates (quick-start presets)
- [ ] Undo/Redo via `useReducer` action history
- [ ] Export as ZIP (index.json + all referenced `.json` curve files)
- [ ] Dark mode toggle (DaisyUI theme)
- [ ] Auto-copy output JSON to clipboard on save

---

## References

- **Parent project**: `c:\Users\lorda\OneDrive\Desktop\Fences\Git\gm-profile-database`
- **Schema**: `src/schemas/index.schema.json`
- **Contributing guide**: `CONTRIBUTING.md`
- **Documentation**: `documentation/`
- **Profiles directory**: `public/profiles/`
- **`vite-plugin-singlefile`**: https://github.com/richardtallent/vite-plugin-singlefile

---

## Last Updated

**Date**: 2026-04-24  
**Status**: Plan updated — single HTML file distribution via `vite-plugin-singlefile`  
**Next**: Scaffold project, port types/validation, build components
