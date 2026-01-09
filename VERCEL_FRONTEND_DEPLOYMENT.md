# Vercel Deployment Guide - Frontend Only

This guide will walk you through deploying the HICA frontend to Vercel.

## 🎯 Key Feature: Works Without Backend!

**Your frontend is designed to work independently!** When deployed to Vercel:
- ✅ All pages work perfectly without a backend
- ✅ Uses fallback data automatically when backend is unavailable
- ✅ Same experience as running locally without backend
- ✅ You can add a backend later without changing anything

This means you can deploy immediately and add your backend connection later!

## Prerequisites

- A GitHub account
- Your HICA project pushed to a GitHub repository
- A Vercel account (free tier is sufficient)
- **No backend required!** The frontend works independently with fallback data

---

## Step 1: Prepare Your Repository

### 1.1 Ensure Your Code is Pushed to GitHub

1. Open your terminal in the project root directory
2. Check if you have a Git repository:
   ```bash
   git status
   ```
3. If not initialized, initialize Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
4. Create a repository on GitHub (if you haven't already)
5. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Create a Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"** in the top right
3. Choose **"Continue with GitHub"** (recommended for easier integration)
4. Authorize Vercel to access your GitHub account

---

## Step 3: Deploy from GitHub

### 3.1 Add New Project

1. Once logged into Vercel, click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Select your HICA repository
4. Click **"Import"**

### 3.2 Configure Project Settings

Vercel should auto-detect Vite, but verify these settings:

**Framework Preset:**
- **Framework Preset:** `Vite` (should be auto-detected)

**Root Directory:**
- Click **"Edit"** next to Root Directory
- Set to: `frontend`

**Build and Output Settings:**
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### 3.3 Set Environment Variables (Optional)

**Important:** The frontend is designed to work **without a backend**! It uses fallback data automatically when the backend is unavailable.

**Option 1: Deploy without backend (Recommended for initial deployment)**
- **Don't add any environment variables**
- The site will automatically use fallback data
- All pages will work exactly as they do locally without the backend

**Option 2: Connect to your backend (If you have one deployed)**
1. Expand **"Environment Variables"**
2. Click **"Add"** and add:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://your-backend-url.com` (your actual backend URL)
   - **Environment:** Production, Preview, Development (select all)
3. The site will try to fetch data from your backend, and fall back to static data if the backend is unavailable

### 3.4 Deploy

1. Click **"Deploy"**
2. Vercel will start building your site
3. You'll see build logs in real-time
4. The build typically takes 2-5 minutes
5. Once complete, you'll see **"Ready"** with a URL like `https://your-project-name.vercel.app`

---

## Step 4: Configure React Router (Automatic)

Vercel automatically handles React Router redirects for single-page applications. No additional configuration needed!

However, if you want to be explicit, you can create a `vercel.json` file in your **frontend** directory:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Note:** This is usually not necessary as Vercel handles it automatically for Vite projects.

---

## Step 5: Verify Deployment

1. Visit your Vercel site URL
2. Test all pages:
   - Home page
   - Events page
   - Gallery page
   - Team page
   - About page
3. Test navigation (all routes should work)
4. Check browser console for any errors

---

## Step 6: Update Environment Variables After Backend Deployment (Optional)

**Note:** Your site works perfectly without a backend using fallback data. You only need this step if you want to connect to a live backend.

If you deploy your backend later and want to connect it:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Click **"Add New"**:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://your-backend-url.com` (your actual backend URL)
   - **Environment:** Production, Preview, Development (select all)
4. Click **"Save"**
5. Go to **Deployments** tab → Find your latest deployment → Click **"..."** → **"Redeploy"**

**How it works:**
- The frontend will try to fetch data from your backend
- If the backend is available, it uses live data
- If the backend is unavailable, it automatically falls back to static data
- This ensures your site always works, even if the backend is down

---

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Ensure all dependencies are in `package.json`
- Check that `node_modules` is in `.gitignore`
- Verify build command is correct

**Error: "TypeScript errors"**
- Fix TypeScript errors locally first
- Run `npm run build` locally to test

**Error: "Tailwind CSS not working"**
- Ensure `tailwind.config.js` and `postcss.config.js` exist
- Check that `@tailwind` directives are in `index.css`

### Site Shows 404 on Routes

- Vercel should handle this automatically
- If issues persist, create `vercel.json` with the rewrite rule (see Step 4)

### API Calls Failing

**This is normal and expected!** The frontend is designed to work without a backend:
- If you haven't set `VITE_API_BASE_URL`, the site uses fallback data automatically
- If your backend is down, the site automatically uses fallback data
- All pages will work perfectly with fallback data

**If you want to connect to a backend:**
- Verify `VITE_API_BASE_URL` environment variable is set correctly
- Check browser console for CORS errors
- Ensure backend allows requests from your Vercel domain (add Vercel URL to CORS whitelist)

### Images Not Loading

- Verify Cloudinary URLs are correct
- Check that image URLs are absolute (start with `https://`)
- Ensure images are publicly accessible

---

## Continuous Deployment

Vercel automatically deploys when you push to your main branch:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```
3. Vercel will automatically detect the push and start a new deployment
4. You'll receive an email when deployment completes

---

## Vercel Features You Can Use

### Preview Deployments
- Every pull request gets a preview URL
- Test changes before merging to main

### Branch Deploys
- Deploy specific branches for testing
- Configure in **Settings** → **Git**

### Analytics
- Enable Vercel Analytics (free tier available)
- Track site visitors and performance

### Edge Functions
- Deploy serverless functions at the edge
- Useful for API routes or middleware

---

## Quick Reference

**Build Settings:**
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`
- Framework: `Vite` (auto-detected)

**Environment Variables:**
- `VITE_API_BASE_URL`: Your backend API URL (optional)

**Site URL Format:**
- `https://your-project-name.vercel.app`
- Or your custom domain

---

## Comparison: Vercel vs Netlify vs Render

| Feature | Vercel | Netlify | Render |
|---------|--------|---------|--------|
| **Auto-detection** | ✅ Excellent | ✅ Good | ⚠️ Manual config |
| **React Router** | ✅ Automatic | ✅ Needs config | ⚠️ Needs config |
| **Build Speed** | ⚡ Very Fast | ⚡ Fast | 🐢 Slower |
| **Free Tier** | ✅ Generous | ✅ Good | ⚠️ Limited |
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Works Without Backend** | ✅ Yes | ✅ Yes | ✅ Yes |

**Recommendation:** Vercel is the easiest for frontend-only deployments with excellent auto-detection and React Router support.

---

## Next Steps

1. ✅ Deploy frontend to Vercel
2. 🔄 Deploy backend to Render/Vercel (if needed)
3. 🔗 Update `VITE_API_BASE_URL` in Vercel with backend URL (optional)
4. 🎨 Test all features on production
5. 📝 Share your site URL!

---

## Support

If you encounter issues:
- Check Vercel build logs for detailed error messages
- Review [Vercel Documentation](https://vercel.com/docs)
- Check [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)

---

**Congratulations!** Your HICA frontend is now live on Vercel! 🚀
