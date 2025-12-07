-- Migration script to update existing database for GitHub OAuth
-- Run this if you already have a database with the old schema

USE elemental_familiar;

-- Add GitHub OAuth columns to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS github_id VARCHAR(50) UNIQUE AFTER user_id,
ADD COLUMN IF NOT EXISTS avatar_url VARCHAR(255) AFTER email;

-- Make password_hash optional (nullable) for GitHub users
ALTER TABLE users 
MODIFY COLUMN password_hash VARCHAR(255) NULL;

-- Add index for GitHub ID
CREATE INDEX IF NOT EXISTS idx_github_id ON users(github_id);

-- Note: Existing users will need to log in with GitHub to get a github_id
-- You may want to migrate existing users or start fresh

