# Contributing Guide

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Overview

This guide explains how to contribute new profiles to the Gaggimate Profile Store. Whether you have a simple profile, multiple options (variants), or an evolving profile with versions, we support all approaches.

## 2. Ways to Contribute

| Method | Description |
|--------|-------------|
| New profile | Submit a new brewing profile |
| Profile variant | Add variants to existing profiles (e.g., different doses) |
| Profile version | Add new versions of existing profiles (profile evolution) |
| Fix error | Fix errors in existing profiles |
| Documentation | Improve profile descriptions or naming |

## 3. Quick Start: Choose Your Profile Type

Before creating your profile, decide which pattern fits best:

| Pattern | Use When | Complexity |
|---------|----------|-----------|
| **A: Simple** | You have a single profile, no variations | ⭐ |
| **B: Variants** | Multiple options at same level (doses, baskets) | ⭐⭐ |
| **C: Versions** | Profile evolves over time + optional variants | ⭐⭐⭐ |

**→ Most profiles use Pattern B (Variants)**

---

## 4. Pattern A: Simple Profile Template

**Use when:** You have a single profile with no variants or versions

### Folder Structure

```
profiles/your-profile-name/
├── index.json
└── your-profile-name.json
```

### index.json Template

```json
{
  "name": "your-profile-name",
  "displayName": "Your Profile Display Name",
  "file": "your-profile-name.json",
  "downloadPath": "/profiles/your-profile-name/",
  "description": "A clear description of what this profile does. Include extraction method, ideal coffee roasts, and key parameters.",
  "author": "Your Name or Username",
  "date": "2026-04-22",
  "complexity": "low",
  "tags": ["espresso", "classic"],
  "picture": "/assets/img/your-profile-name.jpg",
  "link": "https://discord.gg/gaggimate"
}
```

### Profile JSON File (`your-profile-name.json`)

```json
{
  "id": "your-profile-name",
  "type": "standard",
  "temperature": 93,
  "phases": [
    {
      "name": "Pre-infusion",
      "phase": "preinfusion",
      "duration": 5,
      "pump": {
        "target": "pressure",
        "pressure": 2
      }
    },
    {
      "name": "Main Brew",
      "phase": "brew",
      "duration": 25,
      "pump": {
        "target": "pressure",
        "pressure": 9
      },
      "targets": [
        { "type": "volumetric", "value": 36 }
      ]
    }
  ]
}
```

---

## 5. Pattern B: Variants Profile Template (Recommended)

**Use when:** You have one profile with multiple options (different doses, basket sizes, roast levels)

### Folder Structure

```
profiles/your-profile-name/
├── index.json
├── 18g.json
└── 20g.json
```

### index.json Template

```json
{
  "name": "your-profile-name",
  "displayName": "Your Profile Display Name",
  "description": "A clear description. Include what makes each variant different.",
  "author": "Your Name or Username",
  "date": "2026-04-22",
  "complexity": "low",
  "tags": ["espresso", "classic"],
  "picture": "/assets/img/your-profile-name.jpg",
  "link": "https://discord.gg/gaggimate",
  "variants": [
    {
      "id": "18g",
      "file": "18g.json",
      "label": "18g Dose",
      "downloadPath": "/profiles/your-profile-name/",
      "basket": "Standard Basket",
      "doseRange": "18g",
      "yieldRange": "45g",
      "brewRatio": "1:2.5",
      "tempRange": "90-96°C",
      "timeRange": "25-35s",
      "grindSize": "fine",
      "notes": "Great for lighter roasts"
    },
    {
      "id": "20g",
      "file": "20g.json",
      "label": "20g Dose",
      "downloadPath": "/profiles/your-profile-name/",
      "basket": "Standard Basket",
      "doseRange": "20g",
      "yieldRange": "50g",
      "brewRatio": "1:2.5",
      "tempRange": "90-96°C",
      "timeRange": "25-35s",
      "grindSize": "fine",
      "notes": "Balanced option for most coffees"
    }
  ]
}
```

### Profile JSON Files

**18g.json**
```json
{
  "id": "your-profile-name",
  "variant": "18g",
  "type": "standard",
  "temperature": 93,
  "phases": [
    {
      "name": "Pre-infusion",
      "phase": "preinfusion",
      "duration": 5,
      "pump": { "target": "pressure", "pressure": 2 }
    },
    {
      "name": "Main Brew",
      "phase": "brew",
      "duration": 25,
      "pump": { "target": "pressure", "pressure": 9 },
      "targets": [{ "type": "volumetric", "value": 45 }]
    }
  ]
}
```

**20g.json** (adjust yields and phases as needed)
```json
{
  "id": "your-profile-name",
  "variant": "20g",
  "type": "standard",
  "temperature": 93,
  "phases": [
    {
      "name": "Pre-infusion",
      "phase": "preinfusion",
      "duration": 5,
      "pump": { "target": "pressure", "pressure": 2 }
    },
    {
      "name": "Main Brew",
      "phase": "brew",
      "duration": 25,
      "pump": { "target": "pressure", "pressure": 9 },
      "targets": [{ "type": "volumetric", "value": 50 }]
    }
  ]
}
```

---

## 6. Pattern C: Versioned Profile with Variants (Advanced)

**Use when:** Your profile evolves over time AND has multiple options per version

### Folder Structure

```
profiles/your-profile-name/
├── index.json
├── v1.0.0/
│   ├── 18g.json
│   └── 20g.json
├── v2.0.0-beta/
│   ├── 18g.json
│   └── 20g.json
└── v2.0.0/
    ├── 18g.json
    └── 20g.json
```

### index.json Template

```json
{
  "name": "your-profile-name",
  "displayName": "Your Profile Display Name",
  "description": "Long description of the profile and its evolution",
  "author": "Your Name or Username",
  "date": "2026-04-22",
  "complexity": "high",
  "tags": ["espresso", "pressure-profiling"],
  "picture": "/assets/img/your-profile-name.jpg",
  "link": "https://discord.gg/gaggimate",
  "versions": [
    {
      "id": "v1.0.0",
      "label": "Version 1.0.0",
      "releaseDate": "2026-04-15",
      "status": "stable",
      "changelog": "Initial release with standard extraction approach",
      "variants": [
        {
          "id": "18g",
          "file": "v1.0.0/18g.json",
          "label": "18g Dose",
          "downloadPath": "/profiles/your-profile-name/"
        },
        {
          "id": "20g",
          "file": "v1.0.0/20g.json",
          "label": "20g Dose",
          "downloadPath": "/profiles/your-profile-name/"
        }
      ]
    },
    {
      "id": "v2.0.0-beta",
      "label": "Version 2.0.0-beta",
      "releaseDate": "2026-04-22",
      "status": "beta",
      "changelog": "Testing new extraction curves with improved flow control",
      "variants": [
        {
          "id": "18g",
          "file": "v2.0.0-beta/18g.json",
          "label": "18g Dose",
          "downloadPath": "/profiles/your-profile-name/"
        },
        {
          "id": "20g",
          "file": "v2.0.0-beta/20g.json",
          "label": "20g Dose",
          "downloadPath": "/profiles/your-profile-name/"
        }
      ]
    },
    {
      "id": "v2.0.0",
      "label": "Version 2.0.0",
      "releaseDate": "2026-04-25",
      "status": "stable",
      "changelog": "Release of v2.0.0 with improved flow control and better consistency",
      "variants": [
        {
          "id": "18g",
          "file": "v2.0.0/18g.json",
          "label": "18g Dose",
          "downloadPath": "/profiles/your-profile-name/"
        },
        {
          "id": "20g",
          "file": "v2.0.0/20g.json",
          "label": "20g Dose",
          "downloadPath": "/profiles/your-profile-name/"
        }
      ]
    }
  ]
}
```

### Profile JSON Files

Create profile files in each version folder (e.g., `v1.0.0/18g.json`, `v2.0.0-beta/18g.json`, etc.) with appropriate phase data for each version.

---

## 7. Naming Conventions

### Profile Names (folder names)

- **Format:** kebab-case (lowercase with hyphens)
- **Examples:** `9bar-espresso`, `lever-classic`, `flat-white-blend`
- **Note:** Keep names descriptive but concise
- **Flexibility:** Use whatever name best describes your profile

### Variant IDs

- **Format:** kebab-case or descriptive
- **Examples:** `18g`, `20g`, `light-roast`, `dark-roast`, `vst-basket`
- **Flexibility:** Use clear identifiers that distinguish variants

### Profile JSON Files

- **Format:** Descriptive names (can match variant names)
- **Examples:** `18g.json`, `20g.json`, `standard.json`
- **Flexibility:** Naming is open; be consistent within your profile

### Version Folder Names

- **Format:** Semantic versioning `v[MAJOR].[MINOR].[PATCH]`
- **Examples:**
  - `v1.0.0` — First stable release
  - `v1.1.0` — Minor improvement
  - `v2.0.0-beta` — Major version in testing
  - `v2.1.1-beta` — Beta with patch updates
- **Recommendation:** Use semantic versioning for clarity
- **Flexibility:** Use descriptive names if semantic versioning doesn't fit

---

## 8. Field Reference

### Base Profile Fields (Required for All Patterns)

| Field | Type | Example |
|-------|------|---------|
| `name` | string | `"9bar-espresso"` |
| `displayName` | string | `"9 Bar Espresso"` |
| `description` | string | `"A classic 9 bar extraction profile..."` |
| `author` | string | `"John Doe"` |
| `date` | string (YYYY-MM-DD) | `"2026-04-22"` |
| `complexity` | string | `"low"`, `"mid"`, `"high"` |
| `tags` | array[string] | `["espresso", "classic"]` |

### Base Profile Fields (Optional for All Patterns)

| Field | Type | Example |
|-------|------|---------|
| `picture` | string (path) | `"/assets/img/9bar.jpg"` |
| `link` | string (URL) | `"https://discord.gg/gaggimate"` |
| `machineCompatibility` | array[string] | `["gaggia", "gaggia-classic"]` |

### Variant Fields (Pattern B & C)

| Field | Required | Example |
|-------|----------|---------|
| `id` | Yes | `"18g"` |
| `file` | Yes | `"18g.json"` or `"v1.0.0/18g.json"` |
| `label` | Yes | `"18g Dose"` |
| `downloadPath` | Yes | `"/profiles/9bar/"` |
| `basket` | No | `"VST Precision 20g"` |
| `doseRange` | No | `"18-20g"` |
| `yieldRange` | No | `"45-50g"` |
| `brewRatio` | No | `"1:2.5"` |
| `tempRange` | No | `"90-96°C"` |
| `timeRange` | No | `"25-35s"` |
| `grindSize` | No | `"fine"`, `"medium"`, `"coarse"` |
| `notes` | No | `"Works best with medium roasts"` |

### Version Fields (Pattern C)

| Field | Required | Example |
|-------|----------|---------|
| `id` | Yes | `"v1.0.0"` |
| `label` | Yes | `"Version 1.0.0"` |
| `releaseDate` | Yes | `"2026-04-15"` |
| `variants` | Yes | `[...]` |
| `status` | No | `"stable"`, `"beta"`, `"experimental"` |
| `changelog` | No | `"Initial release..."` |

---

## 9. Submission Workflow

### Step 1: Fork and Clone

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/gm-profile-database.git
cd gm-profile-database
```

### Step 2: Create a Branch

```bash
# Create a new branch for your profile
git checkout -b profiles/your-profile-name
```

### Step 3: Create Your Profile Folder

Choose one of the three patterns (A, B, or C above) and create your profile folder with the appropriate structure.

### Step 4: Validate Your Profile

```bash
# Validate your JSON files
npm run validate

# Check for linting issues
npm run lint

# Build to ensure no errors
npm run build
```

### Step 5: Commit and Push

```bash
# Add your profile
git add profiles/your-profile-name/

# Commit with a descriptive message
git commit -m "Add your-profile-name profile (Pattern B with variants)"

# Push your branch
git push origin profiles/your-profile-name
```

### Step 6: Create a Pull Request

1. Go to GitHub
2. Create a Pull Request from your branch to `main`
3. Fill in the description with:
   - What the profile does
   - Which pattern you used (A, B, or C)
   - Why you're adding it
   - Any testing you've done
4. Submit for review

---

## 10. Best Practices

### Descriptions

- Be descriptive about what the profile does
- Include extraction method (pressure profiling, flow profiling, etc.)
- Note ideal coffee types (light roasts, espresso blends, etc.)
- Explain parameter ranges and why they matter
- Include tips for best results

### Variants

- When to create variants: Different doses, basket sizes, roast levels
- Each variant should have a meaningful `label`
- Include metadata (`doseRange`, `yieldRange`, etc.) for clarity
- Add `notes` field to explain differences between variants

### Versions

- Use when your profile evolves over time
- Include a `changelog` explaining what changed
- Mark versions as `stable`, `beta`, or `experimental`
- Keep version numbering consistent (semantic versioning)

### Images

- Use descriptive images when possible
- Keep file size reasonable (< 500KB)
- Supported formats: JPEG, PNG, WebP
- Place images in `/public/assets/img/`

### Discord Links

- Include a Discord discussion thread if you have one
- Use the full Discord URL
- Keep it updated if the thread moves

---

## 11. Common Errors & Fixes

| Error | Fix |
|-------|-----|
| Missing `name` | Add required field in index.json |
| Missing `downloadPath` | Add required field in index.json |
| Invalid JSON syntax | Check JSON for missing commas, quotes, brackets |
| Variant `file` points to wrong path | Ensure relative path matches actual file location |
| Missing required base field | Review "Base Profile Fields" section |
| Phase data incorrect | Check phase duration and pump target values |

---

## 12. Pull Request Guidelines

### Title Format

`[Profile] {profile-name} - {short description}`

**Examples:**
- `[Profile] Add 9bar-espresso profile with variants`
- `[Profile] Add v2.0.0 release for lever-classic`
- `[Fix] Fix incorrect temperature in espresso-classic`

### Description Template

```markdown
## What does this profile do?
Brief description of the profile and its purpose.

## Which pattern does it use?
Pattern A (Simple) / Pattern B (Variants) / Pattern C (Versions)

## Why are you adding it?
Explain the motivation and what makes this profile valuable.

## Have you tested it?
- [ ] Validated with `npm run validate`
- [ ] Ran `npm run build` successfully
- [ ] Tested in browser

## Additional notes
Any extra information reviewers should know.
```

### Review Process

1. Automated checks run (schema validation, JSON syntax)
2. Manual review by maintainers
3. Feedback provided if changes needed
4. Merge when approved

---

## 13. Resources

| Resource | Link |
|----------|------|
| Gaggimate Project | https://github.com/marxd262/gaggimate |
| Discord Server | https://discord.gg/gaggimate |
| Data Schema Reference | [04-DataSchema.md](./04-DataSchema.md) |
| Schema Examples | [Appendices/C-SchemaExamples.md](./Appendices/C-SchemaExamples.md) |
| Directory Structure | [03-DirectoryStructure.md](./03-DirectoryStructure.md) |

---

## 14. Code of Conduct

- Be respectful to all contributors
- Provide constructive feedback
- Help newcomers with questions
- No personal attacks, trolling, or spam
