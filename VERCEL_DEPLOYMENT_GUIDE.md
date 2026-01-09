# HICA Project - Vercel Deployment Guide

This guide will walk you through deploying the HICA project to Vercel.

## Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com) (free tier available)
3. **MongoDB Atlas Account** - For database (already set up)
4. **Cloudinary Account** - For image storage (already set up)

---

## Quick Start: Full-Stack on Vercel

**✅ Ready to deploy!** All files are configured for full-stack Vercel deployment.

### Quick Deploy Steps:

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Configure for Vercel deployment"
   git push
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure:
     - Root Directory: `.` (root)
     - Framework: Other
   - Add environment variables (see Step 3.3 below)
   - Click "Deploy"

3. **Set Environment Variables** (see detailed list in Step 3.3)

4. **Seed Database** (see Post-Deployment section)

---

## Deployment Strategy

You have two options:

### Option 1: Frontend on Vercel + Backend on Render (Recommended)
- **Frontend**: Deploy to Vercel (perfect for React/Vite)
- **Backend**: Keep on Render (better for Express/MongoDB long-running connections)

### Option 2: Both Frontend and Backend on Vercel ✅ (Already Configured)
- **Frontend**: Deploy to Vercel
- **Backend**: Converted to Vercel serverless functions
- **Status**: All files are ready!

**Jump to Option 2 below for full-stack deployment.**

---

## Option 1: Frontend on Vercel + Backend on Render

### Step 1: Deploy Backend to Render (If Not Already Done)

Follow the `DEPLOYMENT_GUIDE.md` to deploy your backend to Render first. You'll need:
- Backend URL (e.g., `https://hica-backend.onrender.com`)

### Step 2: Prepare Frontend for Vercel

#### 2.1 Create Vercel Configuration

Create `vercel.json` in the **root** of your project:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "devCommand": "cd frontend && npm run dev",
  "installCommand": "cd frontend && npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 2.2 Update Frontend Build Configuration

Ensure your `frontend/vite.config.ts` is configured correctly:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
```

### Step 3: Deploy Frontend to Vercel

#### 3.1 Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the repository containing your HICA project

#### 3.2 Configure Project Settings

1. **Framework Preset**: Select **"Vite"** (or "Other")
2. **Root Directory**: Click **"Edit"** and set to `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `dist`
5. **Install Command**: `npm install`

#### 3.3 Set Environment Variables

Click **"Environment Variables"** and add:

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

**Important**: Replace `your-backend-url.onrender.com` with your actual Render backend URL.

#### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (2-3 minutes)
3. Your frontend will be live at `https://your-project.vercel.app`

### Step 4: Update CORS on Backend

Make sure your Render backend allows requests from your Vercel domain:

1. Go to Render backend dashboard
2. Update environment variable `FRONTEND_ORIGINS`:
   ```
   https://your-project.vercel.app,https://your-project-git-main-yourusername.vercel.app
   ```
3. Redeploy backend

---

## Option 2: Both Frontend and Backend on Vercel

**✅ Files are already created!** The following files have been set up:
- `api/index.js` - Main serverless function handler
- `api/package.json` - API dependencies
- `vercel.json` - Updated configuration
- `frontend/src/services/api.ts` - Updated to use `/api` in production

### Step 1: Verify Setup

Your project structure should now be:

```
HICA/
├── api/
│   ├── index.js          (Main serverless function) ✅
│   └── package.json       (API dependencies) ✅
├── backend/              (Original backend - used by API)
├── frontend/
└── vercel.json           (Updated configuration) ✅
```

### Step 2: Review the API Handler

The `api/index.js` file:

The API handler includes:
- Express app setup with CORS
- MongoDB connection caching (critical for serverless)
- Cloudinary initialization
- All backend routes
- Error handling

#### 2.1 Verify vercel.json

The root `vercel.json` is configured as:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

### Step 3: Deploy to Vercel

#### 3.1 Connect GitHub Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the repository containing your HICA project

#### 3.2 Configure Project Settings

1. **Framework Preset**: Select **"Other"** (not Vite, since we're using custom builds)
2. **Root Directory**: Leave as root (`.`)
3. **Build Command**: `cd frontend && npm install && npm run build`
4. **Output Directory**: `frontend/dist`
5. **Install Command**: `cd frontend && npm install && cd ../backend && npm install`

**Note**: Vercel will automatically detect the `vercel.json` configuration, but you can verify these settings.

#### 3.3 Set Environment Variables

Go to Vercel project settings → **Environment Variables** and add:

```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ADMIN_EMAIL=your-admin-email
ADMIN_PASSWORD=your-admin-password
FRONTEND_ORIGINS=https://your-project.vercel.app,https://your-project-git-main-yourusername.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Important Notes:**
- **Do NOT set `VITE_API_BASE_URL`** - The frontend is configured to use `/api` automatically in production
- **FRONTEND_ORIGINS**: Add your Vercel domain(s) - you can add preview URLs later
- Replace all `your-*` placeholders with actual values

#### 3.4 Deploy

1. Click **"Deploy"**
2. Wait for build to complete (3-5 minutes for first deployment)
3. Your full-stack app will be live at `https://your-project.vercel.app`
4. API will be available at `https://your-project.vercel.app/api`

---

## Post-Deployment Steps

### 1. Seed Database

Since the backend is now serverless, you have a few options:

**Option A: Use Vercel CLI (Recommended)**

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login and link project:
   ```bash
   vercel login
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

4. Run seed scripts locally (they'll use the production database):
   ```bash
   cd backend
   node seed_admin.js
   node seed_events.js
   node seed_team.js
   ```

**Option B: Create a Seed API Endpoint (Temporary)**

You can temporarily add a seed endpoint in `api/index.js` for one-time seeding, then remove it after use.

**Option C: Use MongoDB Atlas UI**

Manually add initial data through MongoDB Atlas dashboard.

### 2. Test Your Deployment

1. Visit your Vercel frontend URL
2. Test navigation and pages
3. Test admin login
4. Test image uploads
5. Check browser console for errors

### 3. Set Up Custom Domain (Optional)

1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Troubleshooting

### Frontend Build Fails

- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript errors are fixed
- Check `vite.config.ts` is correct

### API Calls Fail (CORS Errors)

- Verify `FRONTEND_ORIGINS` includes your Vercel domain
- Check backend CORS configuration
- Ensure `VITE_API_BASE_URL` is set correctly

### MongoDB Connection Issues

- Verify `MONGODB_URI` is correct in environment variables
- Check MongoDB Atlas IP whitelist includes Vercel IPs (or use `0.0.0.0/0`)
- Ensure MongoDB cluster is running

### Images Not Uploading

- Verify Cloudinary credentials in environment variables
- Check Cloudinary dashboard for upload logs
- Ensure `CLOUDINARY_*` variables are set correctly

---

## Recommended Approach

**We recommend Option 1** (Frontend on Vercel + Backend on Render) because:

1. ✅ Vercel excels at frontend hosting (fast CDN, automatic deployments)
2. ✅ Render is better for Express backends with MongoDB (persistent connections)
3. ✅ Easier to maintain (no code conversion needed)
4. ✅ Better performance for database connections
5. ✅ Simpler debugging and logging

---

## Quick Reference

### Vercel CLI (Optional)

Install Vercel CLI for local testing:

```bash
npm i -g vercel
vercel login
vercel dev
```

### Environment Variables Checklist

**Frontend (Vercel):**
- `VITE_API_BASE_URL`

**Backend (Render or Vercel):**
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `FRONTEND_ORIGINS`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
- [Render Documentation](https://render.com/docs)
