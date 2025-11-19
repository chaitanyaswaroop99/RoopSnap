# Push to GitHub - Quick Steps

Your code is committed and ready to push! Follow these steps:

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in (or create account)
2. Click the **"+"** icon (top right) → **"New repository"**
3. Fill in:
   - **Repository name**: `roopsnap` (or any name you like)
   - **Description**: "Photography portfolio website"
   - **Visibility**: Choose Public or Private
   - **DON'T** check "Initialize with README" (we already have code)
4. Click **"Create repository"**

## Step 2: Add Remote and Push

After creating the repository, GitHub will show you commands. Run these in PowerShell:

```powershell
cd "C:\Users\chait\OneDrive\Desktop\RoopSnap"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/roopsnap.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

For example, if your username is `chaitanya`, it would be:
```powershell
git remote add origin https://github.com/chaitanya/roopsnap.git
```

## Step 3: Enter Credentials

When you push, GitHub will ask for:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)

### How to Create Personal Access Token:

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "RoopSnap")
4. Select scopes: Check **"repo"** (this gives full repository access)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)
7. Use this token as your password when pushing

## Alternative: Use GitHub Desktop (Easier)

If you prefer a visual interface:

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Install and sign in
3. Click **"File"** → **"Add Local Repository"**
4. Browse to: `C:\Users\chait\OneDrive\Desktop\RoopSnap`
5. Click **"Publish repository"**
6. Choose name and visibility
7. Click **"Publish Repository"**

Done! Your code is on GitHub! 🎉

---

## After Pushing to GitHub

Once your code is on GitHub, you can:
1. Deploy to Railway/Render (see `DEPLOY_STEPS.md`)
2. Share the GitHub repository link
3. Collaborate with others

