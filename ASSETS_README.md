# Assets Guide

This document explains the asset structure and how to replace placeholder assets with real ones.

## Current Asset Status

### ✅ Created (SVG Placeholders)
- **Pet Sprites**: `/public/assets/pets/` - SVG placeholders for all 4 elements (fire, water, earth, air) in 3 states (idle, low, broken)
- **Icons**: `/public/assets/icons/` - SVG placeholders for UI icons (food, tool, toy, battery, currency, etc.)
- **Items**: `/public/assets/items/` - SVG placeholders for shop items
- **Backgrounds**: `/public/assets/backgrounds/` - SVG gradient backgrounds

### ⚠️ Needs Real Files
- **Audio**: `/public/assets/audio/` - Currently has placeholder HTML files, needs actual MP3/WAV files

## Recommended Asset Sources

### Character Art (Pet Sprites)
1. **Kenney.nl** - https://kenney.nl/assets
   - Search for "pixel pet" or "creature"
   - License: CC0 (Public Domain)
   
2. **itch.io** - https://itch.io/game-assets/free
   - Search "pixel pet sprite"
   - Filter by: Free, CC0 or CC BY
   
3. **OpenGameArt.org** - https://opengameart.org
   - Search "pet sprite" or "familiar"
   - Filter by: CC0 or CC BY

### Icons & UI
1. **Kenney.nl UI Pack** - https://kenney.nl/assets/ui-pack
   - Complete UI pack with buttons, icons, etc.
   - License: CC0

2. **CraftPix.net** - https://craftpix.net/freebies/
   - Free GUI packs
   - Check license per pack

### Backgrounds
1. **OpenGameArt.org** - https://opengameart.org
   - Search "2D background" or "tileset"
   - Filter by: CC BY (allows commercial use)

2. **Kenney.nl** - https://kenney.nl/assets
   - Various background packs

### Music
1. **Bensound.com** - https://www.bensound.com
   - Free music with attribution
   - License: Royalty Free (requires attribution)

2. **Incompetech.com** - https://incompetech.com/music/
   - Kevin MacLeod's music
   - License: CC BY (requires attribution)

3. **Zapsplat.com** - https://www.zapsplat.com
   - Free with account (requires attribution)

### Sound Effects
1. **Zapsplat.com** - https://www.zapsplat.com
   - Free with account
   - License: Free with attribution

2. **Freesound.org** - https://freesound.org
   - CC0 and CC BY sounds
   - Requires account

3. **Pixabay.com** - https://pixabay.com/music/
   - Free music and sound effects
   - License: Pixabay License (free for commercial use)

## File Naming Convention

### Pet Sprites
- Format: `{element}_{state}.png`
- Examples:
  - `fire_idle.png`
  - `fire_low.png`
  - `fire_broken.png`
  - `water_idle.png`
  - etc.

### Icons
- Use descriptive names: `food.png`, `tool.png`, `toy.png`, etc.

### Audio
- Music: `background_loop.mp3` (or `.wav`, `.ogg`)
- SFX: `button_click.mp3`, `success.mp3`, `fail.mp3`

## Replacing Assets

1. **Pet Sprites**: Replace files in `/public/assets/pets/` maintaining the naming convention
2. **Icons**: Replace files in `/public/assets/icons/` with same filenames
3. **Items**: Replace files in `/public/assets/items/` with same filenames
4. **Backgrounds**: Replace files in `/public/assets/backgrounds/` with same filenames
5. **Audio**: Replace MP3 files in `/public/assets/audio/music/` and `/public/assets/audio/sfx/`

## License Attribution

When using assets that require attribution, add credits to:
- `public/index.html` (footer)
- `README.md` (Credits section)

Example format:
```
Music: "Track Name" by Artist (https://source.com) - Licensed under CC BY
Sprites: "Pack Name" by Artist (https://source.com) - Licensed under CC0
```

## Testing Assets

After replacing assets:
1. Clear browser cache
2. Check browser console for 404 errors
3. Verify all images load correctly
4. Test audio playback (may require user interaction)

## Current Placeholder Assets

The current SVG placeholders are functional and will work until replaced. They use:
- Simple colored rectangles with emoji symbols
- Gradient backgrounds
- Basic shapes

These are sufficient for development and testing but should be replaced with professional assets for production.

