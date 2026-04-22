# Schema Examples

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Pattern A: Simple Profile (No Variants/Versions)

**Use when:** You have a single profile with no variations.

### 1.1 index.json

```json
{
  "name": "simple-9bar",
  "displayName": "Simple 9 Bar",
  "downloadPath": "/profiles/simple-9bar/",
  "file": "simple-9bar.json",
  "description": "A classic 9 bar extraction profile for espresso. Perfect for beginners.",
  "author": "CoffeeGeek",
  "date": "2026-01-15",
  "link": "https://discord.com/channels/123456/789012",
  "tags": ["espresso", "classic"],
  "difficulty": "beginner"
}
```

### 1.2 Profile JSON

```json
{
  "id": "simple-9bar",
  "label": "Simple 9 Bar",
  "type": "standard",
  "description": "A straightforward 9 bar extraction",
  "temperature": 93,
  "phases": [
    {
      "name": "Brew",
      "phase": "brew",
      "valve": 1,
      "duration": 28,
      "pump": {
        "target": "pressure",
        "pressure": 9,
        "flow": 0
      },
      "targets": [
        { "type": "volumetric", "operator": "gte", "value": 36 }
      ]
    }
  ]
}
```

---

## 2. Pattern B: Profile with Variants (Recommended)

**Use when:** You have multiple options at the same extraction level (different doses, basket sizes, etc.)

### 2.1 index.json

```json
{
  "name": "9bar-espresso",
  "displayName": "9 Bar Espresso",
  "downloadPath": "/profiles/9bar-espresso/",
  "description": "A versatile 9 bar profile with multiple basket options.",
  "author": "EspressoEnthusiast",
  "date": "2026-02-01",
  "link": "https://discord.com/channels/123456/789013",
  "tags": ["espresso", "versatile"],
  "difficulty": "intermediate",
  "variants": [
    {
      "id": "vst-18g",
      "file": "vst-18g.json",
      "label": "VST 18g",
      "downloadPath": "/profiles/9bar-espresso/",
      "basket": "VST Precision 18g",
      "brewRatio": "1:2.5",
      "doseRange": "18g",
      "yieldRange": "45g",
      "tempRange": "90-94°C",
      "timeRange": "25-30s",
      "grindSize": "fine"
    },
    {
      "id": "vst-20g",
      "file": "vst-20g.json",
      "label": "VST 20g",
      "downloadPath": "/profiles/9bar-espresso/",
      "basket": "VST Precision 20g",
      "brewRatio": "1:2.5",
      "doseRange": "20g",
      "yieldRange": "50g",
      "tempRange": "90-94°C",
      "timeRange": "28-35s",
      "grindSize": "fine"
    },
    {
      "id": "ims-preciso",
      "file": "ims-preciso.json",
      "label": "IMS Preciso",
      "downloadPath": "/profiles/9bar-espresso/",
      "basket": "IMS B70 27g",
      "brewRatio": "1:2.4",
      "doseRange": "18-19g",
      "yieldRange": "44-46g",
      "tempRange": "91-95°C",
      "timeRange": "26-32s",
      "grindSize": "fine"
    }
  ]
}
```

### 2.2 Variant (vst-20g.json)

```json
{
  "id": "vst-20g",
  "label": "VST 20g Basket",
  "type": "standard",
  "temperature": 92,
  "phases": [
    {
      "name": "Preinfusion",
      "phase": "preinfusion",
      "valve": 1,
      "duration": 3,
      "pump": {
        "target": "pressure",
        "pressure": 1.5,
        "flow": 0
      }
    },
    {
      "name": "Ramp",
      "phase": "brew",
      "duration": 2,
      "pump": {
        "target": "pressure",
        "pressure": 9,
        "flow": 0
      },
      "transition": {
        "type": "ease-in-out",
        "duration": 2
      }
    },
    {
      "name": "Main Brew",
      "phase": "brew",
      "duration": 25,
      "pump": {
        "target": "pressure",
        "pressure": 9,
        "flow": 0
      },
      "targets": [
        { "type": "volumetric", "operator": "gte", "value": 50 }
      ]
    }
  ]
}
```

---

## 3. Pattern C: Profile with Versions (Advanced)

**Use when:** Your profile evolves over time AND has multiple options per version.

### 3.1 index.json

```json
{
  "name": "pressure-profiling",
  "displayName": "Pressure Profiling",
  "downloadPath": "/profiles/pressure-profiling/",
  "description": "Advanced pressure profiling for experienced users. Features multiple phases and dynamic pressure control.",
  "author": "PressureMaster",
  "date": "2026-03-01",
  "link": "https://discord.com/channels/123456/789014",
  "tags": ["pressure", "advanced", "profiling"],
  "machineCompatibility": ["gaggia-classic", "gaggia-pro"],
  "difficulty": "advanced",
  "versions": [
    {
      "id": "v01",
      "label": "v1.0",
      "changelog": "Initial release",
      "date": "2026-01-01",
      "status": "stable",
      "variants": [
        {
          "id": "standard",
          "file": "v01/standard.json",
          "label": "Standard",
          "downloadPath": "/profiles/pressure-profiling/",
          "brewRatio": "1:2",
          "doseRange": "18g",
          "yieldRange": "36g"
        }
      ]
    },
    {
      "id": "v1.1",
      "label": "v1.1",
      "changelog": "Improved preinfusion timing",
      "date": "2026-02-15",
      "status": "stable",
       "variants": [
         {
           "id": "standard",
           "file": "v1.1/standard.json",
           "label": "Standard",
           "downloadPath": "/profiles/pressure-profiling/",
           "brewRatio": "1:2",
           "doseRange": "18g",
           "yieldRange": "36g"
         }
       ]
     },
     {
       "id": "v1.2",
       "label": "v1.2 (Beta)",
       "changelog": "Beta release with flow profiling option",
       "date": "2026-03-01",
       "status": "beta",
       "variants": [
         {
           "id": "pressure",
           "file": "v1.2/pressure.json",
           "label": "Pressure Control",
           "downloadPath": "/profiles/pressure-profiling/"
         },
         {
           "id": "flow",
           "file": "v1.2/flow.json",
           "label": "Flow Control",
           "downloadPath": "/profiles/pressure-profiling/"
         }
       ]
     }
   ]
}
```

### 3.2 Version File (v1.1/standard.json)

```json
{
  "id": "standard",
  "label": "Standard - v1.1",
  "type": "pro",
  "description": "Improved v1.1 with better preinfusion",
  "temperature": 91,
  "phases": [
    {
      "name": "Preinfusion Start",
      "phase": "preinfusion",
      "valve": 1,
      "duration": 2,
      "pump": {
        "target": "pressure",
        "pressure": 1,
        "flow": 0
      }
    },
    {
      "name": "Preinfusion",
      "phase": "preinfusion",
      "duration": 5,
      "pump": {
        "target": "pressure",
        "pressure": 2,
        "flow": 0
      },
      "targets": [
        { "type": "pressure", "operator": "gte", "value": 3 }
      ]
    },
    {
      "name": "Ramp Up",
      "phase": "brew",
      "duration": 3,
      "pump": {
        "target": "pressure",
        "pressure": 9,
        "flow": 0
      },
      "transition": {
        "type": "ease-in-out",
        "duration": 3,
        "adaptive": true
      }
    },
    {
      "name": "Main Brew",
      "phase": "brew",
      "duration": 20,
      "pump": {
        "target": "pressure",
        "pressure": 9,
        "flow": 0
      },
      "targets": [
        { "type": "volumetric", "value": 36 }
      ]
    }
  ]
}
```

---

## 4. Additional Example: Lever Machine Profile with Variants

**Pattern:** Pattern B (Variants)

### 4.1 index.json

```json
{
  "name": "lever-classic",
  "displayName": "Lever Classic",
  "downloadPath": "/profiles/lever-classic/",
  "description": "Profile for lever-operated machines like the Cremina. Uses pro-style phases for authentic extraction.",
  "author": "LeverLover",
  "date": "2026-02-20",
  "link": "https://discord.com/channels/123456/789015",
  "tags": ["lever", "pro", "classic"],
  "machineCompatibility": ["cremina", "gaggia-lever"],
  "difficulty": "advanced",
  "variants": [
    {
      "id": "cremina",
      "file": "cremina.json",
      "label": "Cremina",
      "downloadPath": "/profiles/lever-classic/",
      "brewRatio": "1:2",
      "doseRange": "18g",
      "yieldRange": "36g",
      "tempRange": "85-88°C",
      "timeRange": "35-45s",
      "notes": "Use dark roasts for best results"
    }
  ]
}
```

### 4.2 Profile (cremina.json)

```json
{
  "id": "cremina",
  "label": "Cremina Lever Profile",
  "type": "pro",
  "description": "Darker roasts - Very fine grind - 35-45s - 1:1.5-2.2",
  "temperature": 86.5,
  "phases": [
    {
      "name": "Preinfusion Start",
      "phase": "preinfusion",
      "valve": 1,
      "duration": 2,
      "temperature": 86.5,
      "pump": {
        "target": "pressure",
        "pressure": 1.1,
        "flow": 0
      }
    },
    {
      "name": "Preinfusion",
      "phase": "preinfusion",
      "duration": 3,
      "pump": {
        "target": "pressure",
        "pressure": 1.1,
        "flow": 0
      },
      "targets": [
        { "type": "pressure", "operator": "gte", "value": 3 }
      ]
    },
    {
      "name": "Ramp",
      "phase": "brew",
      "duration": 10,
      "pump": {
        "target": "pressure",
        "pressure": 9,
        "flow": 0
      },
      "transition": {
        "type": "ease-in-out",
        "duration": 10,
        "adaptive": true
      }
    },
    {
      "name": "Ramp Down",
      "phase": "brew",
      "duration": 50,
      "pump": {
        "target": "pressure",
        "pressure": 3,
        "flow": 0
      },
      "targets": [
        { "type": "volumetric", "value": 36 }
      ]
    }
  ]
}
```

---

## 5. Minimal Profile

### 5.1 index.json (Minimum Required)

```json
{
  "name": "minimal",
  "downloadPath": "/profiles/minimal/"
}
```

### 5.2 Profile (minimum)

```json
{
  "id": "minimal",
  "type": "standard",
  "phases": [
    {
      "name": "Brew",
      "phase": "brew",
      "valve": 1,
      "duration": 28,
      "pump": {
        "target": "pressure",
        "pressure": 9,
        "flow": 0
      }
    }
  ]
}
```

---

## 6. Error Examples

### 6.1 Missing Required Field

```json
{
  "displayName": "Broken Profile",
  // Missing: "name"
  // Missing: "downloadPath"
  "description": "This profile is missing required fields"
}
```

**Errors:**
- Missing required field: `name`
- Missing required field: `downloadPath`

### 6.2 Invalid Field Type

```json
{
  "name": "invalid-profile",
  "downloadPath": "/profiles/invalid-profile/",
  "difficulty": "super-hard"
  // "difficulty" should be: beginner, intermediate, or advanced
}
```

**Errors:**
- Invalid value for `difficulty`: "super-hard" is not a valid option