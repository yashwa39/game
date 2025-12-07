// API Base URL
const API_BASE = 'http://localhost:3000/api';

// State management
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let currentPet = null;
let speciesList = [];
let shopItems = [];
let inventoryItems = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    
    // Start background music (optional, can be muted)
    startBackgroundMusic();
    
    if (authToken) {
        checkAuthAndLoadGame();
    } else {
        showScreen('auth-screen');
    }
});

// Background music
let backgroundMusic = null;

function startBackgroundMusic() {
    try {
        backgroundMusic = new Audio('/assets/audio/music/background_loop.mp3');
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.3;
        // Don't autoplay - user interaction required
        // backgroundMusic.play().catch(() => {});
    } catch (error) {
        console.log('Background music not available');
    }
}

function toggleMusic() {
    if (backgroundMusic) {
        if (backgroundMusic.paused) {
            backgroundMusic.play().catch(() => {});
        } else {
            backgroundMusic.pause();
        }
    }
}

// Event Listeners
function setupEventListeners() {
    // Auth tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tab = e.target.dataset.tab;
            switchAuthTab(tab);
        });
    });

    // Login form
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    // Adoption
    document.getElementById('adopt-btn').addEventListener('click', handleAdopt);
    document.getElementById('pet-name-input').addEventListener('input', validateAdoption);
    
    // Care actions
    document.getElementById('feed-btn').addEventListener('click', () => {
        playSound('click');
        performAction('feed');
    });
    document.getElementById('maintain-btn').addEventListener('click', () => {
        playSound('click');
        performAction('maintain');
    });
    document.getElementById('play-btn').addEventListener('click', () => {
        playSound('click');
        performAction('play');
    });
    
    // Navigation
    document.getElementById('shop-btn').addEventListener('click', () => {
        playSound('click');
        openShop();
    });
    document.getElementById('inventory-btn').addEventListener('click', () => {
        playSound('click');
        openInventory();
    });
    document.getElementById('music-toggle-btn').addEventListener('click', () => {
        toggleMusic();
        const btn = document.getElementById('music-toggle-btn');
        btn.textContent = backgroundMusic && !backgroundMusic.paused ? '🔇' : '🔊';
    });
    document.getElementById('close-shop-btn').addEventListener('click', () => {
        playSound('click');
        showScreen('game-screen');
    });
    document.getElementById('close-inventory-btn').addEventListener('click', () => {
        playSound('click');
        showScreen('game-screen');
    });
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

// Auth Functions
async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.error || 'Login failed';
            return;
        }

        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        currentUser = data.user;
        
        await checkAuthAndLoadGame();
    } catch (error) {
        errorEl.textContent = 'Network error. Please try again.';
        console.error('Login error:', error);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorEl = document.getElementById('register-error');

    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.error || 'Registration failed';
            return;
        }

        authToken = data.token;
        localStorage.setItem('authToken', authToken);
        currentUser = data.user;
        
        await loadSpecies();
        showScreen('adoption-screen');
    } catch (error) {
        errorEl.textContent = 'Network error. Please try again.';
        console.error('Register error:', error);
    }
}

function switchAuthTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    
    document.getElementById('login-form').classList.toggle('active', tab === 'login');
    document.getElementById('register-form').classList.toggle('active', tab === 'register');
    
    document.getElementById('login-error').textContent = '';
    document.getElementById('register-error').textContent = '';
}

// Game Functions
async function checkAuthAndLoadGame() {
    try {
        // Load user info
        const userResponse = await fetch(`${API_BASE}/user`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (!userResponse.ok) {
            throw new Error('Auth failed');
        }

        const userData = await userResponse.json();
        currentUser = userData.user;

        // Try to load pet
        const petResponse = await fetch(`${API_BASE}/pet`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (petResponse.status === 404) {
            // No pet, show adoption screen
            await loadSpecies();
            showScreen('adoption-screen');
        } else if (petResponse.ok) {
            const petData = await petResponse.json();
            currentPet = petData.pet;
            showScreen('game-screen');
            updateGameDisplay();
            startPetUpdateLoop();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('authToken');
        authToken = null;
        showScreen('auth-screen');
    }
}

async function loadSpecies() {
    try {
        const response = await fetch(`${API_BASE}/species`);
        const data = await response.json();
        speciesList = data.species;
        
        const container = document.getElementById('species-selection');
        container.innerHTML = '';
        
        let selectedSpeciesId = null;
        
        speciesList.forEach(species => {
            const card = document.createElement('div');
            card.className = 'species-card';
            card.dataset.speciesId = species.species_id;
            
            const icon = getElementIcon(species.element);
            
            card.innerHTML = `
                <div class="species-icon">${icon}</div>
                <div>${species.name}</div>
            `;
            
            card.addEventListener('click', () => {
                document.querySelectorAll('.species-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                selectedSpeciesId = species.species_id;
                validateAdoption();
            });
            
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Load species error:', error);
    }
}

function getElementIcon(element) {
    const icons = {
        fire: '🔥',
        water: '💧',
        earth: '🌍',
        air: '💨'
    };
    return icons[element] || '⚙️';
}

function validateAdoption() {
    const name = document.getElementById('pet-name-input').value.trim();
    const selected = document.querySelector('.species-card.selected');
    const adoptBtn = document.getElementById('adopt-btn');
    
    adoptBtn.disabled = !(name.length > 0 && selected);
}

async function handleAdopt() {
    const name = document.getElementById('pet-name-input').value.trim();
    const selected = document.querySelector('.species-card.selected');
    
    if (!name || !selected) return;
    
    const speciesId = parseInt(selected.dataset.speciesId);
    const errorEl = document.getElementById('adoption-error');
    
    try {
        const response = await fetch(`${API_BASE}/pet/adopt`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ name, speciesId })
        });

        const data = await response.json();

        if (!response.ok) {
            errorEl.textContent = data.error || 'Adoption failed';
            return;
        }

        currentPet = data.pet;
        showScreen('game-screen');
        updateGameDisplay();
        startPetUpdateLoop();
    } catch (error) {
        errorEl.textContent = 'Network error. Please try again.';
        console.error('Adopt error:', error);
    }
}

// Care Actions
async function performAction(action) {
    try {
        const response = await fetch(`${API_BASE}/pet/${action}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Action failed');
            return;
        }

        // Play success sound (if available)
        playSound('success');
        
        // Refresh pet data
        await loadPet();
    } catch (error) {
        console.error('Action error:', error);
        alert('Network error. Please try again.');
    }
}

async function loadPet() {
    try {
        const response = await fetch(`${API_BASE}/pet`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.ok) {
            const data = await response.json();
            currentPet = data.pet;
            updateGameDisplay();
        }
    } catch (error) {
        console.error('Load pet error:', error);
    }
}

function updateGameDisplay() {
    if (!currentPet || !currentUser) return;

    // Update user info
    document.getElementById('username-display').textContent = currentUser.username;
    document.getElementById('gears-count').textContent = currentUser.gears;
    document.getElementById('shop-gears-count').textContent = currentUser.gears;

    // Update pet info
    document.getElementById('pet-name').textContent = currentPet.name;
    document.getElementById('pet-species').textContent = `${currentPet.species_name} (${currentPet.element})`;

    // Update stats
    updateStatBar('energy', currentPet.energy_stat);
    updateStatBar('tension', currentPet.tension_stat);
    updateStatBar('maintenance', currentPet.maintenance_stat);

    // Update pet sprite based on lowest stat
    updatePetSprite();
}

function updateStatBar(statName, value) {
    const bar = document.getElementById(`${statName}-bar`);
    const valueEl = document.getElementById(`${statName}-value`);
    
    bar.style.width = `${value}%`;
    valueEl.textContent = value;
    
    // Update color based on value
    bar.classList.remove('low', 'medium');
    if (value < 30) {
        bar.classList.add('low');
    } else if (value < 60) {
        bar.classList.add('medium');
    }
}

function updatePetSprite() {
    const spriteEl = document.getElementById('pet-sprite');
    const stats = {
        energy: currentPet.energy_stat,
        tension: currentPet.tension_stat,
        maintenance: currentPet.maintenance_stat
    };
    
    const minStat = Math.min(stats.energy, stats.tension, stats.maintenance);
    
    // Determine sprite state
    let spriteState = 'idle';
    if (minStat < 30) {
        spriteState = 'broken';
    } else if (minStat < 60) {
        spriteState = 'low';
    }
    
    // Use actual sprite images
    const element = currentPet.element.toLowerCase();
    const spritePath = `/assets/pets/${element}_${spriteState}.png`;
    
    spriteEl.innerHTML = `<img src="${spritePath}" alt="${currentPet.name}" class="pet-image" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'pet-placeholder\\'>⚙️</div>';">`;
}

// Pet update loop (refresh stats every 30 seconds)
function startPetUpdateLoop() {
    setInterval(() => {
        if (document.getElementById('game-screen').classList.contains('active')) {
            loadPet();
        }
    }, 30000);
}

// Shop Functions
async function openShop() {
    showScreen('shop-screen');
    
    try {
        const response = await fetch(`${API_BASE}/shop`);
        const data = await response.json();
        shopItems = data.items;
        
        displayShopItems();
    } catch (error) {
        console.error('Load shop error:', error);
    }
}

function displayShopItems() {
    const container = document.getElementById('shop-items');
    container.innerHTML = '';
    
    shopItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        
        const canAfford = currentUser.gears >= item.price;
        
        card.innerHTML = `
            <div class="item-icon">${getItemIcon(item.item_type)}</div>
            <h3>${item.name}</h3>
            <p>${item.description || ''}</p>
            <div class="item-price">⚙️ ${item.price}</div>
            <button ${!canAfford ? 'disabled' : ''} onclick="purchaseItem(${item.item_id})">
                ${canAfford ? 'Purchase' : 'Insufficient Gears'}
            </button>
        `;
        
        container.appendChild(card);
    });
}

function getItemIcon(type) {
    // Try to use actual icon images, fallback to emoji
    const iconMap = {
        cosmetic: '/assets/icons/golden_gear.png',
        food: '/assets/icons/food.png',
        toy: '/assets/icons/toy.png',
        tool: '/assets/icons/tool.png'
    };
    
    const iconPath = iconMap[type] || '/assets/icons/currency.png';
    return `<img src="${iconPath}" alt="${type}" class="item-icon-img" onerror="this.style.display='none'; this.parentElement.innerHTML='${getEmojiIcon(type)}';">`;
}

function getEmojiIcon(type) {
    const icons = {
        cosmetic: '✨',
        food: '🍎',
        toy: '🎮',
        tool: '🔧'
    };
    return icons[type] || '📦';
}

async function purchaseItem(itemId) {
    try {
        const response = await fetch(`${API_BASE}/shop/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ itemId })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Purchase failed');
            return;
        }

        // Update user gears
        currentUser.gears = data.remainingGears;
        document.getElementById('gears-count').textContent = currentUser.gears;
        document.getElementById('shop-gears-count').textContent = currentUser.gears;
        
        // Refresh shop and inventory
        displayShopItems();
        await loadInventory();
        
        playSound('success');
        alert('Item purchased successfully!');
    } catch (error) {
        console.error('Purchase error:', error);
        alert('Network error. Please try again.');
    }
}

// Inventory Functions
async function openInventory() {
    showScreen('inventory-screen');
    await loadInventory();
}

async function loadInventory() {
    try {
        const response = await fetch(`${API_BASE}/inventory`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();
        inventoryItems = data.inventory;
        
        displayInventory();
    } catch (error) {
        console.error('Load inventory error:', error);
    }
}

function displayInventory() {
    const container = document.getElementById('inventory-items');
    container.innerHTML = '';
    
    if (inventoryItems.length === 0) {
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Your inventory is empty. Visit the shop to buy items!</p>';
        return;
    }
    
    inventoryItems.forEach(item => {
        const card = document.createElement('div');
        card.className = `inventory-item ${item.equipped ? 'equipped' : ''}`;
        
        card.innerHTML = `
            <div class="item-icon">${getItemIcon(item.item_type)}</div>
            <h3>${item.name}</h3>
            <p>${item.description || ''}</p>
            <p>Quantity: ${item.quantity}</p>
            <button onclick="toggleEquip(${item.inventory_id}, ${!item.equipped})">
                ${item.equipped ? 'Unequip' : 'Equip'}
            </button>
        `;
        
        container.appendChild(card);
    });
}

async function toggleEquip(inventoryId, equipped) {
    try {
        const response = await fetch(`${API_BASE}/inventory/equip`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({ inventoryId, equipped })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Equip failed');
            return;
        }

        await loadInventory();
        playSound('success');
    } catch (error) {
        console.error('Equip error:', error);
        alert('Network error. Please try again.');
    }
}

// Utility Functions
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function playSound(type) {
    try {
        const audio = new Audio();
        const soundMap = {
            'success': '/assets/audio/sfx/success.mp3',
            'fail': '/assets/audio/sfx/fail.mp3',
            'click': '/assets/audio/sfx/button_click.mp3'
        };
        
        const soundPath = soundMap[type] || soundMap['click'];
        audio.src = soundPath;
        audio.volume = 0.5;
        audio.play().catch(err => {
            // Silently fail if audio can't play (user interaction required, etc.)
            console.log(`Audio play failed: ${err.message}`);
        });
    } catch (error) {
        console.log(`Sound error: ${error.message}`);
    }
}

function handleLogout() {
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    currentPet = null;
    showScreen('auth-screen');
}

// Make functions available globally for onclick handlers
window.purchaseItem = purchaseItem;
window.toggleEquip = toggleEquip;

