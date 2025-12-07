# Elemental Familiar - The Clockwork Pet

A casual web-based pet simulation game where users care for a clockwork familiar whose stats decay over time.

## Features

- **User Authentication**: Secure registration and login system
- **Pet Adoption**: Choose your familiar's name and element (Fire, Water, Earth, Air)
- **Care System**: Feed, maintain, and play with your pet to keep its stats high
- **Decay Mechanics**: Pet stats decrease over time, requiring regular care
- **Shop System**: Purchase cosmetic items and toys using in-game currency (Gears)
- **Inventory**: Manage and equip purchased items

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: MySQL
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Authentication**: JWT (JSON Web Tokens)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd pet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Create a MySQL database (or use the provided schema)
   - Update your `.env` file with database credentials:
   ```bash
   cp .env.example .env
   ```
   - Edit `.env` and add your database credentials:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=elemental_familiar
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   PORT=3000
   ```

4. **Initialize the database**
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   Or import the schema using your MySQL client.

5. **Start the server**
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
pet/
├── database/
│   └── schema.sql          # Database schema and initial data
├── public/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Styling
│   └── app.js              # Frontend JavaScript
├── server.js               # Express server and API routes
├── package.json            # Dependencies and scripts
├── .env.example           # Environment variables template
└── README.md              # This file
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Pet Management
- `GET /api/pet` - Get user's pet (with decay applied)
- `POST /api/pet/adopt` - Adopt a new pet
- `GET /api/species` - Get available pet species

### Care Actions
- `POST /api/pet/feed` - Feed pet (increases energy)
- `POST /api/pet/maintain` - Maintain pet (increases maintenance)
- `POST /api/pet/play` - Play with pet (increases tension/mood)

### Shop & Inventory
- `GET /api/shop` - Get shop items
- `POST /api/shop/purchase` - Purchase an item
- `GET /api/inventory` - Get user's inventory
- `POST /api/inventory/equip` - Equip/unequip an item

### User
- `GET /api/user` - Get user information

## Database Schema

### Tables
- **users**: User accounts and currency
- **species**: Pet species/elements
- **pets**: User pets with stats
- **items**: Shop items
- **inventory**: User-owned items

## Decay Logic

Pet stats decay at a rate of **10 points per hour** for each stat:
- Energy
- Tension (Mood)
- Maintenance (Health)

Stats are automatically recalculated when:
- The pet data is fetched
- A care action is performed

## Future Enhancements

- Add actual sprite images for pets
- Implement sound effects and background music
- Add more pet species and evolution paths
- Create daily quests or challenges
- Add social features (visit friends' pets)
- Implement rare variant collection system

## License

This project is open source. Make sure to verify licenses for any assets you add.

## Assets

### Current Status
✅ **Created**: SVG placeholder assets for all required graphics:
- Pet sprites (4 elements × 3 states = 12 sprites)
- UI icons (food, tool, toy, battery, currency, etc.)
- Shop items (golden gear, crystal ball, mechanical flower, etc.)
- Backgrounds (habitat and shop)

⚠️ **Needed**: Audio files (music and sound effects)
- See `ASSETS_README.md` for detailed asset information
- Placeholder SVG files are functional but should be replaced with professional assets

### Replacing Assets
1. **Pet Sprites**: Replace files in `public/assets/pets/` (maintain naming: `{element}_{state}.png`)
2. **Icons**: Replace files in `public/assets/icons/` 
3. **Items**: Replace files in `public/assets/items/`
4. **Backgrounds**: Replace files in `public/assets/backgrounds/`
5. **Audio**: Add MP3/WAV files to `public/assets/audio/music/` and `public/assets/audio/sfx/`

See `ASSETS_README.md` for recommended sources and licensing information.

## Notes

- The current implementation uses SVG placeholder assets that are functional for development.
- Replace placeholder assets with professional sprites/images from free asset sources (see `ASSETS_README.md`).
- Sound effects need to be added - the code is ready to use them when available.
- The decay system runs on-demand when pet data is fetched. For production, consider implementing a background job for more accurate decay.

