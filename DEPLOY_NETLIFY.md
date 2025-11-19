# Deploy RoopSnap to Netlify

**Important:** Netlify is for static sites. Your app has a Node.js backend, so you need to deploy the backend separately.

## Two-Part Deployment

### Part 1: Deploy Backend (Required First)

Your backend (server.js) needs to run on a platform that supports Node.js:

#### Option A: Railway (Recommended)
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Create new project from GitHub repo
4. Deploy your backend
5. Copy your Railway URL (e.g., `https://chaya-captures.railway.app`)

#### Option B: Render
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo
4. Set Build: `npm install`, Start: `npm start`
5. Copy your Render URL

### Part 2: Deploy Frontend to Netlify

1. **Update Backend URL in Code**
   
   Edit `script.js` and change:
   ```javascript
   const API_BASE_URL = window.location.origin;
   ```
   
   To:
   ```javascript
   const API_BASE_URL = 'https://YOUR-BACKEND-URL.railway.app';
   ```
   (Replace with your actual backend URL)

2. **Update netlify.toml**
   
   Edit `netlify.toml` and replace:
   ```
   to = "https://YOUR-BACKEND-URL.railway.app/api/:splat"
   ```
   With your actual backend URL.

3. **Deploy to Netlify**
   
   **Method 1: Drag & Drop (Easiest)**
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag your entire project folder
   - Your site is live!

   **Method 2: GitHub Integration**
   - Push your code to GitHub
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub
   - Select your repository
   - Deploy!

## Better Alternative: Full-Stack on One Platform

Instead of splitting frontend/backend, consider deploying everything together:

### Railway (Best for Full-Stack)
- ✅ Hosts both frontend and backend
- ✅ Database support
- ✅ File uploads work
- ✅ Free tier available
- ✅ Automatic HTTPS

**Steps:**
1. Push code to GitHub
2. Go to railway.app
3. Deploy from GitHub
4. Done! Everything works together.

### Render (Also Good)
- ✅ Full-stack support
- ✅ Free tier (spins down when inactive)
- ✅ Easy setup

## Why Netlify Alone Won't Work

Netlify can't run:
- ❌ Node.js server (server.js)
- ❌ SQLite database
- ❌ File uploads to server
- ❌ API endpoints

You need a platform that supports Node.js for the backend.

## Recommendation

**Use Railway or Render** - They handle everything in one place:
- Frontend (HTML/CSS/JS)
- Backend (Node.js/Express)
- Database (SQLite)
- File uploads

See `DEPLOY_NOW.md` for Railway deployment steps.

