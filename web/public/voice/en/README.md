# English Voice Files (EN)

This directory contains English pre-recorded audio files for the Living Twin demo using professional ElevenLabs voices.

## Directory Structure

### Language Organization
- `/voice/en/` - English voice files (current)
- `/voice/sv/` - Swedish voice files (future)

### Main Directory (Current Default: V2.5 Enhanced)
Contains the currently active English voice files used by the demo.

### Version Directories

#### `eleven-labs-v25/` - ElevenLabs V2.5 Turbo (Current Default)
Enhanced professional voices with personality and natural delivery:
- **Twin Voice (Female - Warm & Friendly)**: Bella voice with emphasis and pauses
- **CEO Voice (Male - Executive Confidence)**: Josh voice with authoritative delivery
- Files named with `_v25` suffix for version identification

#### `eleven-labs-v1/` - ElevenLabs V1 Monolingual (Backup)
Original professional voices with basic delivery:
- Standard professional tone without enhanced personality
- Clean filenames without version suffix

## File Structure

### Twin Voice Files (Female - Warm Professional AI Assistant)
- `twin_001.mp3` - "Good morning Sir! Today we have three strategic operational adjustments that need your attention."
- `twin_002.mp3` - "First... Q3 revenue miss signals market positioning disconnect - eight percent below target across enterprise segment."
- `twin_003.mp3` - "Second... engineering velocity declining while customer feature requests accelerating - creating strategic debt."
- `twin_004.mp3` - "Third... competitor TechFlow acquisition shifts industry dynamics - two point one billion signals AI-first positioning."
- `twin_005.mp3` - "Perfect! All strategic adjustments are captured. Should I coordinate the cross-functional alignment?"

### CEO Voice Files (Male - Executive Leadership)
- `ceo_001.mp3` - "That suggests our value proposition alignment is off. Convene strategic revenue review - include product and marketing."
- `ceo_002.mp3` - "Classic technical debt versus market velocity trade-off. Initiate architecture review with roadmap realignment."
- `ceo_003.mp3` - "Our competitive moat needs reinforcement. Fast-track AI integration strategy and adjust market messaging."
- `ceo_004.mp3` - "Yes, but cascade through department leads first. Excellent strategic synthesis."

## Recording Guidelines

### Voice Characteristics
**Twin (Organizational AI)**
- Female voice, professional, measured pace
- Slightly analytical, clear articulation
- Authoritative but not dominant
- Rate: 140-160 words per minute

**CEO (Executive)**
- Male voice, confident, decisive
- Slightly faster pace, natural executive tone
- Authoritative and action-oriented
- Rate: 160-180 words per minute

### Technical Specifications
- **Format**: MP3, 44.1kHz, 128kbps minimum
- **Volume**: Normalized, consistent levels
- **Background**: Clean, no ambient noise
- **Duration**: Natural pacing with brief pauses

### Recording Script
Copy the exact text from the conversationScript in the demo file to ensure perfect synchronization.

## Usage
Once recorded, place files in this directory. The demo will automatically use them when "Pre-recorded" voice mode is selected.

## Fallback
If audio files are missing, the system will fall back to estimated timing for synchronization without breaking the demo.