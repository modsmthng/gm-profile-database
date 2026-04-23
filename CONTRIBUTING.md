# Contributing to Gaggimate Profile Store

## Quick Start

1. Fork this repository
2. Create your profile folder in `public/profiles/{your-profile}/`
3. Add `index.json` with your profile metadata
4. Add your profile JSON file(s)
5. Submit a Pull Request

## Profile Structure

```
public/profiles/
└── {profile-name}/
    ├── index.json          # Required - profile catalog
    ├── {profile}.json    # Your profile data
    └── images/          # Optional images
```

## Required Fields

```json
{
  "name": "your-profile-id",
  "downloadPath": "/profiles/your-profile-id/"
}
```

## Recommended Fields

```json
{
  "displayName": "Your Profile Name",
  "description": "What your profile does...",
  "author": "YourName",
  "link": "https://discord.com/...",
  "complexity": "low",
  "picture": "profile.jpg"
}
```

### Picture Field

The `picture` field accepts **relative paths** pointing to image files in your profile directory:

```json
{
  "picture": "profile.jpg"        // References {profile-name}/profile.jpg
}
```

This resolves to the full URL: `/gm-profile-database/profiles/{profile-name}/profile.jpg`

You can also use absolute paths if needed:
```json
{
  "picture": "/gm-profile-database/profiles/my-profile/image.jpg"
}
```

## Profile JSON Format

See the [Documentation](./documentation/) for full schema.

## Validation

Run locally before submitting:

```bash
npm install
npm run lint
npm run validate
```

## Questions?

Join the [Discord](https://discord.gg/gaggimate)