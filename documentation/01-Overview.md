# Project Overview

> Version: 1.0.0 | Status: Draft | Last Updated: 2026-04-22

---

## 1. Purpose

The **Gaggimate Profile Store** is a public web-based catalog for sharing espresso brewing profiles developed for the Gaggimate project. It provides a searchable, browsable repository where users can discover, compare, and download pressure and flow profiling configurations for their Gaggia espresso machines.

## 2. Goals

### Primary Goals

| Goal | Description |
|------|------------|
| **Accessibility** | Make profiles easily discoverable and downloadable for all Gaggimate users |
| **Expansion** | Enable community contributions through a simple PR-based workflow |
| **Visualization** | Present profile data with interactive charts showing pressure/flow curves |
| **Organization** | Support flexible versioning (v1, v1.1, v1.2) and variant systems (baskets, doses) |

### Secondary Goals

| Goal | Description |
|------|------------|
| **Documentation** | Provide clear profile descriptions including ideal parameters |
| **Quality** | Validate profile submissions through schema checking |
| **Flexibility** | Allow contributors to structure their profiles as they see fit |

## 3. Target Audience

### Primary Users

| Audience | Use Case |
|----------|----------|
| **Gaggimate Owners** | Discover and download profiles for their machines |
| **Home Baristas** | Explore different brewing approaches (pressure profiling, flow profiling) |
| **Contributors** | Submit and share their own profile creations |

### User Needs

| Audience | Need |
|----------|------|
| **Gaggimate Owners** | Easy browsing, clear parameter display, one-click download |
| **Contributors** | Simple submission process, PR-based workflow, clear documentation |

## 4. Project Context

### Relationship to Gaggimate

The profile store is a **public companion site** to the [Gaggimate project](https://github.com/marxd262/gaggimate). While the Gaggimate device UI serves users who already have profiles, the profile store serves:

1. **Discovery** - Find new profiles created by the community
2. **Sharing** - Distribute profiles beyond the device
3. **Collaboration** - Enable community feedback via Discord links

### Not Part of Gaggimate

| Item | Reason |
|------|-------|
| Separate repository | Different build/deploy pipeline |
| Static site | No ESP32/device dependency |
| Public access | Not tied to device ownership |

## 5. Profile Structure Flexibility

This database supports three ways to organize your profiles based on complexity:

- **Pattern A (Simple):** Single profile, no variants or versions (easiest to start)
- **Pattern B (Variants):** One profile with multiple options (e.g., 18g vs 20g dose) — **recommended for most**
- **Pattern C (Versions):** Multiple versions over time, each with optional variants (for long-term profile development)

Choose what fits your workflow. Full details and examples available in the Data Schema and Contributing Guide sections.

## 6. Key Design Principles

| Principle | Implementation |
|-----------|--------------|
| **Contributor-First** | Profile submission via PR, clear documentation |
| **Flexibility** | No mandatory structure - contributors decide versioning/variants |
| **Error Tolerance** | Graceful handling - errors displayed but don't break builds |
| **Visual Clarity** | Charts, badges, and icons for quick scanning |
| **Theme Adaptation** | Multiple themes matching Gaggimate UI |

## 7. Scope Boundaries

### In Scope

- Static profile catalog with browsable cards
- Interactive pressure/flow charts
- Version and variant navigation
- Search and filtering
- Download functionality
- Multiple themes (light, dark, coffee, nord)
- CI/CD with validation

### Out of Scope

- User accounts/authentication
- Profile rating/voting
- Direct profile loading to devices
- Real-time profile editing
- Private/shared profiles
- Mobile companion app