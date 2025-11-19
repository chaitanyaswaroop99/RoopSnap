# Full-Stack Deployment Guide - RoopSnap

This guide covers deploying your photography website with database backend.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Test Locally

```bash
npm start
```

Visit http://localhost:3000

### 3. Deploy to Production

Choose one of the platforms below:

---

## Deployment Platforms

### Option 1: Railway (Recommended) ⭐

**Best for:** Easy deployment with database support

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway auto-detects Node.js
6. Add environment variable: `PORT=3000` (optional, Railway sets this automatically)
7. Your site is live!

**Benefits:**
- Free tier available
- Automatic HTTPS
- Database persistence
- Easy file uploads
- Custom domain support

---

### Option 2: Render

**Best for:** Simple deployment with free tier

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Add environment variable: `PORT=3000`
7. Deploy!

**Note:** Free tier spins down after inactivity. Upgrade for always-on service.

---

### Option 3: Heroku

**Best for:** Established platform with add-ons

1. Install Heroku CLI: [heroku.com/cli](https://devcenter.heroku.com/articles/heroku-cli)
2. Login: `heroku login`
3. Create app: `heroku create chaya-captures`
4. Create `Procfile`:
   ```
   web: node server.js
   ```
5. Deploy: `git push heroku main`
6. Set port: `heroku config:set PORT=3000`

**Note:** Heroku free tier is discontinued. Paid plans start at $7/month.

---

### Option 4: DigitalOcean App Platform

**Best for:** Production apps with scaling

1. Go to [digitalocean.com](https://www.digitalocean.com)
2. Create account
3. Go to App Platform
4. Create App → Connect GitHub
5. Select repository
6. Auto-detects Node.js
7. Deploy!

**Pricing:** Starts at $5/month

---

### Option 5: Vercel (Frontend) + Railway/Render (Backend)

**Best for:** Separating frontend and backend

1. **Backend**: Deploy `server.js` to Railway/Render
2. **Frontend**: Deploy static files to Vercel
3. Update `API_BASE_URL` in `script.js` to your backend URL

---

## Important Files for Deployment

### Procfile (for Heroku/Railway)

Create `Procfile`:
```
web: node server.js
```

### .gitignore

Make sure `.gitignore` includes:
```
node_modules/
uploads/
database.sqlite
.env
.DS_Store
```

### Environment Variables

Set these in your hosting platform:

- `PORT` - Server port (usually auto-set by platform)
- `NODE_ENV=production` - Production mode
- `ADMIN_API_KEY` - Secret key required to access admin APIs (set a strong value)

---

## Database Considerations

### SQLite (Current Setup)

✅ **Works for:**
- Small to medium sites
- Single server deployments
- Development/testing

⚠️ **Limitations:**
- Not ideal for multiple servers
- File-based (needs persistent storage)
- Backup required

### For Production Scale

Consider migrating to:
- **PostgreSQL** (Railway, Render, Heroku all support)
- **MySQL** (Most platforms support)
- **MongoDB** (MongoDB Atlas free tier)

---

## File Upload Storage

### Current: Local Storage

Photos stored in `uploads/` folder on server.

### For Production: Cloud Storage

Consider migrating to:
- **AWS S3** (Most reliable)
- **Cloudinary** (Image optimization)
- **Google Cloud Storage**
- **DigitalOcean Spaces**

---

## Step-by-Step: Railway Deployment

### 1. Prepare Your Code

```bash
# Make sure all files are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Railway

1. Visit [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your repository
6. Railway will:
   - Detect Node.js
   - Run `npm install`
   - Start your server
7. Click on your project → Settings → Generate Domain
8. Your site is live! 🎉

### 3. Access Admin Panel

Visit: `https://your-app-name.railway.app/admin.html`

---

## Post-Deployment Checklist

- [ ] Test website loads correctly
- [ ] Test photo upload in admin panel
- [ ] Test contact form submission
- [ ] Verify database persists (upload a photo, restart server, check it's still there)
- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (usually automatic)
- [ ] Set up database backups
- [ ] Monitor server logs

---

## Custom Domain Setup

### Railway

1. Go to project Settings → Domains
2. Add your domain
3. Update DNS records as shown
4. SSL certificate auto-generated

### Render

1. Go to service Settings → Custom Domains
2. Add domain
3. Follow DNS instructions
4. SSL auto-configured

---

## Monitoring & Maintenance

### View Logs

- **Railway**: Project → Deployments → View logs
- **Render**: Service → Logs
- **Heroku**: `heroku logs --tail`

### Database Backup

```bash
# Download database
scp user@server:/path/to/database.sqlite ./backup.sqlite

# Or use platform's backup feature
```

### Update Your Site

```bash
git add .
git commit -m "Update"
git push origin main
# Platform auto-deploys
```

---

## Troubleshooting

### Build Fails

- Check Node.js version (should be 14+)
- Verify `package.json` is correct
- Check build logs for errors

### Server Crashes

- Check server logs
- Verify PORT environment variable
- Check database file permissions

### Photos Not Uploading

- Verify `uploads/` folder exists
- Check file permissions
- Verify file size limits

### Database Errors

- Ensure database file is writable
- Check disk space
- Verify SQLite is installed

---

## Security Recommendations

1. **Add Admin Authentication**
   - Implement login for admin panel
   - Use environment variables for secrets

2. **Rate Limiting**
   - Add rate limiting to API endpoints
   - Prevent abuse

3. **Input Validation**
   - Validate all user inputs
   - Sanitize file uploads

4. **HTTPS Only**
   - Force HTTPS in production
   - Secure cookies if using sessions

---

## Cost Comparison

| Platform | Free Tier | Paid Starts At | Best For |
|----------|-----------|----------------|----------|
| **Railway** | ✅ $5 credit/month | $5/month | Easy deployment |
| **Render** | ✅ Limited | $7/month | Simple setup |
| **Heroku** | ❌ | $7/month | Established platform |
| **DigitalOcean** | ❌ | $5/month | Production apps |
| **Vercel** | ✅ | $20/month | Frontend only |

---

## Quick Deploy Commands

### Railway CLI

```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

### Heroku CLI

```bash
heroku create chaya-captures
git push heroku main
```

---

## Need Help?

- Check platform documentation
- Review server logs
- Test locally first
- Check environment variables

---

**Your full-stack photography website is ready to deploy! 🚀**

