// Script to download free assets for Elemental Familiar
// This script attempts to download assets from various free sources

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '../public/assets');

// Ensure directories exist
const dirs = [
    'pets',
    'icons',
    'items',
    'backgrounds',
    'audio/music',
    'audio/sfx'
];

dirs.forEach(dir => {
    const fullPath = path.join(assetsDir, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }
});

function downloadFile(url, filepath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(filepath);
        
        protocol.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // Handle redirect
                return downloadFile(response.headers.location, filepath)
                    .then(resolve)
                    .catch(reject);
            }
            
            if (response.statusCode !== 200) {
                file.close();
                fs.unlinkSync(filepath);
                reject(new Error(`Failed to download: ${response.statusCode}`));
                return;
            }
            
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            file.close();
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
            reject(err);
        });
    });
}

// List of free asset URLs to try (these are examples - replace with actual URLs)
const assetUrls = {
    // Icons from various free sources
    'icons/food.png': 'https://opengameart.org/sites/default/files/styles/thumbnail/public/food_icon.png',
    'icons/tool.png': 'https://opengameart.org/sites/default/files/styles/thumbnail/public/tool_icon.png',
    'icons/toy.png': 'https://opengameart.org/sites/default/files/styles/thumbnail/public/toy_icon.png',
    'icons/battery.png': 'https://opengameart.org/sites/default/files/styles/thumbnail/public/battery_icon.png',
    'icons/currency.png': 'https://opengameart.org/sites/default/files/styles/thumbnail/public/coin_icon.png',
};

console.log('Asset downloader ready. Add actual URLs to download real assets.');
console.log('For now, placeholder assets will be created.');

module.exports = { downloadFile };

