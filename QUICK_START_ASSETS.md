# Quick Start: Downloading Real Assets

This guide helps you quickly download and integrate real assets into Elemental Familiar.

## 🎯 Current Status

✅ **All placeholder assets created** - The game is fully functional with SVG placeholders
⚠️ **Ready for real assets** - Just replace the placeholder files

## 📥 Quick Download Guide

### Option 1: Use the Download Scripts

1. **Edit the download script** with actual asset URLs:
   ```bash
   nano scripts/download_assets.js
   ```

2. **Run the download script**:
   ```bash
   node scripts/download_assets.js
   ```

### Option 2: Manual Download

#### Pet Sprites (Priority: High)
**Recommended Source**: Kenney.nl or OpenGameArt.org

1. Go to https://kenney.nl/assets or https://opengameart.org
2. Search for "pixel pet" or "creature sprite"
3. Download sprite sheets
4. Extract and rename to match:
   - `fire_idle.png`, `fire_low.png`, `fire_broken.png`
   - `water_idle.png`, `water_low.png`, `water_broken.png`
   - `earth_idle.png`, `earth_low.png`, `earth_broken.png`
   - `air_idle.png`, `air_low.png`, `air_broken.png`
5. Place in `public/assets/pets/`

#### Icons (Priority: Medium)
**Recommended Source**: Kenney.nl UI Pack

1. Go to https://kenney.nl/assets/ui-pack
2. Download the UI pack
3. Extract icons you need:
   - Food icon → `public/assets/icons/food.png`
   - Tool icon → `public/assets/icons/tool.png`
   - Toy icon → `public/assets/icons/toy.png`
   - Battery/Energy icon → `public/assets/icons/battery.png`
   - Currency/Coin icon → `public/assets/icons/currency.png`

#### Backgrounds (Priority: Low)
**Recommended Source**: OpenGameArt.org

1. Go to https://opengameart.org
2. Search "2D background" or "room interior"
3. Download and resize to ~800x600px
4. Save as:
   - `public/assets/backgrounds/habitat.png`
   - `public/assets/backgrounds/shop.png`

#### Audio (Priority: Medium)
**Recommended Sources**: 
- Bensound.com (music)
- Zapsplat.com (sound effects)

**Music**:
1. Go to https://www.bensound.com
2. Search "calming" or "ambient"
3. Download a loop
4. Save as `public/assets/audio/music/background_loop.mp3`

**Sound Effects**:
1. Go to https://www.zapsplat.com (free account required)
2. Search and download:
   - Button click sound
   - Success/positive sound
   - Error/fail sound
3. Save as:
   - `public/assets/audio/sfx/button_click.mp3`
   - `public/assets/audio/sfx/success.mp3`
   - `public/assets/audio/sfx/fail.mp3`

## ✅ Verification

After downloading assets, run:
```bash
./scripts/setup_assets.sh
```

This will verify all required files are present.

## 📝 License Attribution

**IMPORTANT**: Most free assets require attribution. Add credits to:

1. **README.md** - Add a "Credits" section
2. **Footer of index.html** (optional)
3. **ASSETS_README.md** - Document all sources

Example attribution format:
```
## Credits

- Pet Sprites: "Pixel Pet Pack" by Artist Name (https://source.com) - CC0
- UI Icons: Kenney.nl UI Pack - CC0
- Music: "Calm Ambient" by Bensound (https://bensound.com) - Royalty Free
- Sound Effects: Zapsplat.com - Free with Attribution
```

## 🚀 Testing

1. Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Start the server: `npm start`
3. Open http://localhost:3000
4. Check browser console for any 404 errors
5. Verify all images load correctly
6. Test audio playback (may require user interaction first)

## 💡 Tips

- **Start with pet sprites** - They're the most visible
- **Use consistent art style** - All sprites should match
- **Optimize file sizes** - Compress images for web
- **Test on different browsers** - Ensure compatibility
- **Keep backups** - Save original files before replacing

## 🆘 Troubleshooting

**Images not loading?**
- Check file names match exactly (case-sensitive)
- Verify file paths in browser console
- Clear browser cache

**Audio not playing?**
- Modern browsers require user interaction before playing audio
- Check file format (MP3, WAV, or OGG)
- Verify file isn't corrupted

**Assets look wrong?**
- Ensure image dimensions are appropriate
- Check color format (RGB, not CMYK)
- Verify transparency if using PNG

## 📚 Additional Resources

- See `ASSETS_README.md` for detailed asset information
- See `README.md` for project setup
- Check browser console for specific error messages

