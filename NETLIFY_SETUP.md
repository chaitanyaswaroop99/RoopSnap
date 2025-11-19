# Deploy RoopSnap to Netlify - Quick Guide

## ⚠️ Important Note

Your website has a **Node.js backend** (server.js) which Netlify **cannot run**. 

You have 2 options:

---

## Option 1: Deploy Everything to Railway (Recommended) ⭐

**Easiest - Everything in one place**

1. Push code to GitHub
2. Go to [railway.app](https://railway.app)
3. Deploy from GitHub
4. Done! Frontend + Backend + Database all work together

**See `DEPLOY_NOW.md` for detailed steps**

---

## Option 2: Split Deployment (Frontend on Netlify + Backend on Railway)

### Step 1: Deploy Backend First

1. **Deploy backend to Railway:**
   - Go to [railway.app](https://railway.app)
   - Sign in with GitHub
   - Create new project
   - Deploy your repository
   - Copy your Railway URL (e.g., `https://chaya-captures.railway.app`)

### Step 2: Update Frontend Code

Edit `script.js` line 80:

**Change from:**
```javascript
const API_BASE_URL = window.location.origin;
```

**To:**
```javascript
const API_BASE_URL = 'https://YOUR-RAILWAY-URL.railway.app';
```

(Replace with your actual Railway backend URL)

### Step 3: Deploy Frontend to Netlify

**Method A: Drag & Drop**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag your project folder
3. Done!

**Method B: GitHub**
1. Push code to GitHub
2. Go to [app.netlify.com](https://app.netlify.com)
3. "Add new site" → "Import from Git"
4. Connect GitHub → Select repo
5. Deploy!

---

## Why Not Just Netlify?

Netlify can't run:
- ❌ Node.js server (your server.js)
- ❌ SQLite database
- ❌ File uploads to server
- ❌ API endpoints

You need a platform that supports Node.js for your backend.

---

## Recommendation

**Use Railway** - It's easier and everything works together:
- ✅ One deployment
- ✅ Frontend + Backend together
- ✅ Database works
- ✅ File uploads work
- ✅ Free tier available

**See `DEPLOY_NOW.md` for Railway deployment!**

