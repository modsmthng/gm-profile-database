# Data Schema

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Overview

Profiles are stored as JSON files organized in folders. Each profile has an `index.json` that serves as the catalog entry. The actual profile data is stored in separate JSON files that follow the Gaggimate profile format.

This document covers both the **catalog schema** (index.json) and the **profile schema** (actual profile data).

## 2. Choosing Your Profile Structure

Before diving into the schema details, decide which pattern fits your profile:

| Pattern | Use Case | Complexity |
|---------|----------|-----------|
| **A: Simple** | Single profile, no variants or versions | ⭐ |
| **B: Variants** | Multiple options at same extraction level (doses, roast types) | ⭐⭐ |
| **C: Versions** | Profile evolution over time with optional variants per version | ⭐⭐⭐ |

### Decision Flowchart

```
Does your profile have multiple options (dose, grind, etc.)?
├─ NO → Pattern A (Simple)
└─ YES → Does it need version history?
         ├─ NO → Pattern B (Variants only) ← RECOMMENDED
         └─ YES → Pattern C (Versions with variants)
```

---

## 3. Base Profile Fields (All Patterns)

These fields are available for all profile patterns:

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `name` | string | Yes | Unique identifier (kebab-case recommended) |
| `displayName` | string | Yes | Human-readable profile name |
| `description` | string | Yes | Profile description (supports markdown) |
| `author` | string | Yes | Creator name |
| `date` | string | Yes | Creation date (ISO 8601: YYYY-MM-DD) |
| `complexity` | string | Yes | low, mid, or high |
| `tags` | array[string] | Yes | Category tags (e.g., ["espresso", "classic"]) |
| `picture` | string | No | Path to profile image |
| `link` | string | No | Discord/discussion URL |
| `machineCompatibility` | array[string] | No | Compatible machines |

#### Complexity Values

| Value | Meaning |
|-------|---------|
| `low` | Easy to use, forgiving parameters |
| `mid` | Requires some experience |
| `high` | For experienced users |

### 3.5 Download Path Resolution

When a user downloads a profile, the system uses **priority-based resolution** to determine which file to download.

#### Resolution Priority Order

| Priority | Source | Example | When Used |
|----------|--------|---------|-----------|
| 1 (Highest) | Variant-specific `downloadPath` | `/profiles/9bar/18g.json` | Explicit variant download path set |
| 2 | Computed from variant `file` | `/profiles/9bar/` + `18g.json` | Variant has `file` but no `downloadPath` |
| 3 | Profile-level `downloadPath` | `/profiles/9bar/` | Fallback to profile directory |
| 4 (Fallback) | Profile directory | `/profiles/{name}/` | No paths specified |

#### Resolution Logic

```javascript
function resolveDownloadPath(profile, selectedVariant) {
  // Priority 1: Variant has explicit downloadPath
  if (selectedVariant?.downloadPath) {
    return selectedVariant.downloadPath;
  }
  
  // Priority 2: Build from variant file path
  if (selectedVariant?.file) {
    return `/profiles/${profile.name}/${selectedVariant.file}`;
  }
  
  // Priority 3: Profile-level downloadPath (may be folder)
  if (profile.downloadPath) {
    return profile.downloadPath;
  }
  
  // Priority 4: Default to profile directory
  return `/profiles/${profile.name}/`;
}
```

#### File vs Folder Behavior

| downloadPath Format | Behavior | Example |
|-------------------|----------|---------|
| **Ends with `.json`** | Direct download | `/profiles/9bar/18g.json` → Downloads 18g.json |
| **Ends with `/`** | Folder discovery | `/profiles/9bar/` → Shows dropdown of all JSON files |

#### Best Practices

**Recommended (Explicit):**
```json
"variants": [
  {
    "id": "18g",
    "file": "18g.json",
    "downloadPath": "/profiles/9bar-espresso/18g.json"
  }
]
```

**Also Valid (Computed):**
```json
"variants": [
  {
    "id": "18g",
    "file": "18g.json"
    // downloadPath computed as: /profiles/9bar-espresso/18g.json
  }
]
```

**Legacy Support (Folder):**
```json
{
  "name": "9bar-espresso",
  "downloadPath": "/profiles/9bar-espresso/"
  // Triggers dropdown with all JSON files in folder
}
```

---

## 4. Schema Hierarchy

The structure differs based on which pattern you choose:

### Pattern A: Simple (No Variants/Versions)
```
index.json
├── Base fields (name, displayName, etc.)
├── file → points to profile JSON
└── downloadPath → folder or file path
```

### Pattern B: Variants (Recommended)
```
index.json
├── Base fields
├── variants[] (REPLACES file field)
│   └── each variant has: id, file, label, downloadPath
└── Profile JSON files referenced by variant.file
```

### Pattern C: Versions with Variants
```
index.json
├── Base fields
├── versions[] (REPLACES file field)
│   └── version object:
│       ├── id, label, releaseDate, status
│       └── variants[]
│           └── each variant has: id, file, label, downloadPath
└── Profile JSON files in version folders (v1.0.0/, v2.0.0/, etc.)
```

---

## 5. Pattern A: Simple Profile Schema

**Use when:** You have a single profile with no variants or versions

### Fields

| Field | Type | Required | Description |
|-------|------|----------|------------|
| Base fields | (see section 3) | Yes | All base fields required |
| `file` | string | Yes | Path to profile JSON file |
| `downloadPath` | string | Yes | Download path (file or folder) |

### Example

```json
{
  "name": "9bar-espresso",
  "displayName": "9 Bar Espresso",
  "file": "9bar-espresso.json",
  "downloadPath": "/profiles/9bar-espresso/",
  "description": "A classic 9 bar extraction profile for espresso",
  "author": "Gaggimate",
  "date": "2026-04-22",
  "complexity": "low",
  "tags": ["espresso", "classic"]
}
```

---

## 6. Pattern B: Variants Schema (Recommended)

**Use when:** You have multiple options at the same extraction level

### Variant Fields

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `id` | string | Yes | Variant identifier (kebab-case) |
| `file` | string | Yes | Path to variant JSON file (relative to profile root) |
| `label` | string | Yes | Display name for this variant |
| `downloadPath` | string | Yes | Download path for this variant |
| `basket` | string | No | Basket name or size |
| `brewRatio` | string | No | Brew ratio (e.g., "1:2.5") |
| `doseRange` | string | No | Dose range (e.g., "18-20g") |
| `yieldRange` | string | No | Yield range (e.g., "45-50g") |
| `tempRange` | string | No | Temperature range (e.g., "90-96°C") |
| `timeRange` | string | No | Brew time range (e.g., "25-35s") |
| `grindSize` | string | No | Suggested grind size |
| `notes` | string | No | Additional notes or tips |

### Example

```json
{
  "name": "9bar-espresso",
  "displayName": "9 Bar Espresso",
  "description": "A classic 9 bar extraction profile for espresso",
  "author": "Gaggimate",
  "date": "2026-04-22",
  "complexity": "low",
  "tags": ["espresso", "classic"],
  "variants": [
    {
      "id": "18g",
      "file": "18g.json",
      "label": "18g dose",
      "downloadPath": "/profiles/9bar-espresso/",
      "basket": "Standard basket",
      "doseRange": "18g",
      "yieldRange": "45g",
      "tempRange": "90-96°C",
      "timeRange": "25-35s"
    },
    {
      "id": "20g",
      "file": "20g.json",
      "label": "20g dose",
      "downloadPath": "/profiles/9bar-espresso/",
      "basket": "Standard basket",
      "doseRange": "20g",
      "yieldRange": "50g",
      "tempRange": "90-96°C",
      "timeRange": "25-35s"
    }
  ]
}
```

---

## 7. Pattern C: Versions Schema (Advanced)

**Use when:** Your profile evolves over time AND has multiple options per version

### Version Fields

| Field | Type | Required | Description |
|--------|------|----------|------------|
| `id` | string | Yes | Version identifier (semantic versioning: v1.0.0, v2.0.0-beta) |
| `label` | string | Yes | Display label for version |
| `releaseDate` | string | Yes | Release date (ISO 8601: YYYY-MM-DD) |
| `variants` | array | Yes | List of variants within this version |
| `changelog` | string | No | Change notes/what's new in this version |
| `status` | string | No | stable, beta, or experimental |

### Version Status Values

| Value | Meaning |
|-------|---------|
| `stable` | Ready for general use |
| `beta` | Testing, may change |
| `experimental` | Work in progress |

### Example

```json
{
  "name": "lever-classic",
  "displayName": "Lever Classic",
  "description": "Profile for lever-operated machines",
  "author": "Gaggimate",
  "date": "2026-04-22",
  "complexity": "high",
  "tags": ["lever", "classic"],
  "versions": [
    {
      "id": "v1.0.0",
      "label": "Version 1.0.0",
      "releaseDate": "2026-04-20",
      "status": "stable",
      "changelog": "Initial release with standard baskets",
      "variants": [
        {
          "id": "standard",
          "file": "v1.0.0/standard.json",
          "label": "Standard",
          "downloadPath": "/profiles/lever-classic/"
        },
        {
          "id": "18g",
          "file": "v1.0.0/18g.json",
          "label": "18g dose",
          "downloadPath": "/profiles/lever-classic/"
        }
      ]
    },
    {
      "id": "v2.0.0-beta",
      "label": "Version 2.0.0-beta",
      "releaseDate": "2026-04-22",
      "status": "beta",
      "changelog": "Testing new extraction curves",
      "variants": [
        {
          "id": "standard",
          "file": "v2.0.0-beta/standard.json",
          "label": "Standard",
          "downloadPath": "/profiles/lever-classic/"
        },
        {
          "id": "18g",
          "file": "v2.0.0-beta/18g.json",
          "label": "18g dose",
          "downloadPath": "/profiles/lever-classic/"
        }
      ]
    }
  ]
}
```

### Version Naming Convention

Use semantic versioning: `v[MAJOR].[MINOR].[PATCH]`

| Example | Meaning |
|---------|---------|
| `v1.0.0` | First stable release |
| `v1.1.0` | Minor improvement |
| `v1.1.1` | Patch/bug fix |
| `v2.0.0-beta` | Major version in testing |
| `v2.1.1-beta` | Beta with patch updates |

---

## 8. Profile JSON (Gaggimate Format)

The actual profile data files follow the Gaggimate schema:

### 8.1 Required Fields

| Field | Type | Description |
|--------|------|------------|
| `id` | string | Profile identifier |
| `type` | string | standard/pro |
| `phases` | array | Brewing phases |

### 8.2 Optional Fields

| Field | Type | Description |
|--------|------|------------|
| `label` | string | Display name |
| `description` | string | Description |
| `temperature` | number | Default temperature |
| `favorite` | boolean | User favorite |
| `selected` | boolean | Currently selected |
| `utility` | boolean | Utility profile |

### 8.3 Phase Fields

| Field | Type | Description |
|--------|------|------------|
| `name` | string | Phase name |
| `phase` | string | preinfusion/brew |
| `valve` | number | 0 or 1 |
| `duration` | number | Duration in seconds |
| `temperature` | number | Phase temperature |
| `pump` | object | Pump settings |
| `transition` | object | Transition settings |
| `targets` | array | Stop conditions |

---

## 9. Validation Rules

### 9.1 Error Handling

| Situation | Behavior |
|-----------|---------|
| Missing `name` | Error displayed on card |
| Missing `displayName` | Error displayed on card |
| Missing required base field | Error displayed |
| Invalid JSON | File skipped, error logged |
| Missing optional field | Field hidden gracefully |

### 9.2 Validation Pipeline

1. **Build Time**: JSON parse validation
2. **CI Time**: Schema validation with Ajv
3. **Runtime**: Graceful error display

### 9.3 Complete JSON Schemas

#### 9.3.1 Index Schema (All Patterns)

Complete JSON schema for validating `index.json` files. Save this as `src/schemas/index.schema.json`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Profile Index",
  "type": "object",
  "required": ["name", "displayName", "description", "author", "date", "complexity", "tags"],
  "properties": {
    "name": {
      "type": "string",
      "pattern": "^[a-z0-9-]+$",
      "description": "Unique identifier (kebab-case)"
    },
    "displayName": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "description": {
      "type": "string",
      "minLength": 10
    },
    "author": {
      "type": "string",
      "minLength": 1
    },
    "date": {
      "type": "string",
      "format": "date",
      "pattern": "^\\d{4}-\\d{2}-\\d{2}$"
    },
    "complexity": {
      "type": "string",
      "enum": ["low", "mid", "high"]
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "minItems": 1,
      "uniqueItems": true
    },
    "picture": {
      "type": "string",
      "description": "Path to profile image (optional)"
    },
    "link": {
      "type": "string",
      "format": "uri",
      "description": "Discord/discussion URL (optional)"
    },
    "machineCompatibility": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Compatible machines (optional)"
    },
    "downloadPath": {
      "type": "string",
      "description": "Profile-level download path (optional, used as fallback)"
    }
  },
  "oneOf": [
    {
      "title": "Pattern A: Simple Profile",
      "required": ["file", "downloadPath"],
      "properties": {
        "file": { "type": "string", "pattern": "\\.json$" }
      },
      "not": {
        "anyOf": [
          { "required": ["variants"] },
          { "required": ["versions"] }
        ]
      }
    },
    {
      "title": "Pattern B: Variants",
      "required": ["variants"],
      "properties": {
        "variants": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "object",
            "required": ["id", "file", "label"],
            "properties": {
              "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
              "file": { "type": "string", "pattern": "\\.json$" },
              "label": { "type": "string" },
              "downloadPath": { "type": "string" },
              "basket": { "type": "string" },
              "brewRatio": { "type": "string" },
              "doseRange": { "type": "string" },
              "yieldRange": { "type": "string" },
              "tempRange": { "type": "string" },
              "timeRange": { "type": "string" },
              "grindSize": { "type": "string" },
              "notes": { "type": "string" }
            }
          }
        }
      },
      "not": {
        "anyOf": [
          { "required": ["file"] },
          { "required": ["versions"] }
        ]
      }
    },
    {
      "title": "Pattern C: Versions",
      "required": ["versions"],
      "properties": {
        "versions": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "object",
            "required": ["id", "label", "releaseDate", "variants"],
            "properties": {
              "id": { "type": "string", "pattern": "^v\\d+\\.\\d+\\.\\d+(-[a-z]+)?$" },
              "label": { "type": "string" },
              "releaseDate": { "type": "string", "format": "date" },
              "status": { "type": "string", "enum": ["stable", "beta", "experimental"] },
              "changelog": { "type": "string" },
              "variants": {
                "type": "array",
                "minItems": 1,
                "items": {
                  "type": "object",
                  "required": ["id", "file", "label"],
                  "properties": {
                    "id": { "type": "string" },
                    "file": { "type": "string", "pattern": "\\.json$" },
                    "label": { "type": "string" },
                    "downloadPath": { "type": "string" },
                    "basket": { "type": "string" },
                    "brewRatio": { "type": "string" },
                    "doseRange": { "type": "string" },
                    "yieldRange": { "type": "string" },
                    "tempRange": { "type": "string" },
                    "timeRange": { "type": "string" },
                    "grindSize": { "type": "string" },
                    "notes": { "type": "string" }
                  }
                }
              }
            }
          }
        }
      },
      "not": {
        "anyOf": [
          { "required": ["file"] },
          { "required": ["variants"] }
        ]
      }
    }
  ]
}
```

#### 9.3.2 Profile JSON Schema (Gaggimate Format)

Complete JSON schema for validating profile data files. Save this as `src/schemas/profile.schema.json`:

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Gaggimate Profile",
  "type": "object",
  "required": ["id", "type", "phases"],
  "properties": {
    "id": {
      "type": "string",
      "description": "Profile identifier"
    },
    "label": {
      "type": "string",
      "description": "Display name (optional)"
    },
    "type": {
      "type": "string",
      "enum": ["standard", "pro"],
      "description": "Profile type"
    },
    "description": {
      "type": "string",
      "description": "Profile description (optional)"
    },
    "temperature": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "description": "Default temperature in Celsius (optional)"
    },
    "favorite": {
      "type": "boolean",
      "description": "User favorite flag (optional)"
    },
    "selected": {
      "type": "boolean",
      "description": "Currently selected flag (optional)"
    },
    "utility": {
      "type": "boolean",
      "description": "Utility profile flag (optional)"
    },
    "phases": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["name", "phase", "valve", "duration", "pump"],
        "properties": {
          "name": {
            "type": "string",
            "description": "Phase name"
          },
          "phase": {
            "type": "string",
            "enum": ["preinfusion", "brew"],
            "description": "Phase type"
          },
          "valve": {
            "type": "number",
            "enum": [0, 1],
            "description": "Valve state (0=closed, 1=open)"
          },
          "duration": {
            "type": "number",
            "minimum": 0,
            "description": "Duration in seconds"
          },
          "temperature": {
            "type": "number",
            "minimum": 0,
            "maximum": 100,
            "description": "Phase temperature in Celsius (optional)"
          },
          "pump": {
            "type": "object",
            "required": ["target"],
            "properties": {
              "target": {
                "type": "string",
                "enum": ["pressure", "flow"],
                "description": "Control target (pressure or flow)"
              },
              "pressure": {
                "type": "number",
                "minimum": 0,
                "maximum": 12,
                "description": "Target pressure in bar"
              },
              "flow": {
                "type": "number",
                "minimum": 0,
                "maximum": 10,
                "description": "Target flow in ml/s"
              }
            }
          },
          "transition": {
            "type": "object",
            "description": "Transition settings (optional)",
            "properties": {
              "duration": {
                "type": "number",
                "minimum": 0,
                "description": "Transition duration in seconds"
              },
              "easing": {
                "type": "string",
                "enum": ["linear", "ease-in", "ease-out", "ease-in-out"],
                "description": "Easing function"
              }
            }
          },
          "targets": {
            "type": "array",
            "description": "Stop conditions (optional)",
            "items": {
              "type": "object",
              "required": ["type", "operator", "value"],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": ["volumetric", "gravimetric", "time"],
                  "description": "Target type"
                },
                "operator": {
                  "type": "string",
                  "enum": ["gte", "lte", "eq"],
                  "description": "Comparison operator"
                },
                "value": {
                  "type": "number",
                  "description": "Target value"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

---

## 10. Download Logic

**Note:** Download path resolution is now documented in Section 3.5 above. This section provides implementation guidance.

### 10.1 Path Resolution Priority

The system uses a **4-tier priority system** (see Section 3.5 for details):
1. Variant-specific `downloadPath`
2. Computed from variant `file`
3. Profile-level `downloadPath`
4. Profile directory fallback

### 10.2 Implementation Reference

See [Appendix E: Implementation Examples](./Appendices/E-ImplementationExamples.md#1-download-path-resolution) for complete code examples.

---

## See Also

- [Appendix C: Schema Examples](./Appendices/C-SchemaExamples.md)
- [Appendix E: Implementation Examples](./Appendices/E-ImplementationExamples.md)
- [Contributing Guide](./10-Contributing.md)
- [Directory Structure](./03-DirectoryStructure.md)
