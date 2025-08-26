# Swedish Voice Files (SV)

This directory is prepared for Swedish pre-recorded audio files for the Living Twin demo.

## Status
✅ **Implemented** - Swedish voices now available!

## Current Structure

This directory contains professional Swedish voices generated with ElevenLabs Multilingual V2:
- Swedish translations of all conversation scripts
- Professional Swedish voices using ElevenLabs multilingual models
- Same file naming convention as English version

### Current File Structure

#### Twin Voice Files (Female - Swedish AI Assistant)
- `twin_001.mp3` - "God morgon! Idag har vi tre strategiska operativa justeringar som behöver din uppmärksamhet."
- `twin_002.mp3` - "För det första... Q3:s intäktsmiss signalerar en koppling till marknadspositionering - åtta procent under målet inom företagssegmentet."
- `twin_003.mp3` - "För det andra... ingenjörshastigheten minskar medan kundernas funktionsförfrågningar accelererar - vilket skapar strategisk skuld."
- `twin_004.mp3` - "För det tredje... konkurrenten TechFlows förvärv förändrar branschdynamiken - två komma en miljard signalerar AI-först positionering."
- `twin_005.mp3` - "Perfekt! Alla strategiska justeringar är registrerade. Ska jag koordinera tvärfunktionell anpassning?"

#### CEO Voice Files (Male - Swedish Executive)
- `ceo_001.mp3` - "Det antyder att vår värdeerbjudande-anpassning är felaktig. Sammankalla strategisk intäktsgranskning - inkludera produkt och marknadsföring."
- `ceo_002.mp3` - "Klassisk teknisk skuld kontra marknadshastighet avvägning. Initiera arkitekturgranskning med färdplansjustering."
- `ceo_003.mp3` - "Vär konkurrensfördel behöver förstärkning. Påskynda AI-integrationsstrategi och justera marknadsmeddelanden."
- `ceo_004.mp3` - "Ja, men kaskad genom avdelningsledare först. Utmärkt strategisk syntes."

### Version Directory
- `eleven-labs-v2/` - Contains source files with `_sv_v2` suffix using Multilingual V2 model

### Implementation Notes
- Will use ElevenLabs multilingual models for Swedish
- Voice characteristics will maintain same professional tone
- Directory structure will mirror English version with `eleven-labs-v*` subdirectories
- Translation should maintain business context and strategic terminology

## Technical Details
- **Model**: ElevenLabs Multilingual V2 
- **Voices**: Bella (Twin), Josh (CEO) - same as English but with Swedish pronunciation
- **Quality**: Professional Swedish pronunciation with natural rhythm and business terminology
- **File Sizes**: Larger than English due to Swedish sentence structure and pronunciation timing

## Activation
To use Swedish voices in the demo:
1. ✅ Swedish translations created
2. ✅ Swedish voice files generated  
3. 🔄 Update voice service to support language parameter
4. 🔄 Add language selector to demo interface