# Quick Deployment Steps - Follow These Now! 🚀

Your code is ready! Follow these steps to deploy:

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Name it: `roopsnap` (or any name you like)
4. Make it **Public** (or Private - both work)
5. **Don't** check "Initialize with README"
6. Click **"Create repository"**

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these:

```powershell
cd "C:\Users\chait\OneDrive\Desktop\RoopSnap"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/roopsnap.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

## Step 3: Deploy on Railway (Easiest Option)

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** → Sign in with **GitHub**
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose your `roopsnap` repository
6. Railway will automatically:
   - Detect Node.js
   - Install dependencies (`npm install`)
   - Start your server
7. Wait 2-3 minutes for deployment
8. Click on your project → **"Settings"** → **"Generate Domain"**
9. Your site is live! 🎉

## Step 4: Set Admin Key (Recommended)

1. In Railway, go to your project → **"Variables"** tab
2. Click **"New Variable"**
3. Add:
   - **Name**: `ADMIN_API_KEY`
   - **Value**: `your-secret-key-here` (choose a strong password)
4. Click **"Add"**
5. Railway will automatically redeploy

## Your Website URLs

- **Main Website**: `https://your-app-name.railway.app`
- **Admin Panel**: `https://your-app-name.railway.app/admin.html`

## Alternative: Deploy on Render

If Railway doesn't work, try Render:

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New"** → **"Web Service"**
4. Connect your GitHub repository
5. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Click **"Create Web Service"**
7. Your site will be live in a few minutes!

## Need Help?

- Check `DEPLOYMENT_FULLSTACK.md` for detailed instructions
- Check `DEPLOY_NOW.md` for step-by-step guide
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs

---

**You're all set! Your photography website will be live soon! 🎉**

