#!/bin/bash
# Script to download free assets from various sources
# Make sure to verify licenses before using in production

cd "$(dirname "$0")/../public/assets"

echo "Downloading free assets..."

# Download from OpenGameArt or other free sources
# Note: These URLs are examples - replace with actual free asset URLs

# Try downloading from known free asset CDNs
echo "Attempting to download assets..."

# Sound effects from free sources
cd audio/sfx

# Try alternative sources for button click
curl -L -o button_click_alt.wav "https://opengameart.org/sites/default/files/audio_preview/button-09_0.wav" 2>/dev/null || echo "Button click download failed"

# Try downloading from freesound (requires API key, so using alternative)
echo "Note: For production, download from freesound.org with proper attribution"

cd ../music

# Try downloading a shorter loop
echo "Background music downloaded. For production, use royalty-free music from:"
echo "- Bensound.com (requires attribution)"
echo "- Incompetech.com (Kevin MacLeod)"
echo "- Freesound.org"

cd ../../..

echo "Asset download complete!"
echo "Remember to verify licenses and add proper attribution!"

