#!/bin/bash
# Asset Setup Script for Elemental Familiar
# This script helps organize and verify assets

echo "=== Elemental Familiar - Asset Setup ==="
echo ""

ASSETS_DIR="public/assets"

# Check if directories exist
echo "Checking asset directories..."
for dir in "pets" "icons" "items" "backgrounds" "audio/music" "audio/sfx"; do
    if [ -d "$ASSETS_DIR/$dir" ]; then
        echo "✓ $dir exists"
    else
        echo "✗ $dir missing - creating..."
        mkdir -p "$ASSETS_DIR/$dir"
    fi
done

echo ""
echo "Current assets:"

# Count pet sprites
PET_COUNT=$(find "$ASSETS_DIR/pets" -name "*.png" -o -name "*.svg" 2>/dev/null | wc -l | tr -d ' ')
echo "Pet sprites: $PET_COUNT files"

# Count icons
ICON_COUNT=$(find "$ASSETS_DIR/icons" -name "*.png" -o -name "*.svg" 2>/dev/null | wc -l | tr -d ' ')
echo "Icons: $ICON_COUNT files"

# Count items
ITEM_COUNT=$(find "$ASSETS_DIR/items" -name "*.png" -o -name "*.svg" 2>/dev/null | wc -l | tr -d ' ')
echo "Items: $ITEM_COUNT files"

# Count backgrounds
BG_COUNT=$(find "$ASSETS_DIR/backgrounds" -name "*.png" -o -name "*.svg" 2>/dev/null | wc -l | tr -d ' ')
echo "Backgrounds: $BG_COUNT files"

# Count audio files
MUSIC_COUNT=$(find "$ASSETS_DIR/audio/music" -name "*.mp3" -o -name "*.wav" -o -name "*.ogg" 2>/dev/null | wc -l | tr -d ' ')
SFX_COUNT=$(find "$ASSETS_DIR/audio/sfx" -name "*.mp3" -o -name "*.wav" -o -name "*.ogg" 2>/dev/null | wc -l | tr -d ' ')
echo "Music: $MUSIC_COUNT files"
echo "Sound Effects: $SFX_COUNT files"

echo ""
echo "=== Asset Checklist ==="
echo "Required pet sprites (12 total):"
echo "  [ ] fire_idle.png"
echo "  [ ] fire_low.png"
echo "  [ ] fire_broken.png"
echo "  [ ] water_idle.png"
echo "  [ ] water_low.png"
echo "  [ ] water_broken.png"
echo "  [ ] earth_idle.png"
echo "  [ ] earth_low.png"
echo "  [ ] earth_broken.png"
echo "  [ ] air_idle.png"
echo "  [ ] air_low.png"
echo "  [ ] air_broken.png"
echo ""
echo "Required audio:"
echo "  [ ] audio/music/background_loop.mp3"
echo "  [ ] audio/sfx/button_click.mp3"
echo "  [ ] audio/sfx/success.mp3"
echo "  [ ] audio/sfx/fail.mp3"
echo ""
echo "See ASSETS_README.md for asset sources and licensing information."

