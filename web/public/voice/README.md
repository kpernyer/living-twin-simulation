# Living Twin Voice Assets

This directory contains all voice files for the Living Twin demo, organized by language.

## Directory Structure

```
voice/
├── README.md                    # This file
├── en/                         # English voice files
│   ├── README.md               # English-specific documentation
│   ├── *.mp3                   # Current voice files (V2.5 Enhanced)
│   ├── eleven-labs-v1/         # V1 Monolingual backup
│   └── eleven-labs-v25/        # V2.5 Turbo source files
└── sv/                         # Swedish voice files (future)
    └── README.md               # Swedish-specific documentation
```

## Language Support

### ✅ English (EN) - Active
- **Status**: Fully implemented with professional ElevenLabs voices
- **Model**: V2.5 Turbo with voice direction
- **Voices**: Bella (Twin), Josh (CEO)
- **Features**: Enhanced personality, natural pauses, warm delivery
- **Files**: 27 total (9 active + 9 V1 backup + 9 V2.5 source)

### ✅ Swedish (SV) - Active  
- **Status**: Fully implemented with professional Swedish voices
- **Model**: Multilingual V2 with Swedish voice direction
- **Voices**: Bella (Twin), Josh (CEO) with Swedish pronunciation
- **Features**: Professional Swedish business terminology, natural rhythm
- **Files**: 18 total (9 active + 9 V2 source)

## Technical Implementation

### Voice Service Integration
The voice service automatically loads from `/voice/{language}/` where language defaults to 'en'.

### File Naming Convention
- **Active files**: `{speaker}_{number}.mp3` (e.g., `twin_001.mp3`)
- **Version directories**: `eleven-labs-v{version}/`
- **Versioned files**: Include version suffix (e.g., `twin_001_v25.mp3`)

### Adding New Languages
1. Create `voice/{language_code}/` directory
2. Add language-specific README.md
3. Generate voice files with **identical filenames** to existing languages
4. Update voice service for language selection ✅ 
5. Add language selector to demo interface ✅

### Language Switching
The demo now supports real-time language switching between English and Swedish:
- **Voice Service**: Automatically loads from `/voice/{language}/` 
- **File Names**: Identical across all languages (`twin_001.mp3`, etc.)
- **Demo Interface**: Language selector available when using pre-recorded voices
- **Configuration**: Only the top-level directory path changes

## Voice Generation Scripts
- `scripts/generate_voices.js` - V1 voice generation
- `scripts/generate_voices_v25.js` - V2.5 enhanced voice generation
- Both scripts now target `/voice/en/` by default

## Quality Levels
- **V1**: Basic professional voices (backup in `eleven-labs-v1/`)
- **V2.5**: Enhanced voices with personality and natural delivery (current default)
- **Future**: V3+ models as they become available

## Usage
The demo automatically uses voices from the appropriate language directory based on the selected language (defaults to English).