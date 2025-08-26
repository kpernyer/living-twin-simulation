# Voice Configuration

This directory contains configuration files for the Living Twin demo.

## Changing Voice Versions

To change which voice version is used, simply edit `voice.config.ts`:

### Example: Switch English from V3Alpha to V2.5

```typescript
// In voice.config.ts, change this line:
defaultVersion: 'eleven-labs-v3alpha',

// To this:
defaultVersion: 'eleven-labs-v25',
```

### Example: Add a new voice version

```typescript
// Add to the availableVersions object:
'eleven-labs-v4': {
  path: 'eleven-labs-v4',
  displayName: 'V4 Premium',
  description: 'Next generation voices with ultra-realistic quality'
}
```

### Example: Change default language

```typescript
// Change this line:
defaultLanguage: 'en',

// To this:  
defaultLanguage: 'sv',
```

## No Code Changes Required

After editing the config file, the entire application automatically uses the new settings. No need to modify:
- ✅ Voice service implementation
- ✅ Mobile demo component  
- ✅ API calls or URL construction
- ✅ File loading logic

All voice behavior is controlled from this single configuration file.