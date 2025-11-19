# Quick Deployment Guide - RoopSnap

Follow these steps to deploy your website:

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Name it: `roopsnap` (or any name you like)
4. Make it **Public** (or Private - both work)
5. **Don't** check "Initialize with README"
6. Click **"Create repository"**

## Step 2: Upload Your Code to GitHub

### Option A: Using GitHub Desktop (Easiest)

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and sign in
3. Click **"File"** → **"Add Local Repository"**
4. Browse to: `C:\Users\chait\OneDrive\Desktop\Chaya Captures`
5. Click **"Publish repository"**
6. Your code is now on GitHub!

### Option B: Using Command Line

Open PowerShell in your project folder and run:

```powershell
cd "C:\Users\chait\OneDrive\Desktop\Chaya Captures"
git init
git add .
   git commit -m "Initial commit - RoopSnap website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chaya-captures.git
git push -u origin main
```

(Replace `YOUR_USERNAME` with your GitHub username)

## Step 3: Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** → Sign in with **GitHub**
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `roopsnap` repository
6. Railway will automatically:
   - Detect Node.js
   - Install dependencies
   - Start your server
7. Wait 2-3 minutes for deployment
8. Click on your project → **"Settings"** → **"Generate Domain"**
9. Your site is live! 🎉

## Step 4: Set Admin Key (Optional but Recommended)

1. In Railway, go to your project → **"Variables"**
2. Click **"New Variable"**
3. Add:
   - **Name**: `ADMIN_API_KEY`
   - **Value**: `your-secret-key-here` (choose a strong password)
4. Click **"Add"**
5. Railway will automatically redeploy

## Your Website URLs

- **Main Website**: `https://your-app-name.railway.app`
- **Admin Panel**: `https://your-app-name.railway.app/admin.html`

## Important Notes

✅ **Database**: SQLite file will be created automatically on Railway  
✅ **Uploads**: Photos will be stored on Railway's server  
✅ **HTTPS**: Automatically enabled (free SSL)  
✅ **Custom Domain**: You can add your own domain later in Settings

## Troubleshooting

**Build fails?**
- Make sure `package.json` is in the root folder
- Check Railway logs for errors

**Photos not uploading?**
- Wait a few minutes after first deployment
- Check Railway logs

**Admin panel not working?**
- Make sure you set `ADMIN_API_KEY` environment variable
- Default key is `chaya-admin` if not set

---

**Need help?** Check `DEPLOYMENT_FULLSTACK.md` for more details.

