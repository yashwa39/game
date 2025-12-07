# GitHub OAuth Setup Guide

This game now uses GitHub OAuth for authentication - no passwords needed!

## Step 1: Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in the form:
   - **Application name**: Elemental Familiar (or any name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret**

## Step 2: Update .env File

Add these to your `.env` file:

```env
GITHUB_CLIENT_ID=your_client_id_here
GITHUB_CLIENT_SECRET=your_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback
SESSION_SECRET=your_random_session_secret_here
```

## Step 3: Update Database Schema

If you have an existing database, run the migration:

```bash
mysql -u root -p < database/migrate_to_github.sql
```

Or if starting fresh, the schema already includes GitHub support.

## Step 4: For Production

When deploying to production:

1. Update GitHub OAuth App settings:
   - **Homepage URL**: Your production URL (e.g., `https://yourdomain.com`)
   - **Authorization callback URL**: `https://yourdomain.com/auth/github/callback`

2. Update `.env`:
   ```env
   GITHUB_CALLBACK_URL=https://yourdomain.com/auth/github/callback
   FRONTEND_URL=https://yourdomain.com
   NODE_ENV=production
   ```

## How It Works

1. User clicks "Sign in with GitHub"
2. Redirects to GitHub for authorization
3. GitHub redirects back with user info
4. Server creates/updates user account automatically
5. User is logged in and can play immediately!

## Security Notes

- Never commit `.env` file to git
- Use strong `SESSION_SECRET` in production
- GitHub Client Secret should be kept private
- HTTPS is required for production OAuth

## Troubleshooting

**"Invalid redirect URI" error:**
- Make sure callback URL in GitHub matches exactly what's in `.env`

**"Authentication required" error:**
- Check that GitHub OAuth credentials are correct in `.env`
- Verify database has been migrated/updated

**Session not persisting:**
- Check `SESSION_SECRET` is set
- In production, ensure cookies work (HTTPS, same domain)

