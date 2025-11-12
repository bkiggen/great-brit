# Railway Deployment Guide - Great Brit

This guide will help you deploy the Great Brit backend to Railway with automatic CI/CD from the `main` branch.

## Prerequisites

- Railway account ([railway.app](https://railway.app))
- GitHub repository with `main` branch
- Railway CLI (optional): `npm i -g @railway/cli`

## Step 1: Push Code to GitHub

Make sure your latest changes are committed and pushed:

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

## Step 2: Create Railway Project

### Option A: Using Railway Dashboard (Recommended)

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your **great-brit** repository
5. Railway will detect the Node.js project automatically

### Option B: Using Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Initialize project
railway init

# Link to GitHub repo
railway link
```

## Step 3: Add PostgreSQL Database

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a `DATABASE_URL` environment variable
4. The database will be linked to your service automatically

## Step 4: Run Database Migrations

After the database is added, run migrations:

```bash
# Using Railway CLI
railway run npx prisma migrate deploy

# OR connect to the project and run:
railway shell
cd server
npx prisma migrate deploy
exit
```

## Step 5: Configure Environment Variables

Railway auto-detects `DATABASE_URL` from PostgreSQL, but you may want to add:

1. Go to your service → **Variables** tab
2. Add these variables (optional):
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` = Your frontend URL (if different from Railway's)

## Step 6: Configure Automatic Deployments

Railway automatically deploys on every push to `main`:

1. Go to **Settings** tab in your service
2. Under **Deploy Triggers**, verify:
   - ✅ **Branch**: `main`
   - ✅ **Auto Deploy**: Enabled
3. Railway will now deploy automatically on every commit to `main`

## Step 7: Update Frontend API URL

Once deployed, update your frontend to use the Railway backend URL:

1. Get your Railway backend URL from the **Deployments** tab
2. Update `client/src/helpers/makeRequest.js`:
   ```javascript
   const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
   const fullUrl = new URL(`${API_URL}${url}`);
   ```
3. Set `REACT_APP_API_URL` in your frontend deployment

## Step 8: Update CORS Configuration

Update the allowed origins in `server/index.js`:

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "https://your-frontend-url.railway.app", // Update with actual URL
  process.env.FRONTEND_URL,
].filter(Boolean);
```

## Deployment Checklist

- ✅ Code pushed to GitHub `main` branch
- ✅ Railway project created and linked to GitHub
- ✅ PostgreSQL database added
- ✅ Database migrations run (`prisma migrate deploy`)
- ✅ Environment variables configured
- ✅ Automatic deployments enabled
- ✅ CORS origins updated with production URLs
- ✅ Frontend updated with backend API URL

## Monitoring & Logs

- **View Logs**: Railway Dashboard → Your Service → **Logs** tab
- **Metrics**: Dashboard shows CPU, Memory, Network usage
- **Deployments**: See all deployments and their status

## Troubleshooting

### Migration Issues
```bash
# Connect to Railway and check Prisma status
railway shell
cd server
npx prisma migrate status
```

### Database Connection Issues
- Verify `DATABASE_URL` is set correctly
- Check Railway logs for connection errors
- Ensure PostgreSQL service is running

### CORS Errors
- Add your frontend URL to `allowedOrigins` in `server/index.js`
- Set `FRONTEND_URL` environment variable in Railway
- Redeploy the service

### Build Failures
- Check Railway build logs
- Verify `railway.json` configuration
- Ensure all dependencies are in `package.json`

## Rollback

If a deployment fails:

1. Go to **Deployments** tab
2. Find the last working deployment
3. Click **"Redeploy"** on that deployment

## Useful Commands

```bash
# View logs
railway logs

# Open project in browser
railway open

# Run commands in Railway environment
railway run <command>

# SSH into Railway container
railway shell

# Force redeploy
railway up --detach
```

## Next Steps

1. **Set up frontend deployment** (Vercel, Netlify, or Railway)
2. **Configure custom domain** in Railway settings
3. **Set up monitoring** (e.g., Sentry for error tracking)
4. **Enable backups** for PostgreSQL database
5. **Add CI/CD tests** before deployment (optional)

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Create an issue in your repository
