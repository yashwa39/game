-- Elemental Familiar Database Schema
-- Run this script to create the database and tables

CREATE DATABASE IF NOT EXISTS elemental_familiar;
USE elemental_familiar;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    gears INT DEFAULT 50,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Species/Elements Table (for different pet types)
CREATE TABLE IF NOT EXISTS species (
    species_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    element VARCHAR(50) NOT NULL,
    sprite_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default species
INSERT INTO species (name, element, sprite_path) VALUES
('Fire Familiar', 'fire', '/assets/pets/fire.png'),
('Water Familiar', 'water', '/assets/pets/water.png'),
('Earth Familiar', 'earth', '/assets/pets/earth.png'),
('Air Familiar', 'air', '/assets/pets/air.png');

-- Pets Table
CREATE TABLE IF NOT EXISTS pets (
    pet_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    species_id INT NOT NULL,
    energy_stat INT DEFAULT 100 CHECK (energy_stat >= 0 AND energy_stat <= 100),
    tension_stat INT DEFAULT 100 CHECK (tension_stat >= 0 AND tension_stat <= 100),
    maintenance_stat INT DEFAULT 100 CHECK (maintenance_stat >= 0 AND maintenance_stat <= 100),
    last_action_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (species_id) REFERENCES species(species_id),
    INDEX idx_user_id (user_id),
    INDEX idx_last_action (last_action_timestamp)
);

-- Items Table (Shop items)
CREATE TABLE IF NOT EXISTS items (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    item_type ENUM('cosmetic', 'food', 'toy', 'tool') DEFAULT 'cosmetic',
    price INT NOT NULL,
    icon_path VARCHAR(255),
    sprite_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default shop items
INSERT INTO items (name, description, item_type, price, icon_path, sprite_path) VALUES
('Golden Gear', 'A shiny golden gear decoration', 'cosmetic', 25, '/assets/icons/golden_gear.png', '/assets/items/golden_gear.png'),
('Crystal Ball', 'A mystical crystal ball', 'cosmetic', 50, '/assets/icons/crystal_ball.png', '/assets/items/crystal_ball.png'),
('Mechanical Flower', 'A beautiful mechanical flower', 'cosmetic', 30, '/assets/icons/mechanical_flower.png', '/assets/items/mechanical_flower.png'),
('Clockwork Toy', 'A fun toy for your familiar', 'toy', 20, '/assets/icons/toy.png', '/assets/items/toy.png'),
('Premium Food', 'Delicious food that restores more energy', 'food', 15, '/assets/icons/food.png', '/assets/items/food.png');

-- Inventory Table (User-owned items)
CREATE TABLE IF NOT EXISTS inventory (
    inventory_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 1,
    equipped BOOLEAN DEFAULT FALSE,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(item_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_item (user_id, item_id),
    INDEX idx_user_id (user_id),
    INDEX idx_equipped (user_id, equipped)
);

