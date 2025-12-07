# 🚀 Quick Start Guide

## Step 1: Install Dependencies ✅
```bash
npm install
```
**Status**: ✅ Already done!

## Step 2: Configure Database

### Option A: Using MySQL (Recommended)

1. **Update `.env` file** with your MySQL credentials:
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=elemental_familiar
   JWT_SECRET=your_super_secret_jwt_key_change_this
   PORT=3000
   ```

2. **Create the database**:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   Or manually:
   ```bash
   mysql -u root -p
   ```
   Then in MySQL:
   ```sql
   source database/schema.sql;
   ```

### Option B: Using SQLite (Alternative - requires code changes)

If you don't have MySQL, you can modify the code to use SQLite, but the current setup uses MySQL.

## Step 3: Start the Server

```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## Step 4: Open in Browser

Navigate to: **http://localhost:3000**

## 🎮 First Time Setup

1. **Register** a new account
2. **Adopt** your first familiar (choose name and element)
3. **Start caring** for your pet!

## ⚠️ Troubleshooting

### Database Connection Error?
- Make sure MySQL is running: `mysql.server start` (Mac) or check MySQL service (Windows/Linux)
- Verify credentials in `.env` file
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Already in Use?
- Change `PORT` in `.env` file
- Or kill the process using port 3000

### Assets Not Loading?
- Clear browser cache (Cmd+Shift+R / Ctrl+Shift+R)
- Check browser console for 404 errors
- Verify files exist in `public/assets/`

## 📝 Next Steps

- Replace placeholder assets with real ones (see `QUICK_START_ASSETS.md`)
- Customize game mechanics
- Add more features!

