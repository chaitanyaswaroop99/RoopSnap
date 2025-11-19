# Fix Netlify Deployment - Add Backend

Your website is live on Netlify: **https://roopsnap.netlify.app/** ✅

However, the backend (API, database, photo uploads) isn't working because **Netlify only hosts static files** and can't run Node.js servers.

## Solution: Deploy Backend Separately

You need to deploy your backend (server.js) to a platform that supports Node.js, then connect it to your Netlify frontend.

---

## Option 1: Railway (Recommended) ⭐

### Step 1: Install Railway CLI

```powershell
npm install -g @railway/cli
```

### Step 2: Login

```powershell
railway login
```
This opens your browser to sign in (free account)

### Step 3: Deploy Backend

```powershell
cd "C:\Users\chait\OneDrive\Desktop\RoopSnap"
railway init
railway up
```

### Step 4: Get Your Backend URL

Railway will give you a URL like: `https://roopsnap-production.up.railway.app`

### Step 5: Update Frontend to Use Backend

Update your `script.js` to point to the Railway backend:

```javascript
// Change this line in script.js:
const API_BASE_URL = 'https://your-railway-url.railway.app';
```

### Step 6: Redeploy to Netlify

1. Update `script.js` with the Railway URL
2. Push changes or re-upload to Netlify

---

## Option 2: Render (Alternative)

### Step 1: Go to Render

Visit [render.com](https://render.com) and sign up

### Step 2: Create Web Service

1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository (or upload manually)
3. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Click **"Create Web Service"**

### Step 3: Get Backend URL

Render gives you: `https://roopsnap.onrender.com`

### Step 4: Update Frontend

Same as Railway - update `API_BASE_URL` in `script.js`

---

## Option 3: Keep Everything on Railway

Instead of Netlify + Railway, deploy everything to Railway:

### Steps:

1. **Deploy to Railway:**
   ```powershell
   npm install -g @railway/cli
   railway login
   cd "C:\Users\chait\OneDrive\Desktop\RoopSnap"
   railway init
   railway up
   ```

2. **Railway hosts both frontend and backend!**
   - Your site will be at: `https://roopsnap.railway.app`
   - Everything works together

This is simpler - one platform for everything!

---

## Quick Fix: Update API URL

If you deploy backend to Railway/Render, update your frontend:

### In `script.js`, change:

```javascript
// OLD (local):
const API_BASE_URL = window.location.origin;

// NEW (Railway backend):
const API_BASE_URL = 'https://your-railway-app.railway.app';
```

### In `admin.html`, change:

```javascript
// OLD:
const API_BASE_URL = window.location.origin;

// NEW:
const API_BASE_URL = 'https://your-railway-app.railway.app';
```

Then redeploy to Netlify.

---

## Recommended Approach

**Deploy everything to Railway** - it's simpler:
- One platform
- Frontend + Backend together
- No CORS issues
- Easier to manage

Just run:
```powershell
npm install -g @railway/cli
railway login
railway init
railway up
```

Done! 🎉

---

## Current Status

✅ **Frontend**: Working on Netlify  
❌ **Backend**: Not deployed (needs Railway/Render)  
✅ **Solution**: Deploy backend to Railway

---

Need help with any step? Let me know!

