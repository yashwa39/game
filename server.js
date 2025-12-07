require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'elemental_familiar',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// JWT Authentication Middleware
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

// ==================== AUTHENTICATION ROUTES ====================

// Register new user
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        // Check if user already exists
        const [existingUsers] = await pool.execute(
            'SELECT user_id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const [result] = await pool.execute(
            'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
            [username, email, passwordHash]
        );

        const userId = result.insertId;

        // Generate JWT token
        const token = jwt.sign(
            { userId, username },
            process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { userId, username, email }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user
        const [users] = await pool.execute(
            'SELECT user_id, username, email, password_hash FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.user_id, username: user.username },
            process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: { userId: user.user_id, username: user.username, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== PET ROUTES ====================

// Get user's pet
app.get('/api/pet', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;

        // Get pet with decay applied
        const [pets] = await pool.execute(
            `SELECT p.*, s.name as species_name, s.element, s.sprite_path 
             FROM pets p 
             JOIN species s ON p.species_id = s.species_id 
             WHERE p.user_id = ?`,
            [userId]
        );

        if (pets.length === 0) {
            return res.status(404).json({ error: 'No pet found. Please adopt one first.' });
        }

        let pet = pets[0];

        // Apply decay logic
        pet = await applyDecay(pet);

        res.json({ pet });
    } catch (error) {
        console.error('Get pet error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Adopt/create a new pet
app.post('/api/pet/adopt', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { name, speciesId } = req.body;

        if (!name || !speciesId) {
            return res.status(400).json({ error: 'Pet name and species ID are required' });
        }

        // Check if user already has a pet
        const [existingPets] = await pool.execute(
            'SELECT pet_id FROM pets WHERE user_id = ?',
            [userId]
        );

        if (existingPets.length > 0) {
            return res.status(400).json({ error: 'You already have a pet' });
        }

        // Verify species exists
        const [species] = await pool.execute(
            'SELECT species_id FROM species WHERE species_id = ?',
            [speciesId]
        );

        if (species.length === 0) {
            return res.status(400).json({ error: 'Invalid species ID' });
        }

        // Create pet
        const [result] = await pool.execute(
            `INSERT INTO pets (user_id, name, species_id, energy_stat, tension_stat, maintenance_stat, last_action_timestamp) 
             VALUES (?, ?, ?, 100, 100, 100, NOW())`,
            [userId, name, speciesId]
        );

        const petId = result.insertId;

        // Get created pet with species info
        const [pets] = await pool.execute(
            `SELECT p.*, s.name as species_name, s.element, s.sprite_path 
             FROM pets p 
             JOIN species s ON p.species_id = s.species_id 
             WHERE p.pet_id = ?`,
            [petId]
        );

        res.status(201).json({
            message: 'Pet adopted successfully',
            pet: pets[0]
        });
    } catch (error) {
        console.error('Adopt pet error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get available species
app.get('/api/species', async (req, res) => {
    try {
        const [species] = await pool.execute('SELECT * FROM species');
        res.json({ species });
    } catch (error) {
        console.error('Get species error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== CARE ACTIONS ====================

// Feed pet (increases energy)
app.post('/api/pet/feed', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const statIncrease = 40;

        // Get pet
        const [pets] = await pool.execute(
            'SELECT * FROM pets WHERE user_id = ?',
            [userId]
        );

        if (pets.length === 0) {
            return res.status(404).json({ error: 'No pet found' });
        }

        let pet = pets[0];
        pet = await applyDecay(pet);

        // Increase energy
        const newEnergy = Math.min(100, pet.energy_stat + statIncrease);

        // Update pet
        await pool.execute(
            'UPDATE pets SET energy_stat = ?, last_action_timestamp = NOW() WHERE pet_id = ?',
            [newEnergy, pet.pet_id]
        );

        res.json({
            message: 'Pet fed successfully',
            energy: newEnergy,
            statIncrease
        });
    } catch (error) {
        console.error('Feed pet error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Maintain pet (increases maintenance)
app.post('/api/pet/maintain', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const statIncrease = 40;

        const [pets] = await pool.execute(
            'SELECT * FROM pets WHERE user_id = ?',
            [userId]
        );

        if (pets.length === 0) {
            return res.status(404).json({ error: 'No pet found' });
        }

        let pet = pets[0];
        pet = await applyDecay(pet);

        const newMaintenance = Math.min(100, pet.maintenance_stat + statIncrease);

        await pool.execute(
            'UPDATE pets SET maintenance_stat = ?, last_action_timestamp = NOW() WHERE pet_id = ?',
            [newMaintenance, pet.pet_id]
        );

        res.json({
            message: 'Pet maintained successfully',
            maintenance: newMaintenance,
            statIncrease
        });
    } catch (error) {
        console.error('Maintain pet error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Play with pet (increases tension/mood)
app.post('/api/pet/play', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const statIncrease = 40;

        const [pets] = await pool.execute(
            'SELECT * FROM pets WHERE user_id = ?',
            [userId]
        );

        if (pets.length === 0) {
            return res.status(404).json({ error: 'No pet found' });
        }

        let pet = pets[0];
        pet = await applyDecay(pet);

        const newTension = Math.min(100, pet.tension_stat + statIncrease);

        await pool.execute(
            'UPDATE pets SET tension_stat = ?, last_action_timestamp = NOW() WHERE pet_id = ?',
            [newTension, pet.pet_id]
        );

        res.json({
            message: 'Played with pet successfully',
            tension: newTension,
            statIncrease
        });
    } catch (error) {
        console.error('Play pet error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// ==================== DECAY LOGIC ====================

async function applyDecay(pet) {
    const now = new Date();
    const lastAction = new Date(pet.last_action_timestamp);
    const hoursElapsed = (now - lastAction) / (1000 * 60 * 60);

    if (hoursElapsed <= 0) {
        return pet;
    }

    // Decay rates: 10 points per hour for each stat
    const decayRate = 10;
    const decayAmount = Math.floor(hoursElapsed * decayRate);

    let newEnergy = Math.max(0, pet.energy_stat - decayAmount);
    let newTension = Math.max(0, pet.tension_stat - decayAmount);
    let newMaintenance = Math.max(0, pet.maintenance_stat - decayAmount);

    // Update in database if there's actual decay
    if (decayAmount > 0) {
        await pool.execute(
            `UPDATE pets 
             SET energy_stat = ?, tension_stat = ?, maintenance_stat = ? 
             WHERE pet_id = ?`,
            [newEnergy, newTension, newMaintenance, pet.pet_id]
        );
    }

    return {
        ...pet,
        energy_stat: newEnergy,
        tension_stat: newTension,
        maintenance_stat: newMaintenance
    };
}

// ==================== SHOP & INVENTORY ROUTES ====================

// Get shop items
app.get('/api/shop', async (req, res) => {
    try {
        const [items] = await pool.execute('SELECT * FROM items ORDER BY price');
        res.json({ items });
    } catch (error) {
        console.error('Get shop error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user inventory
app.get('/api/inventory', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;

        const [inventory] = await pool.execute(
            `SELECT i.*, inv.quantity, inv.equipped, inv.inventory_id 
             FROM inventory inv 
             JOIN items i ON inv.item_id = i.item_id 
             WHERE inv.user_id = ?`,
            [userId]
        );

        res.json({ inventory });
    } catch (error) {
        console.error('Get inventory error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Purchase item
app.post('/api/shop/purchase', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId } = req.body;

        if (!itemId) {
            return res.status(400).json({ error: 'Item ID is required' });
        }

        // Get item details
        const [items] = await pool.execute('SELECT * FROM items WHERE item_id = ?', [itemId]);
        if (items.length === 0) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const item = items[0];

        // Get user's current gears
        const [users] = await pool.execute('SELECT gears FROM users WHERE user_id = ?', [userId]);
        const userGears = users[0].gears;

        if (userGears < item.price) {
            return res.status(400).json({ error: 'Insufficient gears' });
        }

        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Deduct gears
            await connection.execute(
                'UPDATE users SET gears = gears - ? WHERE user_id = ?',
                [item.price, userId]
            );

            // Add to inventory (or increment quantity if exists)
            const [existing] = await connection.execute(
                'SELECT inventory_id, quantity FROM inventory WHERE user_id = ? AND item_id = ?',
                [userId, itemId]
            );

            if (existing.length > 0) {
                await connection.execute(
                    'UPDATE inventory SET quantity = quantity + 1 WHERE inventory_id = ?',
                    [existing[0].inventory_id]
                );
            } else {
                await connection.execute(
                    'INSERT INTO inventory (user_id, item_id, quantity) VALUES (?, ?, 1)',
                    [userId, itemId]
                );
            }

            await connection.commit();

            res.json({
                message: 'Item purchased successfully',
                remainingGears: userGears - item.price
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        console.error('Purchase error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Equip/Unequip item
app.post('/api/inventory/equip', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;
        const { inventoryId, equipped } = req.body;

        if (inventoryId === undefined || equipped === undefined) {
            return res.status(400).json({ error: 'Inventory ID and equipped status are required' });
        }

        // Verify inventory belongs to user
        const [inventory] = await pool.execute(
            'SELECT * FROM inventory WHERE inventory_id = ? AND user_id = ?',
            [inventoryId, userId]
        );

        if (inventory.length === 0) {
            return res.status(404).json({ error: 'Item not found in inventory' });
        }

        // If equipping, unequip other items of the same type
        if (equipped) {
            const [item] = await pool.execute(
                'SELECT item_type FROM items WHERE item_id = ?',
                [inventory[0].item_id]
            );

            if (item.length > 0) {
                // Unequip other cosmetic items (or same type)
                await pool.execute(
                    `UPDATE inventory inv 
                     JOIN items i ON inv.item_id = i.item_id 
                     SET inv.equipped = FALSE 
                     WHERE inv.user_id = ? AND i.item_type = ? AND inv.inventory_id != ?`,
                    [userId, item[0].item_type, inventoryId]
                );
            }
        }

        // Update equipped status
        await pool.execute(
            'UPDATE inventory SET equipped = ? WHERE inventory_id = ?',
            [equipped, inventoryId]
        );

        res.json({
            message: equipped ? 'Item equipped' : 'Item unequipped',
            equipped
        });
    } catch (error) {
        console.error('Equip error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get user info (gears, etc.)
app.get('/api/user', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;

        const [users] = await pool.execute(
            'SELECT user_id, username, email, gears, created_at FROM users WHERE user_id = ?',
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: users[0] });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Elemental Familiar server running on http://localhost:${PORT}`);
    console.log(`Make sure your database is set up and .env file is configured!`);
});

