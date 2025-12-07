// Generate placeholder assets using Node.js Canvas or simple image generation
// This creates basic placeholder images for development

const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../public/assets');

// Create simple SVG placeholders
function createSVGIcon(name, color, symbol) {
    return `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" fill="${color}" rx="8"/>
  <text x="32" y="40" font-size="32" text-anchor="middle" fill="white">${symbol}</text>
</svg>`;
}

function createSVGBackground(name, color1, color2) {
    return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#grad)"/>
  <text x="400" y="300" font-size="48" text-anchor="middle" fill="rgba(255,255,255,0.3)" font-family="Arial">${name}</text>
</svg>`;
}

// Create placeholder icons
const icons = {
    'food.png': createSVGIcon('Food', '#4CAF50', '🍎'),
    'tool.png': createSVGIcon('Tool', '#2196F3', '🔧'),
    'toy.png': createSVGIcon('Toy', '#FF9800', '🎮'),
    'battery.png': createSVGIcon('Battery', '#FFC107', '🔋'),
    'currency.png': createSVGIcon('Currency', '#FFD700', '⚙️'),
    'golden_gear.png': createSVGIcon('Golden Gear', '#FFD700', '⚙️'),
    'crystal_ball.png': createSVGIcon('Crystal Ball', '#9C27B0', '🔮'),
    'mechanical_flower.png': createSVGIcon('Flower', '#E91E63', '🌸'),
};

// Create placeholder pet sprites (simple colored circles with element symbols)
const petSprites = {
    'fire_idle.png': createSVGIcon('Fire Pet', '#FF5722', '🔥'),
    'fire_low.png': createSVGIcon('Fire Pet Low', '#FF8A65', '🟠'),
    'fire_broken.png': createSVGIcon('Fire Pet Broken', '#424242', '⚫'),
    'water_idle.png': createSVGIcon('Water Pet', '#2196F3', '💧'),
    'water_low.png': createSVGIcon('Water Pet Low', '#64B5F6', '🔵'),
    'water_broken.png': createSVGIcon('Water Pet Broken', '#424242', '⚫'),
    'earth_idle.png': createSVGIcon('Earth Pet', '#8BC34A', '🌍'),
    'earth_low.png': createSVGIcon('Earth Pet Low', '#A5D6A7', '🟤'),
    'earth_broken.png': createSVGIcon('Earth Pet Broken', '#424242', '⚫'),
    'air_idle.png': createSVGIcon('Air Pet', '#E1BEE7', '💨'),
    'air_low.png': createSVGIcon('Air Pet Low', '#F3E5F5', '⚪'),
    'air_broken.png': createSVGIcon('Air Pet Broken', '#424242', '⚫'),
};

// Create backgrounds
const backgrounds = {
    'habitat.png': createSVGBackground('Habitat', '#1a1a2e', '#16213e'),
    'shop.png': createSVGBackground('Shop', '#2c3e50', '#34495e'),
};

// Write icon files
Object.entries(icons).forEach(([filename, svg]) => {
    const filepath = path.join(assetsDir, 'icons', filename);
    fs.writeFileSync(filepath, svg);
    console.log(`Created: ${filepath}`);
});

// Write pet sprite files
Object.entries(petSprites).forEach(([filename, svg]) => {
    const filepath = path.join(assetsDir, 'pets', filename);
    fs.writeFileSync(filepath, svg);
    console.log(`Created: ${filepath}`);
});

// Write background files
Object.entries(backgrounds).forEach(([filename, svg]) => {
    const filepath = path.join(assetsDir, 'backgrounds', filename);
    fs.writeFileSync(filepath, svg);
    console.log(`Created: ${filepath}`);
});

// Create item placeholders
const items = {
    'golden_gear.png': createSVGIcon('Golden Gear', '#FFD700', '⚙️'),
    'crystal_ball.png': createSVGIcon('Crystal Ball', '#9C27B0', '🔮'),
    'mechanical_flower.png': createSVGIcon('Flower', '#E91E63', '🌸'),
    'toy.png': createSVGIcon('Toy', '#FF9800', '🎮'),
    'food.png': createSVGIcon('Food', '#4CAF50', '🍎'),
};

Object.entries(items).forEach(([filename, svg]) => {
    const filepath = path.join(assetsDir, 'items', filename);
    fs.writeFileSync(filepath, svg);
    console.log(`Created: ${filepath}`);
});

console.log('\n✅ All placeholder assets created!');
console.log('Replace these with actual assets when available.');

